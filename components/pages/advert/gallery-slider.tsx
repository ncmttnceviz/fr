import useCombineSx from "@/hooks/useCombineSx";
import { Box, SxProps, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { MutableRefObject, useRef, useState } from "react";
import GalleryBox, {
  GalleryBoxController,
} from "@/components/image/gallery-box";
export default function GallerySlider({
  sx,
  images,
  modalImages,
  showcaseImages,
  initialSlide,
}: {
  sx?: SxProps;
  images: string[];
  modalImages: string[];
  showcaseImages: string[];
  initialSlide?: number;
}) {
  const galleryController =
    useRef<GalleryBoxController>() as MutableRefObject<GalleryBoxController>;
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const sxx = useCombineSx(sx);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const breakpoints: any = {};
  const onImageClick = () => {
    galleryController.current?.setIndex(currentSlide);
    galleryController.current?.setOpen(true);
  };
  breakpoints[450] = {
    slidesPerView: 3,
  };
  breakpoints[theme.breakpoints.values["sm"]] = {
    slidesPerView: 4,
  };
  breakpoints[theme.breakpoints.values["lg"]] = {
    slidesPerView: 5,
  };
  return (
    <Box sx={[{}, ...sxx]}>
      <GalleryBox ref={galleryController} images={modalImages} />
      <Box
        sx={{
          position: "relative",
          cursor: "pointer",
          width: 1,
          height: { xs: 388, md: 510 },
          border: "4px dashed red",
          borderColor: "secondary.main",
          padding: 1,
          "@media(max-width: 450px)": {
            display: "none",
          },
        }}
        onClick={onImageClick}
      >
        <Box
          sx={{
            width: 1,
            height: 1,
            position: "relative",
            bgcolor: "grey.200",
          }}
        >
          {
            <Image
              layout="fill"
              priority
              objectFit="contain"
              src={
                showcaseImages[showcaseImages.length <= 1 ? 0 : currentSlide]
              }
            />
          }
        </Box>
      </Box>
      {typeof window !== "undefined" && images.length > 0 && (
        <Box
          sx={[
            swiperStyle,
            images.length <= 1 && {
              display: "none",
              "@media(max-width: 450px)": {
                display: "block",
              },
            },
          ]}
        >
          <Swiper
            slidesPerView={1}
            modules={[Navigation]}
            breakpoints={breakpoints}
            navigation
            speed={500}
            loop={true}
            loopAdditionalSlides={5}
            initialSlide={initialSlide || 0}
            onClick={() => isSm && onImageClick()}
            centeredSlides={true}
            onSlideChange={(event) => setCurrentSlide(event.realIndex)}
            slideToClickedSlide={true}
          >
            {images.map((image, key) => (
              <SwiperSlide key={key}>
                <Box
                  className="item"
                  sx={[
                    {
                      cursor: "pointer",
                      width: 1,
                      height: 100,
                      "@media(max-width: 450px)": {
                        height: 388,
                      },
                    },
                  ]}
                >
                  <Image layout="fill" objectFit="cover" src={image} />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
    </Box>
  );
}

const swiperStyle = {
  ".swiper": {
    display: "flex",
    alignItems: "center",
    minHeight: 150,
    "--swiper-navigation-size": "22px",
  },
  "& .swiper-slide": {
    position: "relative",
    ".item": {
      transition: "0.5s all ease",
      transform: "scale(1)",
    },
  },

  "@media(min-width: 450px)": {
    "& .swiper-slide-active": {
      zIndex: 30,
      position: "realtive",
      ".item": {
        position: "absolute",
        boxShadow: "0 0 15px rgb(0 0 0 / 60%)",
        top: 0,
        left: 0,
        transform: "scale(1.2)",
        zIndex: 3,
        cursor: "inherit",
      },
    },
    ".swiper-button-prev": {
      left: 0,
    },
    ".swiper-button-next": {
      right: 0,
    },
    ".swiper-button-prev,.swiper-button-next": {
      top: "50%",
      marginTop: 0,
      width: 26,
      height: 100,
      transform: "translateY(-50%)",
      bgcolor: "primary.main",
      color: "white",
      "&::after": {},
    },
  },
};
