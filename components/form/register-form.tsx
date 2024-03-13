import makeAxios from "@/feature/makeAxios";
import { CityModel } from "@/models/location-models";
import getCities from "@/requests/getCities";
import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, Link, MenuItem, Select, TextField, TextFieldProps } from "@mui/material";
import NextLink from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Formik, useFormik } from "formik";
import { tr } from "yup-locales"
import * as yup from "yup";
import { RegisterFormModel } from "@/models/auth-models";
import BlockButton from "./block-button";
import useClientAxios from "@/hooks/useClientAxios";
import postRegister from "@/requests/postRegister";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { openInfoSnackbar } from "@/store/info-snackbar";
import { handleLoginOrRegisterModal, handleLoginOrRegisterModalTab } from "@/store/auth";
import { setCookies } from "cookies-next";
import { useRouter } from "next/router";
yup.setLocale(tr);
export default function RegisterForm({ }: {}) {
    const formProps: TextFieldProps = { size: "small", variant: "outlined", fullWidth: true }

    const axios = useClientAxios();
    const [cities, setCities] = useState<CityModel[]>([]);
    const dispatch = useDispatch();
    const router = useRouter();
    const initialValues: RegisterFormModel = {
        email: "",
        phone: "",
        fullname: "",
        password: "",
        password_confirmation: "",
        type: "personal",
        iaa: false,
        land_phone: "",
        activity_area: "real_estate",
        business_type: "person",
        tax_administration_city: "",
        tax_administration: "",
        tax_identity_number: "",
        identity_number: "",
        caa: false,
    };

    const formik = useFormik({
        initialValues,
        onSubmit: async () => {
            formik.setSubmitting(true);
            if (formik.isValid) {
                try {
                    let send: Partial<RegisterFormModel> = { ...formik.values };
                    if (send.type == "personal") {
                        delete send.land_phone;
                        delete send.activity_area;
                        delete send.business_type;
                        delete send.tax_administration_city;
                        delete send.tax_administration;
                        delete send.tax_identity_number;
                        delete send.identity_number;
                        delete send.caa;
                    }
                    else {
                        delete send.iaa;
                    }
                    const response = await postRegister(axios, send);
                    formik.resetForm();
                    dispatch(handleLoginOrRegisterModal(false));
                    setCookies('token',response.token,{maxAge: 60 * 60 * 24 * 7})
                    await router.replace(router.asPath);
                    dispatch(openInfoSnackbar({ message: "Üyeliğiniz oluşturuldu.", severity: "success" }))
                    



                }
                catch (error) {
                    if (error instanceof AxiosError) {
                        let errorMessage = "Bir sorun oluştu. Lütfen daha sonra tekrar deneyin."
                        if (error.response?.data?.data?.email) {
                            errorMessage = formik.errors.email = "Bu e-posta adresi zaten sistemimize kayıtlı.";
                        }
                        if (error.response?.data?.data?.phone) {
                            errorMessage = formik.errors.phone = "Bu telefon numarası zaten sistemimize kayıtlı.";
                        }
                        dispatch(openInfoSnackbar({ message: errorMessage, severity: "error" }))
                    }
                }
            }
            formik.setSubmitting(false);

        },
        validationSchema: yup.object({
            type: yup.string().required(),
            email: yup.string().email().max(32).required().label('Bu alan'),
            phone: yup.string().matches(/[0-9]{10}/g, "Lütfen geçerli bir telefon numarası girin.").length(10).required().label('Bu alan'),
            fullname: yup.string().min(6).max(250).required().label('Bu alan'),
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
            iaa: yup.bool().when('type', { is: 'personal', then: (schema) => schema.required().isTrue() }),
            land_phone: yup.string().label('Bu alan').when('type', { is: 'corporate', then: (schema) => schema.matches(/[0-9]{10}/g, "Lütfen geçerli bir telefon numarası girin.").length(10).required() }),
            activity_area: yup.string().label('Bu alan').when('type', { is: 'corporate', then: (schema) => schema.required() }),
            business_type: yup.string().label('Bu alan').when('type', { is: 'corporate', then: (schema) => schema.required() }),
            tax_administration_city: yup.string().label('Bu alan').when('type', { is: 'corporate', then: (schema) => schema.required() }),
            tax_administration: yup.string().label('Bu alan').when('type', { is: 'corporate', then: (schema) => schema.min(6).max(250).required() }),
            tax_identity_number: yup.string().label('Bu alan').when('type', { is: 'corporate', then: (schema) => schema.matches(/[0-9]{10}/g, "Lütfen geçerli bir vergi kimlik no girin.").length(10).required() }),
            identity_number: yup.string().label('Bu alan').when(['type'], { is: (type: string) => type === 'corporate', then: (schema) => schema.matches(/^[1-9]{1}[0-9]{9}[02468]{1}$/g, "Lütfen geçerli bir TC kimlik no girin.").required() }),
            caa: yup.bool().when('type', { is: 'corporate', then: (schema) => schema.required().isTrue() }),
        })
    })
    useEffect(() => {
        const fd = async () => {
            const d = await getCities(axios);
            setCities(d);
        };
        fd().catch((er) => console.log(er));

    }, [])
    const fullNameLabel = useMemo(() => {
        if (formik.values.type === 'corporate') {
            return "Şirket İsmi"
        }
        return "İsim Soyisim"
    }, [formik.values.type])
    const isTypePersonal = useMemo(() => formik.values.type === 'personal', [formik.values.type])
    const isTypeCorporate = useMemo(() => formik.values.type === 'corporate', [formik.values.type])
    return (
        <Box component="form" sx={{ py: 2 }} onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 3 }}>
                <FormControl {...formProps as any}>
                    <InputLabel id="account-type-label">Hesap Tipi</InputLabel>
                    <Select
                        labelId="account-type-label"
                        label="Hesap Tipi"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.type && Boolean(formik.errors.type)}
                        name="type"

                    >
                        <MenuItem value={"personal"}>Bireysel</MenuItem>
                        <MenuItem value={"corporate"}>Kurumsal</MenuItem>
                    </Select>
                    <FormHelperText>{formik.touched.type && formik.errors.type}</FormHelperText>
                </FormControl>
                <TextField id="register-fullname" name="fullname" label={fullNameLabel} {...formProps}
                    value={formik.values.fullname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                    helperText={formik.touched.fullname && formik.errors.fullname} />
                <TextField id="register-email" label={"E-Posta"} {...formProps}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    name="email" />
                <TextField id="register-phone" label={"Telefon (GSM)"} {...formProps} value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    name="phone"
                    placeholder="5554443322"
                    inputProps={{ maxLength: 10 }} />
                <TextField id="register-password" label={"Şifre"} {...formProps} type="password" value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    name="password" />
                <TextField id="register-password-confirmation" label={"Şifre(Tekrar)"} {...formProps} type="password" value={formik.values.password_confirmation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password_confirmation && Boolean(formik.errors.password_confirmation)}
                    helperText={formik.touched.password_confirmation && formik.errors.password_confirmation}
                    name="password_confirmation" />
                {isTypePersonal && <FormControlLabel control={
                    <Checkbox
                        color="primary"
                        name="iaa"
                        checked={formik.values.iaa}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        size="small"
                    />
                } label={
                    <Box sx={[{ fontSize: ".9rem" }, !!formik.errors.iaa && !!formik.touched.iaa && {
                        color: 'error.main'
                    }]}>
                        <NextLink href="/uyelik-sozlesmesi" passHref>
                            <Link sx={{ color: 'primary' }} target="_blank">
                                Üyelik Sözleşmesi
                            </Link>
                        </NextLink>
                        'ni okudum ve onaylıyorum.
                    </Box>} />}
                {isTypeCorporate && <TextField id="register-phone-land" label={"Telefon (Sabit)"} {...formProps} value={formik.values.land_phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.land_phone && Boolean(formik.errors.land_phone)}
                    helperText={formik.touched.land_phone && formik.errors.land_phone}
                    name="land_phone"
                    placeholder="3124443322"
                    inputProps={{ maxLength: 10 }} />}
                {isTypeCorporate && <FormControl {...formProps as any}

                >
                    <InputLabel id="activity-area-label">Faaliyet Alanı</InputLabel>
                    <Select
                        labelId="activity-area-label"
                        label="Faaliyet Alanı"
                        value={formik.values.activity_area}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.activity_area && Boolean(formik.errors.activity_area)}
                        name="activity_area"
                    >
                        <MenuItem value={"real_estate"}>Emlak</MenuItem>
                        <MenuItem value={"automobile"}>Vasıta</MenuItem>
                    </Select>
                    <FormHelperText>{formik.touched.activity_area && formik.errors.activity_area}</FormHelperText>
                </FormControl>}
                {isTypeCorporate && <FormControl {...formProps as any}>
                    <InputLabel id="business-type-label">İşletme Türü</InputLabel>
                    <Select
                        labelId="business-type-label"
                        label="İşletme Türü"
                        value={formik.values.business_type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.business_type && Boolean(formik.errors.business_type)}
                        name="business_type"
                    >
                        <MenuItem value={"person"}>Şahıs Şirketi</MenuItem>
                        <MenuItem value={"limited"}>Limited veya Anonim Şirketi</MenuItem>
                    </Select>
                    <FormHelperText>{formik.touched.business_type && formik.errors.business_type}</FormHelperText>
                </FormControl>}
                {isTypeCorporate && <FormControl {...formProps as any}>
                    <InputLabel id="tax-city-label">Vergi Dairesi İli</InputLabel>
                    <Select
                        labelId="tax-city-label"
                        label="Vergi Dairesi İli"
                        value={formik.values.tax_administration_city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.tax_administration_city && Boolean(formik.errors.tax_administration_city)}
                        name="tax_administration_city"
                    >
                        {cities.map((c, key) => <MenuItem key={key} value={c.title}>{c.title}</MenuItem>)}
                    </Select>
                    <FormHelperText>{formik.touched.tax_administration_city && formik.errors.tax_administration_city}</FormHelperText>
                </FormControl>}
                {isTypeCorporate && <TextField id="tax-place-name" label={"Vergi Dairesi Adı"} {...formProps}
                    value={formik.values.tax_administration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tax_administration && Boolean(formik.errors.tax_administration)}
                    helperText={formik.touched.tax_administration && formik.errors.tax_administration}
                    name="tax_administration" />}
                {isTypeCorporate && <TextField id="tax-in" label={"Vergi Kimlik No"} {...formProps}
                    value={formik.values.tax_identity_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tax_identity_number && Boolean(formik.errors.tax_identity_number)}
                    helperText={formik.touched.tax_identity_number && formik.errors.tax_identity_number}
                    name="tax_identity_number"
                    inputProps={{ maxLength: 10 }} />}
                {isTypeCorporate && <TextField id="identity-number" label={"TC Kimlik No"} {...formProps}
                    value={formik.values.identity_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.identity_number && Boolean(formik.errors.identity_number)}
                    helperText={formik.touched.identity_number && formik.errors.identity_number}
                    name="identity_number"
                    inputProps={{ maxLength: 11 }} />}
                {isTypeCorporate && <FormControlLabel control={
                    <Checkbox
                        color="primary"
                        name="caa"
                        checked={formik.values.caa}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        size="small"
                    />
                } label={
                    <Box sx={[{ fontSize: ".9rem" }, !!formik.errors.caa && !!formik.touched.caa && {
                        color: 'error.main'
                    }]}>
                        <NextLink href="/uyelik-sozlesmesi" passHref>
                            <Link sx={{ color: 'primary' }} target="_blank">
                                Üyelik Sözleşmesi
                            </Link>
                        </NextLink>
                        'ni okudum ve onaylıyorum.
                    </Box>} />}
                <BlockButton type="submit" color="secondary" disabled={!formik.isValid || formik.isSubmitting}>KAYIT OL</BlockButton>
            </Box>
        </Box>



    )
}