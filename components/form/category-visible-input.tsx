import CategoryModel, { CategoryDetailModel } from "@/models/category-model";
import { RootState } from "@/store";
import { handleCategoryModal, setDynamicCategory } from "@/store/category-tree";
import {
    TreeItem,
    TreeItemContentProps,
    TreeItemProps,
    TreeView,
} from "@mui/lab";
import { alpha, Box, Card, CardContent, Container, Link, Modal, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { forwardRef, HTMLAttributes, Ref, useCallback, useContext, useEffect, useMemo, useState } from "react";
import getCategory from "@/requests/getCategory";
import makeAxios from "@/feature/makeAxios";
import getCategoryDetailed from "@/requests/getCategoryDetailed";
import useClientAxios from "@/hooks/useClientAxios";
import { PropaneTankSharp } from "@mui/icons-material";
import { AuthContext } from "@/pages/_app";
import { openInfoSnackbar } from "@/store/info-snackbar";
const renderTreeItems = (categories: CategoryModel[], onCategorySelected: (model: CategoryDetailModel|string,isChild: boolean) => void, categoryId: string) => {
    if (!!!categories?.length) {
        return null;
    }
    return categories.map((category,) => {
        return (
            <TreeItem
                key={category.id}
                nodeId={`${category.id}`}
                ContentComponent={TreeItemLink}
                ContentProps={{ selectedCategory: categoryId, categoryId: category.id + "", hasChild: !!category?.children?.length, onCategorySelected: onCategorySelected } as HTMLAttributes<HTMLElement>}
                label={category?.title}

            >
                {renderTreeItems(category.children, onCategorySelected, categoryId)}
            </TreeItem>
        );
    });
};


export default function CategoryVisibleInput({ onCategorySelected }: { onCategorySelected: (model: CategoryDetailModel | null) => void }) {
    const categories = useSelector(
        (state: RootState) => state.categoryTree.categories
    );
    const getExpandedList = useCallback((categories: CategoryModel[], list: string[], depth = 0) => {
        if(depth> 1)return list;
        if (categories?.length) {
            categories.forEach((category) => {
                list.push("" + category.id);
                if (category?.children?.length > 0) {
                    getExpandedList(category.children, list, depth + 1);
                }

            });
        }
        return list;
    }, []);
    useEffect(() => {
        setExpandedList(getExpandedList(categories,[]));
    },[]);
    const [expandedList,setExpandedList] = useState<string[]>([]);
    const [category, setCategory] = useState<CategoryDetailModel | null>(null);

    useEffect(() => {
        onCategorySelected(category);
    }, [category])

    const handleOnCategorySelected = (category: string|CategoryDetailModel,isChild: boolean )=> {

        if(category && typeof category !== 'string') {
            setCategory(category);
        }
        else {
            if(expandedList.findIndex((o => o === category)) !== -1){

                setExpandedList(el => [...el.filter(o => o !== category)])
            }
            else {

                setExpandedList(el => [...el,category])
            }
        }

    }
    return (


        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon fontSize="small" />}
            defaultExpandIcon={<ChevronRightIcon fontSize="small" />}
            expanded={expandedList}
            selected={category?.id ? "" + [category.id] : ""}

            sx={{

            }}
        >
            {renderTreeItems(categories, handleOnCategorySelected, category?.id ? "" + category.id : "")}
        </TreeView>

    );
}

const TreeItemLink = forwardRef((props: TreeItemContentProps & { selectedCategory?: string, hasChild?: boolean, categoryId?: string, onCategorySelected?: (model: CategoryDetailModel|string,parent: boolean) => void }, ref) => {
    const actx = useContext(AuthContext);
    const axios = useClientAxios(actx.user);
    const dispatch = useDispatch();
    const isActive = useMemo(() => !!(props.selectedCategory && props.categoryId && props.categoryId == props.selectedCategory), [props.selectedCategory])
    const onClick = async () => {
        if (!props.hasChild && props.categoryId && props.onCategorySelected) {
            try {

                const category = await getCategoryDetailed(axios, props.categoryId);
                props.onCategorySelected(category,false);
            }
            catch (error) {
                console.error(error);
            }
        }
        else if(props.onCategorySelected){
            props.onCategorySelected(props.categoryId||"",true);
            
        }
    }
    return (
        <Box onClick={onClick} ref={ref as Ref<HTMLDivElement>} sx={[{
            display: 'flex', gap: 1,
            justifyContent: 'stretch',
            alignItems: 'center',
            fontSize: { xs: "1.3rem", sm: "1.2rem" },
            color: 'primary.main',
            cursor: 'pointer',
            width: 1,
            '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02)
            }
        },
        !!!props.hasChild && {
            pl: 2.8
        },
        isActive && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15) + " !important"
        }
        ]}>
            {props.expansionIcon}
            {props.icon}

            {props.label}
        </Box>
    );
});
