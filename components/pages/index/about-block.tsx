import BgFeatureImage from "@/public/mock/homepage/bg-feature.jpg";

import {
  Box,
  Container,
  Grid,
  SvgIcon,
  Typography,
} from "@mui/material";
import { BoxProps } from "@mui/system";
import { ReactNode } from "react";
import Image from "next/image";
import useCombineSx from "@/hooks/useCombineSx";
import dynamic from "next/dynamic";
const MoneySVG = dynamic(() => import( "@/assets/svg/money.svg"));
const GoodSalesSVG = dynamic(() => import( "@/assets/svg/good-sales.svg"));
const SunSVG = dynamic(() => import( "@/assets/svg/sun.svg"));
const SearchSVG = dynamic(() => import( "@/assets/svg/search.svg"));
export default function AboutBlock({ sx, ...props }: BoxProps) {
  const csx = useCombineSx(sx);
  return (
    <Box sx={[{ bgcolor: "white" }, ...csx]}>
      <Container
        sx={{
          paddingLeft: { lg: 0 },
          marginLeft: { lg: 0 },
          paddingRight: { lg: "24px" },
          maxWidth: (theme) => {
            return {
              lg: `calc( ${theme.breakpoints.values.lg}px + calc( calc(100vw - ${theme.breakpoints.values.lg}px) / 2 ))`,
            };
          },
        }}
      >
        <Grid container>
          <Grid item lg={7} sx={{ position: "relative" }}>
            <Image
              src={BgFeatureImage}
              layout="fill"
              objectFit="cover"
              style={{ width: "100%", maxHeight: "100%" }}
            />
          </Grid>
          <Grid item lg={5}>
            <Box
              sx={{
                pl: { lg: 4 },
                minHeight: { lg: 400 },
                py: 6,
              }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography
                  typography={"h2"}
                  color="primary"
                  sx={{
                    fontWeight: 700,
                    fontSize: {xs: "2rem",sm:"2.95rem"},
                    mb: 4,
                  }}
                >
                  MÜŞTERİM.NET
                </Typography>
                <Typography sx={{ typography: "subtitle", fontSize: 15 }}>
                  Müşterim.net olarak 40 yılı aşkın tecrübe ve deneyimlerimizi
                  “reçete” ilkesiyle, Gayrimenkul sektörün gereksinim, değer ve
                  eksiklerini gidermek amacıyla kurduğumuz, geliştirilmiş emlak
                  yönetim ve pazarlama sistemdir.
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Feature
                    iconComponent={
                      <SvgIcon sx={{ fontSize: 54, fill: "#606e7c" }}>
                        <MoneySVG />
                      </SvgIcon>
                    }
                    title={"DOĞRU TİCARET"}
                    description={
                      "Günümüzde hala devam eden ayakçı, kapıcı, ve seyyar emlakların mesleğimize getirdiği itibar kaybının önüne geçerek hakkımız olan değeri birlikte kazanacağız."
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Feature
                    iconComponent={
                      <SvgIcon sx={{ fontSize: 54, fill: "#606e7c" }}>
                        <GoodSalesSVG />
                      </SvgIcon>
                    }
                    title={"HEP BİRLİKTE"}
                    description={
                      "Neredeyse tüm illerimizde açacağımız ofislerimiz ve danışmanlarımızla sizlerin öneri, fikir ve yorumlarınıza daima hazır olacağız. "
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Feature
                    iconComponent={
                      <SvgIcon sx={{ fontSize: 54, fill: "#606e7c" }}>
                        <SunSVG />
                      </SvgIcon>
                    }
                    title={"TEK ÇATI"}
                    description={
                      "Oluşumumuzun kaynağı 40 yıldır süre gelen gayrimenkul deneyimimiz de karşılaştığımız olguları siz değerli meslektaşlarımıza paylaşmaktır."
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Feature
                    iconComponent={
                      <SvgIcon sx={{ fontSize: 54, fill: "#606e7c" }}>
                        <SearchSVG />
                      </SvgIcon>
                    }
                    title={"BİRLEŞİK AĞ"}
                    description={
                      "Tüm illerimizde ki kurumsal üyelerimiz kendi portföyündeki ürünleri birbirleriyle satabilecek ve buradan alınacak komisyonun paylaşımı sağlanacaktır."
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function Feature({
  title,
  description,
  iconComponent,
}: {
  title: string;
  description: string;
  iconComponent: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        width: 1,
      }}
    >
      {iconComponent}
      <Typography
        color={"primary"}
        typography={"h6"}
        sx={{ fontWeight: 600, lineHeight: 1.2, fontSize: "1.3rem" }}
      >
        {title}
      </Typography>
      <Typography sx={{ fontSize: ".9rem", lineheight: 1.6, color: "#606e7c" }}>
        {description}
      </Typography>
    </Box>
  );
}
