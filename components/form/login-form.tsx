import useClientAxios from "@/hooks/useClientAxios";
import { LoginFormModel } from "@/models/auth-models";
import postLogin from "@/requests/postLogin";
import { handleLoginOrRegisterModal, handlePasswordResetModal } from "@/store/auth";
import { openInfoSnackbar } from "@/store/info-snackbar";
import { Box, TextField, TextFieldProps, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { setCookies } from "cookies-next";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { tr } from "yup-locales";
import BlockButton from "./block-button";
yup.setLocale(tr);
export default function LoginForm({}: {}) {
  const formProps: TextFieldProps = {
    size: "small",
    variant: "outlined",
    fullWidth: true,
  };
  const router = useRouter();
  const axios = useClientAxios();
  const dispatch = useDispatch();
  const initialValues: LoginFormModel = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async () => {
      formik.setSubmitting(true);
      try {
        const token = await postLogin(
          axios,
          formik.values.email,
          formik.values.password
        );
        setCookies("token", token, { maxAge: 60 * 60 * 24 * 7 });
        formik.resetForm();
        await router.replace(router.asPath);
        dispatch(handleLoginOrRegisterModal(false));
      } catch (er) {
        if (er instanceof AxiosError) {
          let errorMessage = "E-posta veya şifre yanlış.";
          if (er.response?.status === 429) {
            errorMessage =
              "Aynı anda çok fazla giriş yapmaya çalıştınız. Lütfen biraz bekledikten sonra tekrar deneyin.";
          }
          dispatch(
            openInfoSnackbar({ message: errorMessage, severity: "error" })
          );
        }
      }
      formik.setSubmitting(false);
    },
    validationSchema: yup.object({
      email: yup.string().email().max(32).required().label("Bu alan"),
      password: yup.string().max(32).required().label("Bu alan"),
    }),
  });
  return (
    <Box component="form" sx={{ py: 2 }} onSubmit={formik.handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: 3 }}>
        <TextField
          id="login-email"
          label={"E-Posta"}
          {...formProps}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          name="email"
        />

        <TextField
          id="login-password"
          label={"Şifre"}
          {...formProps}
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          name="password"
        />
        <Typography
          onClick={() => dispatch(handlePasswordResetModal(true))}
          sx={{
            display: 'inline-block',
            marginLeft: 'auto',
            color: 'primary.main',
            typography: "body2",
            textDecoration: "underline",
            cursor: "pointer",
            textAlign: "right",
          }}
        >
          Şifremi Unuttum
        </Typography>
        <BlockButton
          type="submit"
          color="secondary"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          GİRİŞ YAP
        </BlockButton>
      </Box>
    </Box>
  );
}
