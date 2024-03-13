import LogoTextWhiteSVG from "@/assets/svg/logo-text-white.svg";
import LogoTextSVG from "@/assets/svg/logo-text.svg";
import { RootState } from "@/store";

import { Container, Grid, Link } from "@mui/material";
import Box from "@mui/material/Box";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function Header({ solid }: { solid?: boolean }) {
  const logoProps = {
    style: { width: 215, height: "auto" },
  };
  const headerHeight = useSelector((state: RootState) => state.header.headerSize);

  return (
    <Box
      component="header"
      sx={[{
        paddingTop: `${headerHeight}px`,
        top: 0,
        left: 0,
        
        position: 'relative',
        width: "100%",
        overflow: "hidden",
        flexGrow: {xs: 0,sm: 1},
        flexShrink: 0,
        color: (theme) => theme.palette.common.white,
      },
      !!solid && {
        position: "relative",
      }
      ]}
    >
    
      <Box sx={[{ width: 1, py: { xs: 3, md: 5.5 },display: { xs: "none", md: "block" } }, !!solid && {
        borderBottom: 1,
        borderBottomColor: "grey.300",
        mb: 4,
      }]}>
        <Container sx={{  }}>
          <Grid
            container
            alignItems="center"
            justifyContent={{ xs: "center", md: "space-between" }}
            columnSpacing={4}
          >
            <Grid item xs="auto">
              <NextLink href={"/"} passHref>
                <Link>
                  {solid ? (
                    <LogoTextSVG {...logoProps} />
                  ) : (
                    <LogoTextWhiteSVG {...logoProps} />
                  )}
                </Link>
              </NextLink>
            </Grid>
            <Grid
              item
              container
              xs={12}
              md="auto"
              alignItems="center"
              justifyContent="space-between"
              columnGap={{ xs: 2, md: 3, lg: 4 }}
            >
              <HeaderLink solid={solid} href="/">
                ANASAYFA
              </HeaderLink>
              <HeaderLink solid={solid} nested href="/ilanlar">
                İLANLAR
              </HeaderLink>
              <HeaderLink solid={solid} href="/paketler">
                PAKETLER
              </HeaderLink>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

function HeaderLink({
  children,
  href,
  solid,
  nested,
}: {
  children: any;
  href?: string;
  solid?: boolean;
  nested?: boolean;
}) {
  const router = useRouter();
  const isActive: boolean = !!(
    href &&
    router.asPath &&
    (!!nested ? router.asPath.startsWith(href+'/') || href === router.asPath: href === router.asPath)
  );
  return (
    <NextLink href={href || "#"} passHref>
      <Link
        sx={[
          {
            typography: "button",

            color: (theme) => theme.palette.common.white,
            textDecoration: "none",
            "&::after": {
              width: 1,

              height: 2,
              content: '""',
              display: "block",
            },
          },
          isActive && {
            "&::after": {
              bgcolor: "currentCOlor",
            },
          },
          !!solid && {
            color: (theme) => theme.palette.grey[700],
          },
        ]}
      >
        {children}
      </Link>
    </NextLink>
  );
}

