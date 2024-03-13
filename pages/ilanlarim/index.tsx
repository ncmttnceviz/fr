import BlockButton from "@/components/form/block-button";
import PublishSwitch from "@/components/form/publish-switch";
import AdvertCard from "@/components/image/advert-card";
import RemoveAdvertModal, {
    RemoveAdvertModalControls
} from "@/components/modal/remove-advert-modal";
import { withAuth, WithAuthGetServerSideProps } from "@/feature/withAuth";
import useMakeLayout from "@/hooks/useMakeLayout";
import Default from "@/layouts/default";
import { ConfigurableAdvertModel } from "@/models/advert-model";
import getMemberAdverts from "@/requests/getMemberAdverts";
import {
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    FormControlLabel,
    Grid,
    Radio,
    Typography
} from "@mui/material";
import NextLink from "next/link";
import {
    MutableRefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
const FILTER_TYPES: { title: string; key: string }[] = [
  { title: "Tümü", key: "all" },
  { title: "Yayında", key: "published" },
  { title: "Yayında Değil", key: "not_published" },
  { title: "Ödeme Gerekli", key: "needs_payment" },
  { title: "Onay Bekliyor", key: "needs_approvement" },
];
export default function MyAdverts({
  advertsRaw,
}: {
  advertsRaw: ConfigurableAdvertModel[];
}) {
  const [adverts, setAdverts] = useState<ConfigurableAdvertModel[]>([]);

  const removeAdvertModalControls =
    useRef<RemoveAdvertModalControls>() as MutableRefObject<RemoveAdvertModalControls>;
  useEffect(() => {
    if (advertsRaw) {
      setAdverts([...advertsRaw]);
    }
  }, [advertsRaw]);

  const needsPayment = useCallback((advert: ConfigurableAdvertModel) => {
    return (
      advert.payment_status !== "success" && advert.payment_status !== null
    );
  }, []);
  const needsApprovement = useCallback((advert: ConfigurableAdvertModel) => {
    return !needsPayment(advert) && !advert.is_approved;
  }, []);

  const getAdvertStatus = useCallback((advert: ConfigurableAdvertModel) => {
    if (needsPayment(advert)) {
      return <Box sx={{ color: "error.main" }}>ÖDEME GEREKLİ</Box>;
    }
    if (needsApprovement(advert)) {
      return <Box sx={{ color: "info.main" }}>ONAY BEKLİYOR</Box>;
    }
    if (advert.is_published) {
      return <Box sx={{ color: "success.main" }}>YAYINDA</Box>;
    }
    return <Box sx={{ color: "grey.400" }}>YAYINDA DEĞİL</Box>;
  }, []);
  const handleAdvert = useCallback(
    (
      modifier: (advert: ConfigurableAdvertModel) => ConfigurableAdvertModel,
      id: number
    ) => {
      setAdverts((adverts) => {
        const target = adverts.find((o) => o.id === id);
        if (target) {
          const nt = modifier({ ...target });
          const newA = adverts.filter((o) => o.id !== id);
          newA.push(nt);
          return [...newA];
        }
        return adverts;
      });
    },
    []
  );
  const getAdvertHelper = useCallback((advert: ConfigurableAdvertModel) => {
    if (needsPayment(advert)) {
      return (
        <NextLink
          href={{ pathname: "/ilan-ode/[id]", query: { id: advert.id + "" } }}
          passHref
        >
          <Button
            component="a"
            color="primary"
            variant="outlined"
            size="small"
            fullWidth
          >
            ÖDEME YAP
          </Button>
        </NextLink>
      );
    }
    if (needsApprovement(advert)) {
      return null;
    }
    return (
      <PublishSwitch
        initialValue={advert.is_published}
        onChange={(val) =>
          handleAdvert(
            (advert) => ({ ...advert, is_published: val }),
            advert.id
          )
        }
        id={advert.id + ""}
      />
    );
  }, []);
  const [filter, setFilter] = useState<string>("all");
  const makeFilteredAdverts = useCallback(
    (adverts: ConfigurableAdvertModel[], key: string) => {
      if (key === "all") {
        return adverts;
      }
      if (key === "needs_payment") {
        return adverts.filter(needsPayment);
      }
      if (key === "needs_approvement") {
        return adverts.filter(needsApprovement);
      }
      if (key === "published") {
        return adverts.filter((o) => o.is_published);
      }
      if (key === "not_published") {
        return adverts.filter((o) => !o.is_published);
      }
      return adverts;
    },
    []
  );

  const getCountOfFilter = useCallback(
    (key: string) => {
      return makeFilteredAdverts(adverts, key).length;
    },
    [adverts]
  );

  const filteredAdverts = useMemo(
    () => makeFilteredAdverts(adverts, filter),
    [adverts, filter]
  );
  const handleRemoveSuccess = (advert: ConfigurableAdvertModel) => {
    setAdverts((adverts) => adverts.filter((o) => o.id !== advert.id));
  };
  return (
    <Container sx={{ mb: 6 }}>
      <RemoveAdvertModal
        ref={removeAdvertModalControls}
        onSuccess={handleRemoveSuccess}
      />
      <Typography
        component="h1"
        typography={"h3"}
        fontWeight={700}
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: { xs: "2rem", sm: "3.2rem" },
          mb: 0.5,
        }}
      >
        İLANLARIM
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography sx={{ typography: "h6", fontWeight: 700 }}>
                FİLTRELE
              </Typography>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {FILTER_TYPES.map((type) => (
                  <Grid item xs={12} sm={6} md={"auto"} key={type.key}>
                    <FormControlLabel
                      checked={type.key === filter}
                      control={
                        <Radio
                          onChange={(event) =>
                            event.target.checked && setFilter(type.key)
                          }
                        />
                      }
                      label={
                        <Badge
                          showZero
                          badgeContent={getCountOfFilter(type.key)}
                          color="secondary"
                        >
                          <Box sx={{ pt: 0.4, pr: 0.7 }}>{type.title}</Box>
                        </Badge>
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {filteredAdverts.map((advert) => (
          <Grid key={advert.id} item xs={12} sm={6} md={4}>
            <AdvertCard
              sx={{
                "&:hover": { backgroundColor: "white", color: "currentcolor" },
              }}
              advert={advert}
              configurable
            >
              <Typography
                component="div"
                sx={{ typography: "subtitle2", fontWeight: 700 }}
              >
                {getAdvertStatus(advert)}
              </Typography>
              <Box sx={{ minHeight: 40 }}>{getAdvertHelper(advert)}</Box>
              <Box sx={{ minHeight: 40 }}>
                <NextLink
                  href={{
                    pathname: "/ilan/[slug]",
                    query: { slug: advert.slug },
                  }}
                  passHref
                >
                  <Button
                    component="a"
                    color="primary"
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    {advert.is_published ? "İLANA GİT" : "ÖNİZLEME"}
                  </Button>
                </NextLink>
              </Box>
              <Box sx={{ minHeight: 40 }}>
                <NextLink
                  href={{
                    pathname: "/ilanlarim/[slug]",
                    query: { slug: advert.slug },
                  }}
                  passHref
                >
                  <Button
                    component="a"
                    color="primary"
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    İLANI DÜZENLE
                  </Button>
                </NextLink>
              </Box>
              <Box sx={{ minHeight: 40 }}>
               
                  <Button
                    color="primary"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => removeAdvertModalControls?.current?.open(advert)}
                  >
                    İLANI SİL
                  </Button>
                
              </Box>
            </AdvertCard>
          </Grid>
        ))}
        {adverts.length > 0 && filteredAdverts.length === 0 && (
          <Grid item xs={12}>
            <Typography
              sx={{ typography: "h5", textAlign: "center", fontWeight: 700 }}
            >
              SONUÇ YOK
            </Typography>
          </Grid>
        )}
        {adverts.length === 0 && (
          <Grid item xs={12}>
            <NextLink href={{ pathname: "/yeni-ilan" }} passHref>
              <Box component={"a"} sx={{ textDecoration: "none" }}>
                <BlockButton>YENİ İLAN EKLE</BlockButton>
              </Box>
            </NextLink>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export const getServerSideProps: WithAuthGetServerSideProps = withAuth(
  async (context, user, axios) => {
    try {
      const adverts = await getMemberAdverts(axios);
      return {
        props: {
          advertsRaw: adverts,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        notFound: true,
      };
    } finally {
    }
  },
  true
);
MyAdverts.getLayout = useMakeLayout(Default);
