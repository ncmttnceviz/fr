import Box from "@mui/material/Box";
import BlockButton from "@/components/form/block-button"
import FilterForm from "./filter-form";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import CategoryInput from "./category-input";
import useFilterQuery from "@/hooks/useFilterQuery";
import NextLink from "next/link";
import { Link } from "@mui/material";
export default function FormHero() {
  const options = useSelector((state: RootState) => state.filter.options);
  const category = useSelector((state: RootState) => state.categoryTree.category);
  const filterQuery = useFilterQuery();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        rowGap: 1,
        width: 1,
        maxWidth: 370,
        px: 3,
        py: 4,
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: 'auto',
        height: 'auto',
        bgcolor: "rgba(255,255,255,.3)",
        '.MuiInputLabel-root': {
          color: 'white !important'
        }
      }}
    >
      <CategoryInput category={category} />
      <FilterForm options={options} />
      <NextLink href={{ pathname: '/ilanlar/[[...slug]]', query: { ...filterQuery, slug: category?.slug?.split('/') } }} passHref>

        <Link sx={{ mt: 2 }}>
          <BlockButton color="secondary">ARAMA</BlockButton>
        </Link>
      </NextLink>

    </Box>
  );
}
