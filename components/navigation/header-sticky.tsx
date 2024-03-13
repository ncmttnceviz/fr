import { Box, Container, Grid, IconButton, Link } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import PhoneIcon from "@mui/icons-material/Phone";
import TwitterIcon from "@mui/icons-material/Twitter";
import MenuIcon from '@mui/icons-material/Menu';
import UserButton from "../auth/user-button";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { handleHeaderSize } from "@/store/header";
import LogoTextWhiteSVG from "@/assets/svg/logo-text-white.svg";
import NextLink from "next/link";
import { handleMobileDrawer } from "@/store/mobile-drawer";
export default function HeaderSticky({ solid }: { solid?: boolean }) {
    const ref = useRef<HTMLElement>(null);
    const [isSticky, setSticky] = useState(false);
    const headerHeight = useSelector((state: RootState) => state.header.headerSize);
    const logoProps = {
        style: { width: 115, height: "auto" },
    };
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const onScroll = () => {

                const h = document.documentElement,
                    b = document.body,
                    st = 'scrollTop',
                    sh = 'scrollHeight';
                const p = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
                setSticky(p >= 1)

            };
            window.addEventListener('scroll', onScroll, { passive: true })
            return () => {
                window.removeEventListener('scroll', onScroll);
            }
        }
    }, [])
    const isSolid = useMemo(() => {
        if (!!!solid) {
            return isSticky
        }
        return !!solid;
    }, [solid, isSticky]);
    const dispatch = useDispatch();
    useEffect(() => {

        if (ref.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                if (entries.length > 0) {
                    const elem = entries[0];
                    if (elem.contentRect.height !== headerHeight) {
                        dispatch(handleHeaderSize(elem.contentRect.height))
                    }
                }

            })
            resizeObserver.observe(ref.current);
            return () => {
                if (ref.current) {
                    resizeObserver.unobserve(ref.current as HTMLElement)
                }
            };
        }

    }, [ref, headerHeight])
    return (
        <Box
            ref={ref}
            component="div"
            sx={[
                {
                    zIndex: 10,
                    position: "fixed",
                    top: "-1px",
                    color: 'white',
                    width: 1,
                    backgroundColor: "rgba(0,0,0,.2)",
                    transition: 'background-color 0.3s ease',

                },
                isSolid && {
                    backgroundColor: "secondary.main",
                },
            ]}
        >
            <Container sx={{ py: { xs: 0.5, md: 0 } }}>
                <Grid container alignItems="center" justifyContent={"space-between"} sx={{ display: { xs: "flex", md: "none" } }}>
                    <Grid item xs={"auto"}>
                        <NextLink href={"/"} passHref>
                            <Link>
                                <LogoTextWhiteSVG {...logoProps} />
                            </Link>
                        </NextLink>
                    </Grid>
                    <Grid item xs={"auto"}>
                        <IconButton aria-label="menu" sx={{ color: 'white' }} onClick={() => dispatch(handleMobileDrawer(true))}>
                            <MenuIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" columnSpacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
                    <Grid item xs={"auto"} visibility={isSticky ? "visible" : "hidden"}>
                        <NextLink href={"/"} passHref>
                            <Link>
                                <LogoTextWhiteSVG style={{width: 140,height: "auto"}} />
                            </Link>
                        </NextLink>
                    </Grid>
                    <Grid
                        item
                        md={2}
                        lg={3}
                        sx={{ display: { xs: "none", md: "flex" } }}
                    />
                    {/* PHONE */}
                    <Grid item md={"auto"}>
                        <Box
                            component="a"
                            href="tel:444 5 738"
                            sx={[
                                {
                                    display: "flex",
                                    gap: 1,
                                    typography: "button",
                                    px: 4,
                                    py: 1.65,
                                    bgcolor: "rgba(0,0,0,0.2)",
                                    color: "currentColor",
                                    fontWeight: "normal",
                                    textDecoration: "none",
                                    transition: 'background-color 0.3s ease',
                                    "&:hover": {
                                        textDecoration: "underline",
                                    },
                                },
                                isSolid && {
                                    bgcolor: "primary.main",
                                },
                            ]}
                        >
                            <PhoneIcon fontSize="small" />
                            <span>444 5 738</span>
                        </Box>
                    </Grid>
                    {/* SOCIALS */}
                    <Grid item md={"auto"}>
                        <Box
                            component="div"
                            sx={[
                                {
                                    display: "flex",
                                    gap: 1.5,
                                    typography: "button",
                                    color: "currentColor",
                                },
                            ]}
                        >
                            <SocialIcon solid={isSolid} href="https://www.facebook.com/musterim.net">
                                <FacebookIcon sx={{ fontSize: "1.15rem" }} />
                            </SocialIcon>
                            <SocialIcon solid={isSolid} href="https://www.instagram.com/musterimnet/">
                                <InstagramIcon sx={{ fontSize: "1.15rem" }} />
                            </SocialIcon>
                        </Box>
                    </Grid>
                    <Grid item xs visibility={{ xs: "hidden", md: "visible" }} />
                    {/* LOGIN */}
                    <Grid item md={"auto"}>
                        <UserButton />
                    </Grid>
                </Grid>
            </Container>
        </Box >
    )
}


function SocialIcon({
    children,
    href,
    solid,
}: {
    children: any;
    href?: string;
    solid?: boolean;
}) {
    return (
        <Box
            component="a"
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer nofollow"
            sx={[
                {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "1px solid white",
                    color: "currentColor",
                    textDecoration: "none",
                    "&:hover": {
                        color: "primary.light",
                    },
                },
                !!solid && {
                    "&:hover": {
                        color: "grey.300"
                    },
                },
            ]}
        >
            {children}
        </Box>
    );
}