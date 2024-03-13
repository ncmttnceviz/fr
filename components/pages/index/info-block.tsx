import AdvertCard from "@/components/image/advert-card";
import useCombineSx from "@/hooks/useCombineSx";
import { Box, Container, Link, SxProps, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";
import { Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import { Swiper, SwiperSlide } from "swiper/react";


export default function InfoBlock({ sx }: { sx?: SxProps }) {
    const a = useCombineSx(sx);
    const theme = useTheme();
    const breakpoints: any = {};
    const spacingFactor = parseFloat(theme.spacing(3).replaceAll(" px", ""));

    breakpoints[theme.breakpoints.values["sm"]] = {
        slidesPerView: 2,
    };
    breakpoints[theme.breakpoints.values["md"]] = {
        slidesPerView: 3,
    };
    breakpoints[theme.breakpoints.values["md"]] = {
        slidesPerView: 5,
    };

    const blocks = useMemo(() => {
        return [
            {
                src: '/mock/info/webtapu.png',
                href: 'https://webtapu.tkgm.gov.tr/',
            },
            {
                src: '/mock/info/parselsorgu.png',
                href: 'https://parselsorgu.tkgm.gov.tr/',
            },
            {
                src: '/mock/info/erandevu.png',
                href: 'https://randevu.tkgm.gov.tr/',
            },
            {
                src: '/mock/info/etahsilat.png',
                href: 'https://modules.tkgm.gov.tr/bs/Default.aspx',
            },
            {
                src: '/mock/info/basvurusorgulama.png',
                href: 'https://www.tkgm.gov.tr/e-tahsilat',
            },
        ]

    }, [])
    return (
        <Box sx={[{ bgcolor: "white" }, ...a]}>
            <Container>
                <Swiper
                    modules={[ Autoplay]}
                    autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
                    slidesPerView={1}
                    spaceBetween={spacingFactor}
                    breakpoints={breakpoints}
                >
                    {blocks.map((block, key) => (
                        <SwiperSlide key={key}>
                            <Box
                             
                                sx={{
                                    width: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}

                            >
                                <Link sx={{display: 'inline-block'}} href={block.href} target="_blank" rel="noopener noreferrer nofollow">
                                    <Image src={block.src} width={200} height={200} objectFit="contain" />
                                </Link>
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Container>
        </Box>
    );
}
