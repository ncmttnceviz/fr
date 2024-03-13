
import AdvertCard from "@/components/image/advert-card";
import { ProfileInfo } from "@/components/pages/advert/profile-info";
import { withAuth, WithAuthGetServerSideProps } from "@/feature/withAuth";
import useMakeLayout from "@/hooks/useMakeLayout";
import Default from "@/layouts/default";
import { AdvertUserModel, ListingAdvertModel } from "@/models/advert-model";
import { CorporateModel } from "@/models/auth-models";
import { PaginationModel } from "@/models/pagination-model";
import getCorporate from "@/requests/getCorporate";
import getCorporateAdverts from "@/requests/getCorporateAdverts";
import getFavorites from "@/requests/getFavorites";
import {
  Card,
  CardContent, Container, Grid,
  Link,
  Pagination,
  PaginationItem, Typography
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
export default function Favorites({
  adverts,
}: {
  adverts: ListingAdvertModel[];
}) {
  const router = useRouter();
  return (
    <Container sx={{ mb: 6 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
        <Typography
            component={"h5"}
            sx={{
              typography: { xs: "h5", sm: "h4" },
              fontWeight: { xs: 700, sm: 700 },
              fontSize: { xs: "2rem",sm: "3rem" },
              mb: 2,
            }}
          >
            FAVORİLER
          </Typography>
          <Grid
            container
            spacing={2}
          >
            {adverts.map((ad, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} >
                <AdvertCard advert={ad} />
              </Grid>
            ))}
          </Grid>
          
        </Grid>
      </Grid>
    </Container>
  );
}

export const getServerSideProps: WithAuthGetServerSideProps = withAuth(
  async (context, user, axios) => {
    try {
      const [adverts] = await Promise.all([
        getFavorites(axios),
      ]);
      return {
        props: {
          adverts,
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
,true);
Favorites.getLayout = useMakeLayout(Default);
