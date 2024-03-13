import { RootState } from "@/store";
import { handleLoginOrRegisterModal, handleLoginOrRegisterModalTab } from "@/store/auth";
import { Box, Card, CardContent, Modal, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import RegisterForm from "../form/register-form";
import LoginForm from "../form/login-form";
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`lorpanel-${index}`}
            aria-labelledby={`lor-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{}}>
                    {children}
                </Box>
            )}
        </div>
    );
}
function a11yProps(index: number) {
    return {
        id: `lor-${index}`,
        'aria-controls': `lorpanel-${index}`,
    };
}

export default function LoginOrRegisterModal() {
    const value = useSelector((state: RootState) => state.auth.loginOrRegisterModalTab);
    const dispatch = useDispatch();
    const handleChange = (event: SyntheticEvent, newValue: number) => {
         dispatch(handleLoginOrRegisterModalTab(newValue));
    };
    const isSSR = typeof window === 'undefined';
    
    const isOpen = useSelector(
        (state: RootState) => state.auth.loginOrRegisterModal
    );

    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            dispatch(handleLoginOrRegisterModal(false));
        };

        router.events.on("routeChangeStart", handleRouteChange);
        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, []);
    return (
        <Modal open={isOpen} onClose={() => dispatch(handleLoginOrRegisterModal(false))} disablePortal={isSSR}>
            <Card
                sx={{
                    position: "absolute",
                    transform: "translate(-50%,-50%)",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'stretch',
                    top: "50%",
                    left: "50%",
                    width: (theme) => `calc(100% - ${theme.spacing(4)})`,
                    maxWidth: 380,
                    maxHeight: value == 0 ? { xs: "90vh", sm: 460 } : { xs: "90vh", sm: 680 },
                    
                }}
            >


                <Tabs sx={{ display: 'flex', flexGrow: 0, flexShrink: 0 }} value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab sx={{ width: 0.5 }} label="GİRİŞ YAP" {...a11yProps(0)} />
                    <Tab sx={{ width: 0.5 }} label="KAYIT OL" {...a11yProps(1)} />
                </Tabs>


                <CardContent
                    sx={{
                        position: 'relative',
                        width: 1,
                        py: 0,
                        flex: '1',
                        overflow: 'auto',
                        "&::-webkit-scrollbar": {
                            width: (theme) => theme.spacing(1.5),
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "rgba(0,0,0,.05)",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "rgba(0,0,0,.1);",
                        },

                       


                    }}
                >

                    <TabPanel value={value} index={0}>
                        <LoginForm />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <RegisterForm />
                    </TabPanel>


                </CardContent>
            </Card>
        </Modal>
    );
}

