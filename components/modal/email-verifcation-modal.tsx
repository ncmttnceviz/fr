import useClientAxios from "@/hooks/useClientAxios";
import { AuthContext } from "@/pages/_app";
import postRequestEmailCode from "@/requests/postRequestEmailCode";
import postSendEmailCode from "@/requests/postSendEmailCode";
import { RootState } from "@/store";
import { handleEmailVerificationModal } from "@/store/auth";
import { openInfoSnackbar } from "@/store/info-snackbar";
import CloseIcon from "@mui/icons-material/Close";
import { Card, CardContent, Divider, IconButton, Modal, TextField, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import BlockButton from "../form/block-button";

export default function EmailVerificationModal() {
  

  const isSSR = typeof window === 'undefined';
  const dispatch = useDispatch();
  const actx = useContext(AuthContext);
  const axios = useClientAxios(actx.user);
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const isOpen = useSelector(
    (state: RootState) => state.auth.emailVerificationModal
  );

  const router = useRouter();
  const initialValues: { code: string } = {
    code: '',
  }
  const formik = useFormik({
    initialValues,
    onSubmit: async () => {
      formik.setSubmitting(true)
      try {
        const res = await postSendEmailCode(axios,formik.values.code);
        formik.resetForm();
        handleEmailVerificationModal(false)
        await router.replace(router.asPath);
        dispatch(openInfoSnackbar({ message: 'E-posta adresiniz onaylandı.', severity: 'success' }))
      }
      catch (err) {
        if (err instanceof AxiosError) {
          dispatch(openInfoSnackbar({ message: 'Onay kodu yanlış.', severity: 'error' }))
        }
      }
      formik.setSubmitting(false)

    },
    validationSchema: yup.object({
      code: yup.string().label("Bu alan").required().length(6)
    })
  });


  useEffect(() => {
    const handleRouteChange = (url: string) => {
      dispatch(handleEmailVerificationModal(false));
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  const sendNewCode = useCallback(async () => {
    formik.setSubmitting(true)
    try {
      const res = await postRequestEmailCode(axios);
      dispatch(openInfoSnackbar({ message: 'E-posta adresinize onay kodu gönderildi.', severity: 'success' }))
      setCodeSent(true);
    }
    catch (err) {
      if (err instanceof AxiosError) {
        dispatch(openInfoSnackbar({ message: 'E-posta adresinize kod gönderilemedi.', severity: 'error' }))
      }
    }
    formik.setSubmitting(false)
  }, [])
  return (
    <Modal open={isOpen} onClose={() => dispatch(handleEmailVerificationModal(false))} disablePortal={isSSR}>
      <Card
        sx={{
          position: "absolute",
          transform: "translate(-50%,-50%)",
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'stretch',
          top: "50%",
          left: "50%",
          width: (theme) => `calc(100% - ${theme.spacing(4)})`,
          maxWidth: 380,
          maxHeight: { xs: "90vh", sm: 680 },

        }}
      >

        <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ typography: "h6",display: 'inline-block' }}>E-Posta Doğrulama</Typography>
          <IconButton onClick={() => dispatch(handleEmailVerificationModal(false))}>
            <CloseIcon />
          </IconButton>
        </CardContent>
        <Divider />
        <CardContent component={"form"} onSubmit={formik.handleSubmit}>
          <Typography sx={{ typography: 'body1', type: 'tel' }}>
            Lütfen e-postanıza gönderilen 6 haneli kodu girin.
          </Typography>
          <Typography sx={{ typography: 'body1', type: 'tel' }}>
            Doğrulama kodu e-posta adresinizde yoksa spam/gereksiz klasörünü kontrol edin.
          </Typography>
          <TextField
            sx={{ my: 2 }}
            label="Kod"
            name="code"
            inputProps={{ maxLength: 6 }}
            variant="outlined"
            fullWidth
            error={formik.touched.code && !!formik.errors.code}
            helperText={formik.touched.code && formik.errors.code}
            value={formik.values.code}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <BlockButton type="submit" disabled={(formik.touched && !!!formik.isValid) || formik.isSubmitting} sx={{ maxWidth: 1, mb: 2 }}>
            E-POSTAMI ONAYLA
          </BlockButton>
          {!codeSent && <BlockButton onClick={sendNewCode} disabled={formik.isSubmitting} sx={{ maxWidth: 1 }}>
            YENİ KOD GÖNDER
          </BlockButton>}
        </CardContent>
      </Card>

    </Modal>
  );
}
