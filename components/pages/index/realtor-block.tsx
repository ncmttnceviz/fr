import LogoSVG from "@/assets/svg/logo.svg";
import useCombineSx from "@/hooks/useCombineSx";
import { CorporateModel } from "@/models/auth-models";
import {
  Box,
  Container,
  Divider,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import ClampLines from "react-clamp-lines";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

export default function RealtorBlock({
  sx,
  corporates,
}: {
  sx?: SxProps;
  corporates: CorporateModel[];
}) {
  const a = useCombineSx(sx);
  const theme = useTheme();
  const breakpoints: any = {};
  const spacingFactor = parseFloat(theme.spacing(1).replaceAll(" px", ""));
  breakpoints[theme.breakpoints.values["sm"]] = {
    slidesPerView: 2,
  };
  breakpoints[theme.breakpoints.values["md"]] = {
    slidesPerView: 4,
  };
  breakpoints[theme.breakpoints.values["lg"]] = {
    slidesPerView: 4,
  };
  return (
    <Box sx={[{ bgcolor: "grey.100", py: 7 }, ...a]}>
      <Container>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
          slidesPerView={1}
          spaceBetween={spacingFactor}
          breakpoints={breakpoints}
        >
          {[...corporates].map((corporate, key) => (
            <SwiperSlide key={key}>
              <Box
                sx={{
                  width: 1,

                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <RealtorCard
                  id={corporate.id}
                  title={corporate.company}
                  image={corporate.image?.medium}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  );
}

function RealtorCard({
  sx,
  title,
  image,
  id,

  ...props
}: {
  sx?: SxProps;
  title?: string;
  id: string;

  image?: string;
}) {
  const a = useCombineSx(sx);
  return (
    <Link href={{ pathname: "/kurumsal/[id]", query: { id } }} passHref>
      <Box
        component={"a"}
        sx={[
          {
            textDecoration: "none",
            color: "common.black",
            display: "flex",
            width: 1,
            maxWidth: 270,
            minHeight: 300,
            flexDirection: "column",
            justifyContent: "stretch",
            bgcolor: "white",
            border: "1px solid black",
            borderColor: "grey.300",
          },

          ...a,
        ]}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            height: 230,
            flexShrink: 0,
            bgcolor: "grey.200",
            overflow: "hidden",
          }}
        >
          {image ? (
            <Image src={image} layout="fill" objectFit="cover" />
          ) : (
            <LogoSVG width="128px" />
          )}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.8,

            textAlign: "center",
            borderTop: 1,
            borderTopColor: "grey.300",
          }}
        >
          <Typography
            component="div"
            sx={{
              typography: "h6",
              fontSize: "1.3rem",
              lineHeight: 1.2,
              px: 2,
            }}
          >
            <ClampLines
              text={title?.toLocaleUpperCase("TR") || ""}
              id={`line-clamp-${id}`}
              lines={1}
              ellipsis="..."
              buttons={false}
              innerElement="div"
            />
          </Typography>
          <Divider sx={{ width: 1 }} />
          <Box
            component={"span"}
            sx={{
              typography: "body2",
              color: "grey.600",
              fontSize: ".8rem",

              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            TÜM İLANLAR
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
