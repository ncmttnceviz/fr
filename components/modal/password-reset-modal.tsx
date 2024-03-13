import useClientAxios from "@/hooks/useClientAxios";
import { AuthContext } from "@/pages/_app";
import postForgotPassword from "@/requests/postForgotPassword";
import postResetPassword from "@/requests/postResetPassword";
import { RootState } from "@/store";
import { handlePasswordResetModal } from "@/store/auth";
import { handleCategoryModal } from "@/store/category-tree";
import { openInfoSnackbar } from "@/store/info-snackbar";
import CloseIcon from "@mui/icons-material/Close";
import { Card, CardContent, Divider, IconButton, Modal, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import BlockButton from "../form/block-button";
export default function PasswordResetModal() {


  const isSSR = typeof window === 'undefined';
  const dispatch = useDispatch();

  const [step, setStep] = useState<"send_mail" | "change_password">("send_mail");
  const [email, setEmail] = useState<string>('');

  const isOpen = useSelector(
    (state: RootState) => state.auth.passwordResetModal
  );

  const router = useRouter();
  const handleOnSendMailSuccess = useCallback((email: string) => {
    setEmail(email);
    setStep("change_password");
  }, [])


  useEffect(() => {
    if (isOpen) {
      setStep('send_mail')
      setEmail('');
    }
  }, [isOpen])
  useEffect(() => {

    const handleRouteChange = (url: string) => {
      dispatch(handlePasswordResetModal(false));
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <Modal open={isOpen} onClose={() => dispatch(handlePasswordResetModal(false))} disablePortal={isSSR}>
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
        <CardContent sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Typography sx={{ typography: 'h6' }}>Şifremi Unuttum</Typography>
          <IconButton onClick={() => dispatch(handlePasswordResetModal(false))}>
            <CloseIcon />
          </IconButton>
        </CardContent>
        <Divider />

        {step === 'send_mail' && <PasswordResetGetCode onSuccess={handleOnSendMailSuccess} />}
        {step === 'change_password' && <PasswordResetChangePassword email={email} />}

      </Card>

    </Modal>
  );
}



function PasswordResetGetCode({ onSuccess }: { onSuccess?: (email: string) => void }) {
  const actx = useContext(AuthContext);
  const axios = useClientAxios(actx.user);
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: async () => {
      formik.setSubmitting(true);
      try {
        const res = await postForgotPassword(axios, formik.values.email);

      }
      catch (err) {

      }
      finally {
        onSuccess && onSuccess(formik.values.email);
        formik.setSubmitting(false);
      }
    },
    validationSchema: yup.object({
      email: yup.string().email().max(32).required().label('Bu alan'),
    })
  })
  return (

    <CardContent component="form" onSubmit={formik.handleSubmit}>
      <Typography>Lütfen e-posta adresinizi girin.</Typography>
      <TextField
        sx={{ my: 2 }}
        label="E-Posta"
        name="email"
        inputProps={{ maxLength: 32 }}
        variant="outlined"
        fullWidth
        error={formik.touched.email && !!formik.errors.email}
        helperText={formik.touched.email && formik.errors.email}
        value={formik.values.email}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />
      <BlockButton type="submit" disabled={(formik.touched && !!!formik.isValid) || formik.isSubmitting} sx={{ maxWidth: 1 }}>
        ŞİFREMİ SIFIRLA
      </BlockButton>
    </CardContent>)

}


function PasswordResetChangePassword({ onSuccess, email }: {
  onSuccess?: () => void
  email: string
}) {
  const actx = useContext(AuthContext);
  const axios = useClientAxios(actx.user);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      code: '',
      password: '',
      password_confirmation: '',
    },
    onSubmit: async () => {
      formik.setSubmitting(true);
      try {
        const res = await postResetPassword(axios, { email, ...formik.values });
        dispatch(openInfoSnackbar({ message: "Şifreniz başarı ile değiştirildi", severity: 'success' }));
        dispatch(handlePasswordResetModal(false));
      }
      catch (err) {
        dispatch(openInfoSnackbar({ message: "Girilen kod geçersiz.", severity: 'error' }));
      }
      finally {
        onSuccess && onSuccess();
        formik.setSubmitting(false);
      }
    },
    validationSchema: yup.object({
      code: yup.string().label("Bu alan").required().length(6),
      password: yup.string().min(8).max(32).required().label('Bu alan'),
      password_confirmation: yup
        .string()
        .test(
          'equal',
          'Bu alan şifre ile aynı olmalıdır',
          function (v) {
            const ref = yup.ref('password');
            return v === this.resolve(ref);
          }
        ).label('Bu alan'),
    })
  })
  return (
    <CardContent component="form" onSubmit={formik.handleSubmit}>
      <Typography>Lütfen e-posta adresinize gönderdiğimiz kodu ve yeni şifrenizi.</Typography>
      <TextField
        sx={{ my: 2 }}
        label="Kod"
        type="tel"
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
      <TextField
        sx={{ my: 2 }}
        label="Yeni Şifre"
        type={"password"}
        name="password"
        inputProps={{ maxLength: 32 }}
        variant="outlined"
        fullWidth
        error={formik.touched.password && !!formik.errors.password}
        helperText={formik.touched.password && formik.errors.password}
        value={formik.values.password}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />
      <TextField
        sx={{ my: 2 }}
        label="Yeni Şifre(Tekrar)"
        type={"password"}
        name="password_confirmation"
        inputProps={{ maxLength: 32 }}
        variant="outlined"
        fullWidth
        error={formik.touched.password_confirmation && !!formik.errors.password_confirmation}
        helperText={formik.touched.password_confirmation && formik.errors.password_confirmation}
        value={formik.values.password_confirmation}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />
      <BlockButton type="submit" disabled={(formik.touched && !!!formik.isValid) || formik.isSubmitting} sx={{ maxWidth: 1 }}>
        ŞİFREMİ DEĞİŞTİR
      </BlockButton>
    </CardContent>)

}