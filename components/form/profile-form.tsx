import useClientAxios from "@/hooks/useClientAxios";
import {
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useMemo } from "react";

import { AuthContext } from "@/pages/_app";
import { useFormik } from "formik";
import * as yup from "yup";
import { tr } from "yup-locales";
import UserAvatar from "../content/user-avatar";
import SingleImageUpload from "./single-image-upload";
import BlockButton from "./block-button";
import postProfile from "@/requests/postProfile";
import { useDispatch } from "react-redux";
import { openInfoSnackbar } from "@/store/info-snackbar";
import { useRouter } from "next/router";

yup.setLocale(tr);

export default function ProfileForm({}) {
  const { user } = useContext(AuthContext);
  const axios = useClientAxios(user);
  const dispatch = useDispatch();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      fullname: user?.fullname as string,
      phone: user?.advert_phone || (user?.phone as string),
      whatsapp: user?.whatsapp || (user?.phone as string),
      image: undefined as { file: File; preview: string } | undefined,
    },
    validationSchema: yup.object({
      fullname: yup.string().min(6).max(250).required().label("Bu alan"),
      phone: yup
        .string()
        .matches(/[0-9]{10}/g, "Lütfen geçerli bir telefon numarası girin.")
        .length(10)
        .required()
        .label("Bu alan"),
      whatsapp: yup
        .string()
        .matches(/[0-9]{10}/g, "Lütfen geçerli bir telefon numarası girin.")
        .length(10)
        .required()
        .label("Bu alan"),
      image: yup
        .object()
        .label("Bu alan")
        .nullable()
        .shape({
          file: yup
            .mixed()
            .nullable()
            .test("size", "Resim boyutu 1MB'dan küçük olmalıdır", (value) => {
              return !!!value || value?.size <= 1024 * 1024 * 1;
            }),
        }),
    }),
    async onSubmit() {
      formik.setSubmitting(true);
      try {
        const res = await postProfile(axios, formik.values);
        await router.replace(router.asPath);
        dispatch(
          openInfoSnackbar({
            message: "Bilgileriniz güncellendi.",
            severity: "success",
          })
        );
      } catch (error) {
        openInfoSnackbar({
          message: "Bir sorun oluştu. Lütfen daha sonra tekrar deneyin.",
          severity: "error",
        });
      } finally {
        formik.setSubmitting(false);
      }
    },
  });
  const textFieldProps = useCallback<
    (label: string, name: string) => Partial<TextFieldProps>
  >(
    (label, name) => ({
      fullWidth: true,
      size: "small",
      variant: "outlined",
      name,
      label,
      value: (formik.values as any)[name],
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: Boolean(
        (formik.touched as any)[name] && Boolean((formik.errors as any)[name])
      ),
      helperText: (formik.touched as any)[name] && (formik.errors as any)[name],
      id: `profile-${name}`,
    }),
    [formik]
  );

  const profileImage = useMemo(() => {
    return formik.values?.image?.preview || user?.image?.small || undefined;
  }, [formik.values.image, user]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardContent>
          <Typography
            component="h1"
            sx={{ typography: "h4", fontWeight: "bold" }}
          >
            PROFİLİM
          </Typography>
        </CardContent>
        <Divider />
        <CardContent>
          <Grid container justifyContent={"center"} spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <UserAvatar
                src={profileImage}
                fallbackName={user!.fullname}
                sx={{ mb: 2 }}
              />
              {!formik.isSubmitting && (
                <SingleImageUpload
                  sx={{
                    py: 1,
                    maxWidth: 220,
                    fontSize: ".9rem",
                  }}
                  error={formik.errors.image}
                  onChange={(item) => formik.setFieldValue("image", item, true)}
                >
                  PROFİL RESMİ SEÇ
                </SingleImageUpload>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                {...textFieldProps(
                  user?.type == "personal" ? "İsim Soyisim" : "Şirket İsmi",
                  "fullname"
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...textFieldProps("İlan Telefon Numarası", "phone")}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...textFieldProps("İlan Whatsapp Numarası", "whatsapp")}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardContent>
          <Grid container justifyContent={{ xs: "center", md: "flex-end" }}>
            <Grid item xs={12} md={4}>
              <BlockButton
                sx={{ width: 1, maxWidth: "unset" }}
                disabled={!formik.isValid || formik.isSubmitting}
                type="submit"
              >
                {formik.isSubmitting
                  ? "LÜTFEN BEKLEYİN..."
                  : "PROFİL BİLGİLERİMİ GÜNCELLE"}
              </BlockButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
}
