import BlockButton from "@/components/form/block-button";
import useCombineSx from "@/hooks/useCombineSx";
import useFilterQuery from "@/hooks/useFilterQuery";
import CategoryModel from "@/models/category-model";
import { RootState } from "@/store";
import { Divider, Link, SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import NextLink from "next/link";
import { useSelector } from "react-redux";
import FilterForm from "./filter-form";
export default function CategoryForm({
  category,
  sx,
  children,
}: {
  category: CategoryModel;
  sx?: SxProps<Theme>;
  children?: any;
}) {
  const options = useSelector((state: RootState) => state.filter.options);
  const filterQuery = useFilterQuery();
  const sxx = useCombineSx(sx);
  return (
    <Box
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          rowGap: 1,
          width: 1,
          pt: !!children ? 1.5:3,
          pb: 3,
          bgcolor: "common.white",
          border: 1,
          borderColor: "grey.400",
        },
        ...sxx,
      ]}
    >
      <Box
        sx={{
          px: 3,
        }}
      >
        {children}
      </Box>

      {!!children && <Divider />}
      <Box
        sx={{
          px: 3,

        }}
      >
        <FilterForm options={options}  />
        <Box sx={{my: 1.5}}></Box>
        <NextLink
          href={{
            pathname: "/ilanlar/[[...slug]]",
            query: { ...filterQuery, slug: category.slug?.split("/") },
          }}
          passHref
        >
          <Link sx={{ bottom: 4, position: "sticky" }}>
            <BlockButton color="secondary">FİLTRELE</BlockButton>
          </Link>
        </NextLink>
      </Box>
    </Box>
  );
}
