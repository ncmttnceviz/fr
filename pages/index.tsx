import Hero from "@/components/image/HeroD";
import Header from "@/components/navigation/header";

import AboutBlock from "@/components/pages/index/about-block";
import AdvertListing from "@/components/pages/index/advert-listing";
import ShowcaseBlock from "@/components/pages/index/showcase-block";
import FilterFormContextProps from "@/contexts/FilterFormContextProps";
import useMakeLayout from "@/hooks/useMakeLayout";
import useSetupInitialFilter from "@/hooks/useSetupInitialFilter";
import FooterOnly from "@/layouts/footer-only";
import CategoryModal from "@/components/modal/category-modal";
import getCategories from "@/requests/getCategories";
import getCategory from "@/requests/getCategory";
import getCities from "@/requests/getCities";
import { specialOptions } from "@/store/filter";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { setDynamicCategory } from "@/store/category-tree";
import { withAuth, WithAuthGetServerSideProps } from "@/feature/withAuth";
import { openInfoSnackbar } from "@/store/info-snackbar";
import { useRouter } from "next/router";
import HeaderSticky from "@/components/navigation/header-sticky";
import getShowcase from "@/requests/getShowcase";
import { ListingAdvertModel } from "@/models/advert-model";
import InfoBlock from "@/components/pages/index/info-block";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import HeroContentSecondary from "@/components/content/hero-content-secondary";
import RealtorBlock from "@/components/pages/index/realtor-block";
import { CorporateModel } from "@/models/auth-models";
import getCorporates from "@/requests/getCorporates";

export default function Home({
  categoryTree,
  corporates,
  options,
  cities,
  showcaseItems,
}: { showcaseItems: ListingAdvertModel[] } & FilterFormContextProps & {
    corporates: CorporateModel[];
  }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const category = useSelector(
    (state: RootState) => state.categoryTree.category
  );
  useEffect(() => {
    if (router.query.logout !== undefined) {
      dispatch(
        openInfoSnackbar({
          severity: "error",
          message: "Oturum süreniz doldu.",
        })
      );
    }
  }, [router.pathname]);
  useSetupInitialFilter(categoryTree, options, cities);
  return (
    <>
      <CategoryModal
        linked={false}
        category={category}
        onChange={(cat) => dispatch(setDynamicCategory({ category: cat }))}
      />
      <HeaderSticky />
      <Hero>
        <Header />
        <HeroContentSecondary />
      </Hero>
      {corporates?.length > 0 && <RealtorBlock corporates={corporates} />}
      {showcaseItems?.length > 0 && <ShowcaseBlock adverts={showcaseItems} />}
      <AboutBlock />
      
      <AdvertListing sx={{ my: 5 }} />
      <InfoBlock />
    </>
  );
}
Home.getLayout = useMakeLayout(FooterOnly);

export const getServerSideProps: WithAuthGetServerSideProps = withAuth(
  async (context, user, axios) => {
    try {
      let queryParams = {};
      const [
        categoryTree,
        { paginatedData, category, categoryAncestors },
        cities,
        showcaseItems,
        corporates,
      ] = await Promise.all([
        getCategories(axios),
        getCategory(axios, "", queryParams),
        getCities(axios),
        getShowcase(axios),
        getCorporates(axios)
      ]);
      const customOptions = [...specialOptions];
      return {
        props: {
          categoryTree,
          paginatedData,
          options: customOptions,
          category,
          categoryAncestors,
          cities,
          showcaseItems,
          corporates,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        notFound: true,
      };
    } finally {
    }
  }
);
