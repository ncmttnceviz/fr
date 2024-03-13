import ArrowLineSVG from "@/assets/svg/arrow-line.svg";
import { Container, Grid, SvgIcon, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import FormHero from "../form/form-hero";
export default function HeroContent() {
  return (
    <Box
      sx={{
        width: 1,
        height: 1,
        flexGrow: 1,
        flexShrink: 0,
        display: {xs: 'flex',sm: 'block'},
        alignItems: 'center',
      }}
    >
      <Container sx={{ color: (theme) => theme.palette.common.white }}>
        <Grid container justifyContent="space-between" rowSpacing={2}>
          <Grid item md={7}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: 1,
                rowGap: { xs: 0, lg: 7 },
                justifyContent: { xs: "center", lg: "start" },
              }}
            >
              <Box>
                <Typography
                  typography={{ xs: "h5", sm: "h3", lg: "h1" }}
                  sx={{ fontWeight: { xs: 400, lg: 700 },lineHeight: 1.1 }}
                >
                  İlanı Siz Verin Müşterinizi Biz Bulalım
                </Typography>
              </Box>
              <Box>
                <Typography
                  typography={{ xs: "body2", sm: "h6" }}
                  sx={{ fontWeight: 400 }}
                >
                  Aktif ilanlar arasında kolaylıkla arama yapın
                  veya kendi ilanınızı ekleyin.
                </Typography>
              </Box>
              <Box display={{ xs: "none", lg: "block" }} sx={{
                marginBottom: 7
              }}>
                <Typography
                  typography={"h5"}
                  sx={{
                    mt: 3,
                    position: "relative",
                    fontWeight: 700,
                    color: (theme) => theme.palette.secondary.light,
                  }}
                >
                  Arama Yapın
                  <Box
                    component="span"
                    sx={{
                      position: "absolute",
                      top: -10,
                      left: 188,
                      width: 20,
                      height: 20,
                      bgcolor: (theme) => theme.palette.secondary.light,
                      borderRadius: "50%",
                    }}
                  ></Box>
                  <Box
                    component="span"
                    sx={{
                      position: "absolute",
                      top: -224,
                      left: 732,
                      width: 20,
                      height: 20,
                      borderColor: (theme) => theme.palette.secondary.light,
                      borderTopWidth: 3,
                      borderRightWidth: 3,
                      borderTopStyle: "solid",
                      borderRightStyle: "solid",
                      borderTopRightRadius: 4,
                      transform: "translateZ(0) rotateZ(-6deg)",
                    }}
                  ></Box>
                  <SvgIcon
                    component={ArrowLineSVG}
                    viewBox="0 0 774 284"
                    enableBackground="new 0 0 774 284"
                    sx={{
                      position: "absolute",
                      top: -230,
                      left: -20,
                      width: 774,
                      height: 284,

                      "& *": {
                        stroke: (theme) => theme.palette.secondary.light,
                        strokeWidth: 2,
                      },
                    }}
                  />
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            lg={4}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
            }}
          >
            <FormHero />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
