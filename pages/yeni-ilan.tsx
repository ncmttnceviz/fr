
import FilterFormContextProps from "@/contexts/FilterFormContextProps";
import useMakeLayout from "@/hooks/useMakeLayout";
import useSetupInitialFilter from "@/hooks/useSetupInitialFilter";
import getCategories from "@/requests/getCategories";
import getCities from "@/requests/getCities";
import { useDispatch } from "react-redux";

import NewAdvertForm from "@/components/form/new-advert-form";
import { withAuth, WithAuthGetServerSideProps } from "@/feature/withAuth";
import Default from "@/layouts/default";
import { AdvertPlanModel } from "@/models/advert-model";
import getAdvertPlans from "@/requests/getAdvertPlans";
import { Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function NewAdvert({
  categoryTree,
  cities,
  advertPlans,
}: {advertPlans: AdvertPlanModel[]} & FilterFormContextProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  useSetupInitialFilter(categoryTree, [], cities);
  return (
    <>
      <Container>
        <Typography
          component="h1"
          typography={"h3"}
          fontWeight={700}
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: { xs: "2rem", sm: "3.2rem" },
          }}
        >
          YENİ İLAN EKLE
        </Typography>
        <NewAdvertForm advertPlans={advertPlans}/>
      </Container>

    </>
  );
}
NewAdvert.getLayout = useMakeLayout(Default)



export const getServerSideProps: WithAuthGetServerSideProps = withAuth(async (context, user, axios) => {


  try {
    let queryParams = {};
    if(!user?.email_verified || !user?.email_verified) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }
    const [categoryTree, cities,advertPlans] = await Promise.all([getCategories(axios), getCities(axios),getAdvertPlans(axios)])
    return {
      props: {
        categoryTree,
        cities,
        advertPlans,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  } finally {
  }
}, true);
