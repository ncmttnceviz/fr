import useClientAxios from "@/hooks/useClientAxios";
import { AuthContext } from "@/pages/_app";
import postRequestPhoneCode from "@/requests/postRequestPhoneCode";
import postSendPhoneCode from "@/requests/postSendPhoneCode";
import { RootState } from "@/store";
import { handleSmsVerificationModal } from "@/store/auth";
import { openInfoSnackbar } from "@/store/info-snackbar";
import CloseIcon from "@mui/icons-material/Close";
import {
  Card,
  CardContent,
  Divider,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import BlockButton from "../form/block-button";

export default function PhoneVerificationModal() {
  const isSSR = typeof window === "undefined";
  const dispatch = useDispatch();
  const actx = useContext(AuthContext);
  const axios = useClientAxios(actx.user);
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const isOpen = useSelector(
    (state: RootState) => state.auth.smsVerificationModal
  );

  const router = useRouter();
  const initialValues: { code: string } = {
    code: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: async () => {
      formik.setSubmitting(true);
      try {
        const res = await postSendPhoneCode(axios, formik.values.code);
        formik.resetForm();
        handleSmsVerificationModal(false);
        await router.replace(router.asPath);
        dispatch(
          openInfoSnackbar({
            message: "Telefon numaranız onaylandı.",
            severity: "success",
          })
        );
      } catch (err) {
        if (err instanceof AxiosError) {
          dispatch(
            openInfoSnackbar({
              message: "Onay kodu geçersiz veya zaman aşımına uğramış.",
              severity: "error",
            })
          );
        }
      }
      formik.setSubmitting(false);
    },
    validationSchema: yup.object({
      code: yup.string().label("Bu alan").required().length(6),
    }),
  });

  const formikCode = useFormik({
    initialValues: {
      phone: "",
    },
    onSubmit: async () => {
      formik.setSubmitting(true);
      try {
        const res = await postRequestPhoneCode(axios, formikCode.values.phone);
        dispatch(
          openInfoSnackbar({
            message: "Telefon numaranıza onay kodu gönderildi.",
            severity: "success",
          })
        );
        setCodeSent(true);
        formikCode.resetForm();
      } catch (err) {
        if (err instanceof AxiosError) {
          dispatch(
            openInfoSnackbar({
              message:
                "Telefon numarası yanlış veya bir kod zaten gönderilmiş.",
              severity: "error",
            })
          );
        }
      }
      formik.setSubmitting(false);
    },
    validationSchema: yup.object({
      phone: yup
        .string()
        .matches(/[0-9]{10}/g, "Lütfen geçerli bir telefon numarası girin.")
        .length(10)
        .required()
        .label("Bu alan"),
    }),
  });

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      dispatch(handleSmsVerificationModal(false));
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <Modal
      open={isOpen}
      onClose={() => dispatch(handleSmsVerificationModal(false))}
      disablePortal={isSSR}
    >
      <Card
        sx={{
          position: "absolute",
          transform: "translate(-50%,-50%)",
          userSelect: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "stretch",
          top: "50%",
          left: "50%",
          width: (theme) => `calc(100% - ${theme.spacing(4)})`,
          maxWidth: 380,
          maxHeight: { xs: "90vh", sm: 680 },
        }}
      >
        <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ typography: "h6",display: 'inline-block' }}>Telefon Doğrulama</Typography>
          <IconButton onClick={() => dispatch(handleSmsVerificationModal(false))}>
            <CloseIcon />
          </IconButton>
        </CardContent>
        <Divider />
        <CardContent component={"form"} onSubmit={formik.handleSubmit}>
          <Typography sx={{ typography: "body1", type: "tel" }}>
            Lütfen telefonunuza gönderilen 6 haneli kodu girin.
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
          <BlockButton
            type="submit"
            disabled={
              (formik.touched && !!!formik.isValid) || formik.isSubmitting
            }
            sx={{ maxWidth: 1, mb: 2 }}
          >
            TELEFONU NUMARAMI ONAYLA
          </BlockButton>
        </CardContent>
        <Divider />
        <CardContent>
          <Typography sx={{ typography: "h6" }}>Yeni Kod Gönder</Typography>
        </CardContent>
        <Divider />
        <CardContent component="form" onSubmit={formikCode.handleSubmit}>
          <TextField
            sx={{ my: 2 }}
            label="Telefon Numaranız"
            name="phone"
            inputProps={{ maxLength: 10 }}
            placeholder={"5554443322"}
            variant="outlined"
            fullWidth
            error={formikCode.touched.phone && !!formikCode.errors.phone}
            helperText={formikCode.touched.phone && formikCode.errors.phone}
            value={formikCode.values.phone}
            onBlur={formikCode.handleBlur}
            onChange={formikCode.handleChange}
          />
          <BlockButton
            type="submit"
            disabled={
              (formikCode.touched && !!!formikCode.isValid) ||
              formikCode.isSubmitting
            }
            sx={{ maxWidth: 1 }}
          >
            YENİ KOD GÖNDER
          </BlockButton>
        </CardContent>
      </Card>
    </Modal>
  );
}
