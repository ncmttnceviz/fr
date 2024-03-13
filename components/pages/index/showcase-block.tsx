import AdvertCard from "@/components/image/advert-card";
import useCombineSx from "@/hooks/useCombineSx";
import { ListingAdvertModel } from "@/models/advert-model";
import { Box, Container, SxProps, Typography, useTheme } from "@mui/material";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";


export default function ShowcaseBlock({ sx,  adverts}: { sx?: SxProps,adverts: ListingAdvertModel[] }) {
  const a = useCombineSx(sx);
  const theme = useTheme();
  const breakpoints: any = {};
  const spacingFactor = parseFloat(theme.spacing(1).replaceAll(" px", ""));
  breakpoints[theme.breakpoints.values["sm"]] = {
    slidesPerView: 2,
  };
  breakpoints[theme.breakpoints.values["md"]] = {
    slidesPerView: 3,
  };
  return (
    <Box sx={[{ bgcolor: "grey.100", py: 7 }, ...a]}>
      <Container sx={{ mb: 4 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              typography: { xs: "h4", sm: "h3" },
              fontWeight: { xs: 700, sm: 700 },
              mb: 3,
            }}
          >
            VİTRİN
          </Typography>
         
        </Box>
      </Container>
      <Container>
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={spacingFactor}
          breakpoints={breakpoints}
        >
          {adverts.map((advert, key) => (
            <SwiperSlide key={key}>
              <Box
                sx={{
                  width: 1,
                  
                  mb: 8,
                }}
              >
                <AdvertCard advert={advert}/>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  );
}