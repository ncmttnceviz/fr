import { Container, FormControl, Grid, Link, Typography } from "@mui/material";
import { Box, BoxProps } from "@mui/system";
import BlockButton from "@/components/form/block-button";
import SolidInputDark from "@/components/form/solid-input-dark";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import PaymentBanner from "@/public/mock/payment-banner.png";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useMemo } from "react";
import NextLink from "next/link";
import Image from "next/image";
export default function (props: BoxProps) {

  const policyLinks = useMemo(() => [
    {
      title: 'KVKK Sözleşmesi',
      pathname: '/kvkk',
    },
    {
      title: 'Çerez Politikası',
      pathname: '/cerez-politikasi',
    },
    {
      title: 'Gizlilik Sözleşmesi',
      pathname: '/gizlilik-sozlesmesi',
    },
    {
      title: 'Mesafeli Satış Sözleşmesi',
      pathname: '/mesafeli-satis-sozlesmesi',
    },
    {
      title: 'Üyelik Sözleşmesi',
      pathname: '/uyelik-sozlesmesi'
    }
  ], []);
  return (
    <Box {...props} component="footer">
      {/* <Box sx={{ color: "white", bgcolor: "#2D2D2D", py: 4 }}>
        <Container>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={"auto"}>
              <Typography typography={"h5"}>Haber Bülteni</Typography>
            </Grid>
            <Grid item xs={12} md={"auto"}>
              <FormControl
                variant="standard"
                color="primary"
                fullWidth
                sx={{
                  label: {
                    color: "white !important",
                  },
                }}
              >
                <SolidInputDark
                  sx={{ minWidth: 300 }}
                  fullWidth
                  color="secondary"
                  id={"newsletter"}
                  placeholder={"E-Posta Adresi"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={"auto"}>
              <BlockButton
                color="secondary"
                sx={{ py: 0.6, px: 8, fontSize: 14 }}
              >
                GÖNDER
              </BlockButton>
            </Grid>
          </Grid>
        </Container>
      </Box> */}
      <Box sx={{ bgcolor: "#222222", py: 8, color: "grey.400" }}>
        <Container>
          <Grid container spacing={3}>
            <Grid item md={5}>
              <Typography
                color="primary.light"
                typography={"h6"}
                sx={{ fontSize: "1.2rem", mb: 1 }}
              >
                MENÜ
              </Typography>
              <Box sx={{ mb: 1.7 }}>
                {[
                  { title: "ANASAYFA", pathname: "/" },
                  { title: "İLANLAR", pathname: "/ilanlar" },
                  { title: "PAKETLER", pathname: "/paketler" },
                ].map((o, key) => (
                  <Box
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 400,
                      display: "inline-block",
                      width: "auto",
                      "&:not(:last-child):after": {
                        content: '"/"',
                        display: "inline-block",
                        mx: 1,
                      },
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    key={key}
                  >
                    <NextLink href={{ pathname: o.pathname }} passHref >
                      <Typography component={"a"} sx={{ color: 'currentColor', textDecoration: 'none' }}>

                        {o.title}
                      </Typography>
                    </NextLink>
                  </Box>
                ))}
              </Box>
              <Typography
                color="primary.light"
                typography={"h6"}
                sx={{ fontSize: "1.2rem", mb: 1 }}
              >
                HAKKIMIZDA
              </Typography>
              <Typography sx={{ fontSize: ".95rem", mb: 2.4 }}>
                Müşterim.net olarak 40 yılı aşkın tecrübe ve deneyimlerimizi
                “reçete” ilkesiyle, Gayrimenkul sektörün gereksinim, değer ve
                eksiklerini gidermek amacıyla kurduğumuz, geliştirilmiş emlak
                yönetim ve pazarlama sistemdir.
              </Typography>
              <Typography
                color="primary.light"
                typography={"h6"}
                sx={{ fontSize: "1.2rem", mb: 2.4 }}
              >
                SOSYAL
              </Typography>
              <Grid container spacing={3} sx={{ color: "primary.light" }}>
                <Grid item xs={"auto"}>
                  <Link sx={{ color: 'primary.light' }} href="https://www.facebook.com/musterim.net" target="_blank" rel="noopener noreferrer nofollow">
                    <FacebookIcon fontSize="small" />

                  </Link>
                </Grid>
                <Grid item xs={"auto"}>
                  <Link sx={{ color: 'primary.light' }} href="https://www.instagram.com/musterimnet/" target="_blank" rel="noopener noreferrer nofollow">
                    <InstagramIcon fontSize="small" />

                  </Link>

                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                color="primary.light"
                typography={"h6"}
                sx={{ fontSize: "1.2rem", mb: 1 }}
              >
                İLETİŞİM
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: ".95rem" }}>
                    Rüstempaşa Mh. Huzur sk. No:33/12 Merkez/YALOVA
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: ".95rem" }}>
                    tel: 444 5 738
                  </Typography>
                  <Typography sx={{ fontSize: ".95rem" }}>
                    info@musterim.net
                  </Typography>
                </Grid>
              </Grid>
              <Typography
                color="primary.light"
                typography={"h6"}
                sx={{ fontSize: "1.2rem", mt: 3, mb: 2 }}
              >
                GERİ BİLDİRİM
              </Typography>
              <FormControl
                variant="standard"
                color="primary"
                fullWidth
                sx={{
                  label: {
                    color: "white !important",
                  },
                  mb: 1.5,
                }}
              >
                <SolidInputDark
                  fullWidth
                  color="secondary"
                  id={"newsletter"}
                  placeholder={"E-Posta Adresi"}
                />
              </FormControl>
              <FormControl
                variant="standard"
                color="primary"
                fullWidth
                sx={{
                  label: {
                    color: "white !important",
                  },
                }}
              >
                <SolidInputDark
                  multiline
                  fullWidth
                  color="secondary"
                  rows={4}
                  id={"newsletter"}
                  placeholder={"Mesajınız"}
                />
              </FormControl>
              <div>
                <BlockButton
                  color="secondary"
                  sx={{
                    width: 1,
                    maxWidth: "100%",
                    mx: 0,
                    py: 0.6,
                    px: 8,
                    fontSize: 14,
                    mt: 1.5,
                  }}
                >
                  GÖNDER
                </BlockButton>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <Typography
                color="primary.light"
                typography={"h6"}
                sx={{ fontSize: "1.2rem", mb: 1 }}
              >
                SİTE HAKKINDA
              </Typography>
              <Grid container rowSpacing={1}>

                {policyLinks.map((link, key) =>
                  <Grid item xs={12} key={key}>
                    <NextLink href={link.pathname} passHref>
                      <Typography
                        component="a"
                        sx={{
                          fontSize: ".95rem",
                          cursor: "pointer",
                          color: 'currentcolor',
                          textDecoration: 'none',
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {link.title}
                      </Typography>
                    </NextLink>


                  </Grid>
                )}

              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ bgcolor: "grey.200", pt: 1, pb: 0.8, borderTop: 1, borderTopColor: 'grey.700'}}>
        <Container>
          <Grid container justifyContent={{xs: 'center',md: 'space-between'}} alignItems={'center'} rowSpacing={2}>
            <Grid item xs={"auto"} sm={"auto"}>
              <Typography component="span" sx={{ typography: 'body2' }}>&copy; 2022 Tüm Hakları Saklıdır.</Typography>
            </Grid>
            <Grid item xs={12} sm={"auto"}>
              <Image src={PaymentBanner} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
