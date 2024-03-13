import AppHead from "@/pages/_head";
import { AppProps } from "next/app";
import useMakeTheme from "@/hooks/useMakeTheme";
import { ThemeProvider } from "@mui/material";
import React, { createContext, useEffect, useMemo } from "react";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "@/store";
import { Provider } from "react-redux";
import "@/styles/swiper-theme.css";
import NProgress from 'nprogress';
import Router from 'next/router';
import '@/assets/css/nprogress.css';
import LoginOrRegisterModal from "@/components/modal/login-or-register-modal";
import AuthContextProps from "@/contexts/AuthContext";
import InfoSnackbar from "@/components/popup/info-snackbar";
import MobileDrawer from "@/components/navigation/mobile-drawer";
import dynamic from "next/dynamic";
import EmailVerificationModal from "@/components/modal/email-verifcation-modal";
import GlobalPage from "@/feature/global-page";
import PhoneVerificationModal from "@/components/modal/phone-verification-modal";
import PasswordResetModal from "@/components/modal/password-reset-modal";
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;

};
export const AuthContext = createContext<AuthContextProps>({});
export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {


  const theme = useMakeTheme();
  const getLayout = Component.getLayout ?? ((page) => page);
  const CookieSnackbar = useMemo(() => dynamic(() => import("@/components/popup/cookie-snackbar")), []);
  return (
    <AuthContext.Provider value={{ user: pageProps.user }}>

      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <GlobalPage pageProps={pageProps}>
            <CssBaseline />
            <AppHead />

            <LoginOrRegisterModal />
            <PhoneVerificationModal/>
            <EmailVerificationModal />
            <PasswordResetModal/>
            <InfoSnackbar />
            <MobileDrawer />
            {CookieSnackbar && <CookieSnackbar />}
            {getLayout(<Component {...pageProps} />)}
          </GlobalPage>
        </Provider>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
