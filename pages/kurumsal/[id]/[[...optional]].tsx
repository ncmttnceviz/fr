
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
export default function AdvertPage({
  corporate,
  adverts,
}: {
  corporate: CorporateModel;
  adverts: PaginationModel<ListingAdvertModel>;
}) {
  const router = useRouter();
  const fakeUser = useMemo(() => {
    return {
      fullname: corporate.company,
      advert_phone: corporate.phone,
      whatsapp: corporate.whatsapp,
      image: corporate.image?.medium
    } as AdvertUserModel
  },[corporate])
  return (
    <Container sx={{ mb: 6 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
        <Typography
            component={"h5"}
            sx={{
              typography: { xs: "h5", sm: "h4" },
              fontWeight: { xs: 700, sm: 700 },
              fontSize: { xs: "2rem",sm: "3rem" },
              mb: 2,
            }}
          >
            İLANLAR
          </Typography>
          <Grid
            container
            spacing={2}
            justifyContent={adverts.total > 0 ? "flex-start" : "center"}
          >
            {adverts.items.map((ad, index) => (
              <Grid key={index} item xs={12} sm={6} lg={4}>
                <AdvertCard advert={ad} />
              </Grid>
            ))}
          </Grid>
          {adverts.total_page > 1 && (
            <Pagination
              color="secondary"
              sx={{ display: "flex", justifyContent: "center", my: 4 }}
              count={parseInt(adverts.total_page + "")}
              defaultPage={parseInt(adverts.current_page + "")}
              boundaryCount={2}
              renderItem={(item) => (
                <NextLink
                  passHref
                  href={{
                    pathname: "/kurumsal/[id]/[[...optional]]",
                    query: {
                      id: router.query.id,
                      optional: [item.page as number],
                    },
                  }}
                >
                  <PaginationItem component={Link} {...item} />
                </NextLink>
              )}
            />
          )}
        </Grid>
        <Grid item xs={12} md={3} order={{xs: -1,md: 1}}>
          <Card sx={{ position: "sticky", top: 70 }}>
            <CardContent>
             <ProfileInfo user={fakeUser}/>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export const getServerSideProps: WithAuthGetServerSideProps = withAuth(
  async (context, user, axios) => {
    try {
      let page = 1;
      try {
        if (context.params?.optional) {
          page = context.params.optional[0] as unknown as number;
        }
      } catch (err) {}
      const queryParams: any = {
        page,
        per_page: 16,
      };
      const id: string = context.params?.id as string;
      const [corporate, adverts] = await Promise.all([
        getCorporate(axios, id),
        getCorporateAdverts(axios, id, queryParams),
      ]);
      if (
        adverts.current_page > adverts.total_page &&
        adverts.total_page != 0
      ) {
        throw new Error("out of bounds page");
      }

      return {
        props: {
          corporate,
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
);
AdvertPage.getLayout = useMakeLayout(Default);
