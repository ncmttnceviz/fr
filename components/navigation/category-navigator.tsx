import useClientAxios from "@/hooks/useClientAxios";
import useCombineSx from "@/hooks/useCombineSx";
import useFilterQuery from "@/hooks/useFilterQuery";
import { BaseCategoryModel } from "@/models/category-model";
import { AuthContext } from "@/pages/_app";
import getCategories from "@/requests/getCategories";
import { handleCategoryModal } from "@/store/category-tree";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TreeItem, TreeItemContentProps, TreeView } from "@mui/lab";
import {
  alpha,
  Box,
  Card,
  CardContent,
  IconButton,
  Link,
  SxProps,
  Theme,
  Typography
} from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import {
  createContext,
  forwardRef,
  HTMLAttributes,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useDispatch } from "react-redux";
const renderTreeItems = (categories: BaseCategoryModel[]) => {
  if (!!!categories?.length) {
    return null;
  }
  return [...categories]
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((category) => {
      return (
        <TreeItem
          key={category.id}
          nodeId={`${category.id}`}
          ContentComponent={TreeItemLink}
          ContentProps={
            {
              category: category,
            } as HTMLAttributes<HTMLElement>
          }
          label={category?.title}
        >
          {renderTreeItems(category.children)}
        </TreeItem>
      );
    });
};

const NavigatorSelectedContext = createContext<{
  category?: BaseCategoryModel | undefined;
  linked?: boolean;
  onChange?: (category?: BaseCategoryModel) => void;
}>({});
export default function CategoryNavigatior({
  sx,
  noTitle,
  onChange,
  category,
  linked,
}: {
  sx?: SxProps<Theme>;
  noTitle?: boolean;
  onChange?: (category?: BaseCategoryModel) => void;
  category?: BaseCategoryModel;
  linked?: boolean;
}) {
  const sxx = useCombineSx(sx);
  const getExpandedList = useCallback(
    (categories: BaseCategoryModel[], list: string[], depth = 0) => {
      if (categories?.length) {
        categories.forEach((category) => {
          list.push("" + category.id);
          if (category?.children?.length > 0) {
            getExpandedList(category.children, list, depth + 1);
          }
        });
      }
      return list;
    },
    []
  );
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<BaseCategoryModel[]>([]);
  const [expandedList, setExpandedList] = useState<string[]>([]);
  const actx = useContext(AuthContext);
  const axios = useClientAxios(actx.user);
  useEffect(() => {
    const fn = async () => {
      const categories = (await getCategories(
        axios,
        category?.slug
      )) as BaseCategoryModel[];
      setCategories(categories);
      setExpandedList(getExpandedList(categories, []));
    };
    fn();
  }, [category]);
  const contextValue = useMemo(() => {
    return {
      category,
      linked: linked,
      onChange,
    };
  }, [category, linked, onChange]);

  return (
    <Card sx={[...sxx]}>
      {!!!noTitle && (
        <CardContent
          sx={{
            borderBottom: 1,
            borderBottomColor: "grey.600",
            py: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ typography: "h6", color: "primary.main" }}>
            Kategori Seçin
          </Typography>
          <IconButton onClick={() => dispatch(handleCategoryModal(false))}>
            <CloseIcon />
          </IconButton>
        </CardContent>
      )}
      <CardContent
        sx={{
          width: 1,
          height: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: (theme) => theme.spacing(1.5),
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0,0,0,.05)",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0,0,0,.1);",
          },
        }}
      >
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon fontSize="small" />}
          defaultExpandIcon={<ChevronRightIcon fontSize="small" />}
          expanded={expandedList}
          sx={{}}
        >
          <NavigatorSelectedContext.Provider value={contextValue}>
            <TreeItem
              nodeId={`-999`}
              ContentComponent={TreeItemLink}
              ContentProps={
                {
                  category: undefined,
                } as HTMLAttributes<HTMLElement>
              }
              label={"Tüm İlanlar"}
            />
            {renderTreeItems(categories)}
          </NavigatorSelectedContext.Provider>
        </TreeView>
      </CardContent>
    </Card>
  );
}

const TreeItemLink = forwardRef(
  (
    props: TreeItemContentProps & {
      category?: BaseCategoryModel;
    },
    ref
  ) => {
    const tctx = useContext(NavigatorSelectedContext);
    const isActive = useMemo(
      () => tctx.category?.slug == props.category?.slug,
      [tctx.category]
    );
    const query = useFilterQuery();
    const querySorts = useMemo(() => {
      if (query.sort_by && query.sort) {
        return {
          sort_by: query.sort_by,
          sort: query.sort,
        };
      }
      return {};
    }, [query]);

    return (
      <Box
        onClick={() => tctx.onChange && tctx.onChange(props.category)}
        ref={ref as Ref<HTMLAnchorElement>}
        sx={[
          {
            display: "flex",
            gap: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            fontSize: { xs: "1.3rem", sm: "1.2rem" },
            color: "primary.main",
            cursor: "pointer",
            width: 1,
            borderRadius: 2 ,
            px: 1,
           
          },
          !isActive && {
            "&:hover": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
            },
          },
          isActive && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
           
          },
        ]}
      >
        

        {props.icon}
        <Box sx={{ width: "24px", height: "24px", position: "relative",flexGrow: 0,flexShrink: 0 }}>
        {props?.category?.images?.medium && (
          
            <Image src={props?.category?.images?.medium} quality={100} layout="fill" objectFit="contain"/>
         
        )}
         </Box>

        {!!tctx.linked && (
          <NextLink
         
            href={{
              pathname: props?.category?.slug
                ? "/ilanlar/" + props?.category?.slug
                : "/ilanlar",
              query: querySorts,
            }}
            passHref
          >
            <Link sx={{ textDecoration: "none", display: "block", width: 1,color: 'currentcolor' }}>
              {props.label}
            </Link>
          </NextLink>
        )}
        {!!!tctx.linked && (props.category?.title || props.label)}
      </Box>
    );
  }
);
