import { openInfoSnackbar } from "@/store/info-snackbar";
import Script from "next/script";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function GlobalPage({
  children,
  pageProps,
}: {
  children: any;
  pageProps: any;
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (pageProps.flash) {
      dispatch(
        openInfoSnackbar({
          message: pageProps.flash.message as any,
          severity: pageProps.flash.severity,
        })
      );
    }
  }, []);
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-EV4G9B579Z"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-EV4G9B579Z');
        `}
      </Script>
      {children}
    </>
  );
}
