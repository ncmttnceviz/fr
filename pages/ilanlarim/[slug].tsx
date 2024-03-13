import FilterFormContextProps from "@/contexts/FilterFormContextProps";
import useMakeLayout from "@/hooks/useMakeLayout";
import useSetupInitialFilter from "@/hooks/useSetupInitialFilter";
import getCategories from "@/requests/getCategories";
import getCities from "@/requests/getCities";
import { useDispatch } from "react-redux";

import NewAdvertForm from "@/components/form/new-advert-form";
import { withAuth, WithAuthGetServerSideProps } from "@/feature/withAuth";
import Default from "@/layouts/default";
import {
  AdvertPlanModel,
  DetailAdvertModel,
  UpdateAdvertModel,
} from "@/models/advert-model";
import getAdvertPlans from "@/requests/getAdvertPlans";
import { Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import getAdvert from "@/requests/getAdvert";
import getCategoryDetailed from "@/requests/getCategoryDetailed";
import UpdateAdvertForm from "@/components/form/update-advert-form";
import { CategoryDetailModel } from "@/models/category-model";
import getAdvertForUpdate from "@/requests/getAdvertForUpdate";

export default function UpdateAdvert({
  category,
  advert,
}: {
  advert: UpdateAdvertModel;
  category: CategoryDetailModel;
}) {
  console.log({ advert });

  return (
    <>
      <Container>
        <Typography
          component="h1"
          typography={"h3"}
          fontWeight={700}
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: { xs: "2rem", sm: "3.2rem" },
          }}
        >
          İLANI GÜNCELLE
        </Typography>
        <UpdateAdvertForm advert={advert} category={category} />
      </Container>
    </>
  );
}
UpdateAdvert.getLayout = useMakeLayout(Default);

export const getServerSideProps: WithAuthGetServerSideProps = withAuth(
  async (context, user, axios) => {
    try {
      const slug: string = context.params?.slug as string;
      if (!user?.email_verified) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
      const advert: UpdateAdvertModel = await getAdvertForUpdate(axios, slug);
      const category = await getCategoryDetailed(
        axios,
        String(advert.category_tree.slice(-1)[0].id)
      );
      const props = {
        advert,
        category,
      };
      return { props };
    } catch (error) {
      console.error(error);
      return {
        notFound: true,
      };
    }
  }
);
