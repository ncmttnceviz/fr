import BlockButton from "@/components/form/block-button";
import AdvertCard from "@/components/image/advert-card";
import CategoryModal from "@/components/modal/category-modal";
import FilterModal from "@/components/modal/filter-modal";
import CategoryNavigatior from "@/components/navigation/category-navigator";
import SortBar from "@/components/pages/adverts/sort-bar";
import { prepareFilterQueryForBackend, readFilterQuery } from "@/feature/makeFilterQuery";
import { withAuth, WithAuthGetServerSideProps } from "@/feature/withAuth";
import useFilterQuery from "@/hooks/useFilterQuery";
import useMakeLayout from "@/hooks/useMakeLayout";
import useSetupInitialFilter from "@/hooks/useSetupInitialFilter";
import Default from "@/layouts/default";
import { ListingAdvertModel } from "@/models/advert-model";
import CategoryModel, { BaseCategoryModel } from "@/models/category-model";
import { CityModel } from "@/models/location-models";
import { FilterValueModel, OptionModel, SortModel } from "@/models/option-models";
import { PaginationModel } from "@/models/pagination-model";
import getCategories from "@/requests/getCategories";
import getCategory from "@/requests/getCategory";
import getCities from "@/requests/getCities";
import { RootState } from "@/store";
import { specialOptions } from "@/store/filter";
import { Box, Container, Grid, Link, Pagination, PaginationItem, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";


const CategoryForm = dynamic(() => import("@/components/form/category-form"))
const MobileSortBar = dynamic(() => import("@/components/pages/adverts/mobile-sort-bar"))
const ChevronRight = dynamic(() => import("@mui/icons-material/ChevronRight"));
export default function Adverts({
  categoryTree,
  category,
  categoryAncestors,
  paginatedData,
  options,
  cities,
  defaultSort,
  defaultFilterValues,
}: {
  categoryTree: CategoryModel[];
  category: CategoryModel;
  categoryAncestors: CategoryModel[];
  paginatedData: PaginationModel<ListingAdvertModel>;
  options: OptionModel[];
  cities: CityModel[];
  defaultSort?: SortModel,
  defaultFilterValues: FilterValueModel[]
}) {

  const router = useRouter();
  useSetupInitialFilter(categoryTree, options, cities, defaultFilterValues, defaultSort);
  const ancestorName = useMemo(() => {
    if (categoryAncestors?.length) {
      return categoryAncestors[categoryAncestors?.length - 1].title;
    }
    return null;
  }, [categoryAncestors]);

  const filterQuery = useFilterQuery();
  const sort = useSelector((state: RootState) => state.filter.sortingValue);
  const makePageQuery = useCallback((page: number | null) => {
    const r = { ...filterQuery, slug: category?.slug?.split('/') };
    if (page && page > 1) {
      r.page = page;
    }
    return r;
  }, [category, filterQuery])
  return (
    <Container sx={{ mb: 4 }}>
      <CategoryModal category={category} linked />
      <FilterModal category={category} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 2 }}>
            <Typography
              component="h1"
              typography={"h3"}
              fontWeight={700}
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontSize: { xs: "2rem", sm: "3.2rem" },
                "@media(max-width: 450px)": {
                  fontSize: "1.4rem",
                },
              }}
            >
              {!!ancestorName && (
                <Box
                  component="span"
                  sx={{
                    fontWeight: 400,
                  }}
                >
                  {ancestorName?.toLocaleUpperCase('tr-TR')}
                </Box>
              )}
              {!!ancestorName && <ChevronRight sx={{ mx: 0.5 }} />}
              {category?.title.toLocaleUpperCase('tr-TR')}
            </Typography>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              rowSpacing={2}
            >
              <Grid item>
                {paginatedData.total > 0 && <Typography
                  component="span"
                  typography={"subtitle2"}
                  fontWeight={400}
                  fontSize={".95rem"}
                >
                  Toplam: <strong>{paginatedData.total} sonuç</strong> {<Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
                    - {sort.title}
                  </Box>}
                </Typography>}
              </Grid>
              <Grid
                item
                xs={12}
                sm={"auto"}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                <MobileSortBar />
              </Grid>
            </Grid>

            <SortBar sx={{ my: 2, display: { xs: "none", md: "flex" } }} />
          </Box>

          <Grid container spacing={2} justifyContent={paginatedData.total > 0 ? 'flex-start' : 'center'}>
            {paginatedData.total > 0 && paginatedData.items.map((ad, index) => (
              <Grid key={index} item xs={12} sm={6}>
                <AdvertCard advert={ad} />
              </Grid>
            ))}
            {paginatedData.total == 0 && <Grid item sm={12}>
              <Box sx={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', rowGap: 3 }}>
                <Typography sx={{ typography: 'h6' }}>
                  Aradığınız kriterlerde bir ilan yok.
                </Typography>
                <BlockButton onClick={() => router.back()} color="secondary">GERİ GİT</BlockButton>
              </Box>

            </Grid>}
          </Grid>
          {paginatedData.total_page > 1 && <Pagination
            color="secondary"
            sx={{ display: "flex", justifyContent: "center", my: 4 }}

            count={paginatedData.total_page}
            defaultPage={paginatedData.current_page}
            boundaryCount={2}
            renderItem={(item) => (
              <NextLink passHref href={{ pathname: '/ilanlar/[[...slug]]', query: makePageQuery(item.page) }}>
                <PaginationItem
                  component={Link}
                  {...item}
                />
              </NextLink>
            )}

          />}
        </Grid>
        <Grid item md={3} sx={{ display: { xs: "none", md: "block" } }}>
          <Box>
            <Typography
              component="h4"
              typography={"h4"}
              fontWeight={700}
              sx={{ fontSize: { xs: "1.8rem", lg: "2.2rem" }, my: 1.5 }}
            >
              KATEGORİLER
            </Typography>
            <CategoryNavigatior
            category={category}
            linked
            sx={{
              borderRadius: 0,
              border: 1,
              borderColor: 'grey.400',
              boxShadow: 'none',
              maxHeight: 480,
              overflow: 'auto',
              "&::-webkit-scrollbar": {
                width: (theme: any) => theme.spacing(1.5),
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(0,0,0,.05)",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(0,0,0,.1);",
              },

            }} noTitle />
          </Box>
          <Typography
            component="h4"
            typography={"h4"}
            fontWeight={700}
            sx={{ fontSize: { xs: "1.8rem", lg: "2.2rem" }, my: 1.5 }}
          >
            FİLTRELE
          </Typography>
          <Typography
            component="p"
            typography={"body2"}
            sx={{ mt: 1, mb: 2, fontSize: "0.9rem" }}
          >
            Aradığınız ilanı daha kolay bulun.
          </Typography>
          <CategoryForm category={category} />
        </Grid>
      </Grid>
    </Container>
  );
}
export const getServerSideProps: WithAuthGetServerSideProps = withAuth(async (context, user, axios) => {
  try {
    const slug: string[] = (context.params?.slug as string[]) || [];

    let queryParams: any = {};
    if (context.query) {
      queryParams = prepareFilterQueryForBackend(context.query);

    }
    const [categoryTree, { paginatedData, options, category, categoryAncestors }, cities] = await Promise.all([getCategories(axios), getCategory(axios, slug?.join("/"), queryParams), getCities(axios)])
    const customOptions = [...specialOptions, ...options];
    const { defaultFilterValues, defaultSort } = readFilterQuery(customOptions, context.query)
    return {
      props: {
        categoryTree,
        paginatedData,
        options: customOptions,
        category,
        categoryAncestors,
        cities,
        defaultFilterValues,
        defaultSort
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  } finally {
  }
});
Adverts.getLayout = useMakeLayout(Default);
