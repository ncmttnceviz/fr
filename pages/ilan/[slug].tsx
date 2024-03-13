import GallerySlider from "@/components/pages/advert/gallery-slider";
import useCombinedLocation from "@/hooks/useCombinedLocation";

import BlockButton from "@/components/form/block-button";
import GoogleMapPicker from "@/components/form/google-map-picker";
import PublishSwitch from "@/components/form/publish-switch";
import MobileAdvertInfo from "@/components/pages/advert/mobile-advert-info";
import { ProfileInfo } from "@/components/pages/advert/profile-info";
import { withAuth, WithAuthGetServerSideProps } from "@/feature/withAuth";
import useMakeLayout from "@/hooks/useMakeLayout";
import usePastTimeFormat from "@/hooks/usePastTimeFormat";
import useTryFormatter from "@/hooks/useTryFormatter";
import Default from "@/layouts/default";
import { DetailAdvertModel } from "@/models/advert-model";
import getAdvert from "@/requests/getAdvert";
import { ListAltOutlined, Visibility, VpnKey } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  SxProps,
  Tab,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { SyntheticEvent, useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { openInfoSnackbar } from "@/store/info-snackbar";
import FavoriteButton from "@/components/content/favorite-button";
export default function AdvertPage({ advert }: { advert: DetailAdvertModel }) {
  const tryFormatter = useTryFormatter();
  const location = useCombinedLocation(advert);
  const time = usePastTimeFormat(advert.created_at, advert);
  const dispatch = useDispatch();
  const reason = useMemo(() => {
    if (advert.payment_status !== "success" && advert.payment_status !== null) {
      return "İlanın ödemesi bulunmakta.Aşağıdaki butondan ödeme sayfasına gidebilirsiniz.";
    }
    if (!advert.is_approved) {
      return "İlan onay bekliyor.İlanınız onaylandıktan sonra e-posta ile haberdar edileceksiniz.";
    }
    if (!advert.is_published && advert.preview_type === "user") {
      return "İlan yayında değil.Sağ aşağıdaki form elemanından ilanınızı yayına alabilirsiniz.";
    }
  }, [advert.is_preview]);
  const attributesSliced = useMemo(() => {
    const accArr: { categoryTitle: string; values: string[] }[] = [];
    advert.attributes.forEach((attr) => {
      const fi = accArr.findIndex((o) => o.categoryTitle == attr.title);

      if (fi != -1) {
        accArr[fi].values.push(attr.value);
      } else {
        accArr.push({ categoryTitle: attr.title, values: [attr.value] });
      }
    });
    return accArr;
  }, [advert]);

  const [tabValue, setTabValue] = useState<string>("1");
  const handleTabChange = useCallback(
    (event: SyntheticEvent, newValue: string) => {
      setTabValue(newValue);
    },
    []
  );

  const tabStyle = useMemo(
    () =>
      ({
        "@media(max-width: 450px)": {
          display: "none",
        },
      } as SxProps),
    []
  );
  const tabContentStyle = useMemo(
    () =>
      ({
        px: 2,
        py: 0,
      } as SxProps),
    []
  );

  const handleCodeClick = useCallback(() => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(advert.code);
      dispatch(
        openInfoSnackbar({
          message: "İlan kodu panoya kopyalandı",
          severity: "success",
        })
      );
    }
  }, [advert]);
  return (
    <Container sx={{ mb: 6 }}>
      <MobileAdvertInfo advert={advert} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          {advert.is_preview && !advert.is_published && (
            <Card sx={{ mb: 2, textAlign: "center" }}>
              <CardContent>
                <Typography
                  component="h5"
                  sx={{
                    typography: "h3",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    columnGap: 1,
                  }}
                >
                  <WarningAmberIcon /> YAYINDA DEĞİL
                </Typography>
              </CardContent>
              <Divider />
              <CardContent>
                <Typography
                  sx={{ typography: "subtitle1", color: "primary.main", mb: 2 }}
                >
                  {reason}
                </Typography>
                {advert.payment_status !== "success" &&
                  advert.payment_status !== null && (
                    <NextLink
                      href={{
                        pathname: "/ilan-ode/[id]",
                        query: { id: advert.id },
                      }}
                      passHref
                    >
                      <Link sx={{ mt: 2 }}>
                        <BlockButton>ÖDEME SAYFASINA GİT</BlockButton>
                      </Link>
                    </NextLink>
                  )}
                {advert.is_approved && !!!advert.is_published && (
                  <PublishSwitch
                    id={advert.id + ""}
                    initialValue={advert.is_published}
                  />
                )}
              </CardContent>
            </Card>
          )}
          {advert.category_tree?.length > 0 && (
            <Breadcrumbs aria-label="breadcrumb">
              {advert.category_tree.map((category, key) => (
                <NextLink
                  key="key"
                  passHref
                  href={{
                    pathname: "/ilanlar/[[...slug]]",
                    query: { slug: category.slug?.split("/") },
                  }}
                >
                  <Link underline="hover" color="secondary.light">
                    {category.title}
                  </Link>
                </NextLink>
              ))}
            </Breadcrumbs>
          )}
          <Typography
            component={"h1"}
            sx={{
              typography: { xs: "h5", sm: "h4" },
              fontWeight: { xs: 700, sm: 700 },
              fontSize: { sm: "2rem" },
            }}
          >
            {advert.title}
          </Typography>
          <Typography
            component={"h2"}
            sx={{
              typography: { xs: "h5", sm: "h4" },
              fontWeight: { xs: 300 },
              fontSize: { sm: "1.8rem" },
            }}
          >
            {location}
          </Typography>
          <Box sx={{ mb: 2, mt: 1, display: "flex",justifyContent: "space-between",alignItems: "center" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                onClick={handleCodeClick}
                size="small"
                color="primary"
                icon={<VpnKey />}
                label={advert.code}
              />
              <Chip
                sx={{ minWidth: 50 }}
                size="small"
                color="info"
                icon={<Visibility />}
                label={advert.views}
              />
            </Box>
            <FavoriteButton advertId={advert.id+""} initialValue={advert.isFavorite}/>
          </Box>

          <GallerySlider
            images={advert.images.map((o) => o.small)}
            showcaseImages={advert.images.map((o) => o.medium)}
            modalImages={advert.images.map((o) => o.large)}
            initialSlide={Math.max(
              advert.images.findIndex((o) => o.isCover),
              0
            )}
            sx={{ my: 2 }}
          ></GallerySlider>
          <Card>
            <TabContext value={tabValue}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  ".MuiTabs-scrollButtons.Mui-disabled": {
                    opacity: 0.3,
                  },
                }}
              >
                <TabList
                  onChange={handleTabChange}
                  aria-label="İlan Bilgileri"
                  sx={{
                    ".MuiTabs-flexContainer": {
                      justifyContent: { xs: "center", sm: "flex-start" },
                    },
                  }}
                >
                  <Tab
                    iconPosition="start"
                    icon={<InfoOutlinedIcon />}
                    label={
                      <Box component="span" sx={tabStyle}>
                        AÇIKLAMA
                      </Box>
                    }
                    value="1"
                  />
                  <Tab
                    iconPosition="start"
                    icon={<MapOutlinedIcon />}
                    label={
                      <Box component="span" sx={tabStyle}>
                        KONUM
                      </Box>
                    }
                    value="2"
                  />
                  <Tab
                    iconPosition="start"
                    icon={<ListAltOutlined />}
                    label={
                      <Box component="span" sx={tabStyle}>
                        ÖZELLİKLER
                      </Box>
                    }
                    value="3"
                  />
                </TabList>
              </Box>
              <TabPanel value="1" sx={tabContentStyle}>
                <Typography
                  sx={{ typography: "body2", whiteSpace: "pre-line", py: 1 }}
                >
                  {advert.description}
                </Typography>
              </TabPanel>
              <TabPanel value="2" sx={tabContentStyle}>
                {advert.latitude && advert.longitude && (
                  <Box sx={{ my: 2 }}>
                    <GoogleMapPicker
                      startFrom={{
                        lat: Number.parseFloat(advert.latitude + ""),
                        lng: Number.parseFloat(advert.longitude + ""),
                      }}
                      disabled
                    />
                  </Box>
                )}
              </TabPanel>
              <TabPanel value="3" sx={tabContentStyle}>
                {!!advert.options.length && (
                  <Box sx={{ mt: 1, mb: 3 }}>
                    <Typography
                      sx={{
                        typography: "h6",
                        mb: 2,
                        borderBottom: 1,
                        borderBottomColor: "grey.300",
                      }}
                    >
                      GENEL ÖZELLİKLER
                    </Typography>
                    <Grid container rowSpacing={2}>
                      {advert.options.map((option, key) => (
                        <Grid key={key} item xs={12} sm={6} md={4}>
                          <Typography
                            sx={{
                              typography: "subtitle2",
                              fontWeight: 400,
                              lineHeight: 1.2,
                              fontSize: ".95rem",
                            }}
                          >
                            {option.title}:
                          </Typography>
                          <Typography
                            sx={{
                              typography: "subtitle2",
                              fontWeight: 700,
                              lineHeight: 1.2,
                              fontSize: ".95rem",
                            }}
                          >
                            {option.value}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
                {!!attributesSliced?.length && (
                  <Box sx={{}}>
                    {attributesSliced.map((attr, key) => (
                      <Grid container rowSpacing={2} key={key} sx={{ mb: 3 }}>
                        <Grid item xs={12}>
                          <Typography
                            sx={{
                              typography: "h6",
                              borderBottom: 1,
                              borderBottomColor: "grey.300",
                            }}
                          >
                            {attr.categoryTitle.toLocaleUpperCase("tr-TR")}
                          </Typography>
                        </Grid>
                        {attr.values.map((value, key2) => (
                          <Grid key={key2} item xs={12} sm={6} md={4}>
                            <Chip
                              size="small"
                              color="secondary"
                              icon={<CheckCircleIcon />}
                              label={value}
                              variant="filled"
                            />
                          </Grid>
                        ))}
                      </Grid>
                    ))}
                  </Box>
                )}
              </TabPanel>
            </TabContext>
          </Card>
        </Grid>
        <Grid item xs={12} md={3} sx={{ display: { xs: "none", md: "block" } }}>
          <Card sx={{ position: "sticky", top: 70 }}>
            <CardContent>
              <Typography
                component="h5"
                sx={{
                  display: "inline-block",
                  typography: "h3",
                  fontSize: { xs: "1.5rem", sm: "1.8rem" },
                  fontWeight: 700,
                  color: "primary.main",
                  lineHeight: 1,
                  letterSpacing: "0.15rem",
                }}
              >
                {tryFormatter.format(advert.price)}
              </Typography>

              <Typography
                sx={{
                  color: "primary.main",
                  fontSize: { xs: "1rem", sm: "1rem" },
                }}
              >
                {time}
              </Typography>
            </CardContent>
            <Divider />
            {advert.estate_agent && <ProfileInfo user={advert.estate_agent} />}
            {advert.advisor && advert.estate_agent && <Divider />}
            {advert.advisor && <ProfileInfo user={advert.advisor} />}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export const getServerSideProps: WithAuthGetServerSideProps = withAuth(
  async (context, user, axios) => {
    try {
      const adminToken = context?.query?.adminToken;
      const queryParams: any = {};
      if (adminToken) {
        queryParams.adminToken = adminToken;
      }
      const slug: string = context.params?.slug as string;
      const advert = await getAdvert(axios, slug, queryParams);
      return {
        props: {
          advert,
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
