import useMakeLayout from "@/hooks/useMakeLayout";

import { withAuth, WithAuthGetServerSideProps } from "@/feature/withAuth";
import Default from "@/layouts/default";
import {
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import useClientAxios from "@/hooks/useClientAxios";
import { useCallback, useContext, useMemo } from "react";
import { AuthContext } from "./_app";
import { useFormik } from "formik";
import * as yup from "yup";
import { tr } from "yup-locales";
import ProfileForm from "@/components/form/profile-form";

yup.setLocale(tr);

export default function Profile({}) {
  const { user } = useContext(AuthContext);
  const axios = useClientAxios(user);

  const formik = useFormik({
    initialValues: {
      fullname: user?.fullname,
      advert_phone: user?.advert_phone || user?.phone,
      whatsapp: user?.whatsapp || user?.phone,
    },
    validationSchema: yup.object({
      fullname: yup.string().min(6).max(250).required().label("Bu alan"),
      advert_phone: yup
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
    }),
    async onSubmit() {},
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
    []
  );

  return (
    <Container sx={{ mb: 4 }}>
      <ProfileForm />
    </Container>
  );
}
Profile.getLayout = useMakeLayout(Default);

export const getServerSideProps: WithAuthGetServerSideProps = withAuth(
  async (context, user, axios) => {
    try {
      return {
        props: {},
      };
    } catch (error) {
      //console.error(error);
      return {
        notFound: true,
      };
    } finally {
    }
  },
  true
);
