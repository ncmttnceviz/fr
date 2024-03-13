
import FilterFormContextProps from "@/contexts/FilterFormContextProps";
import useMakeLayout from "@/hooks/useMakeLayout";
import useSetupInitialFilter from "@/hooks/useSetupInitialFilter";
import getCategories from "@/requests/getCategories";
import getCities from "@/requests/getCities";
import { useDispatch } from "react-redux";

import { withAuth, WithAuthGetServerSideProps } from "@/feature/withAuth";
import Default from "@/layouts/default";
import { useRouter } from "next/router";
import { Box, Card, CardContent, Checkbox, Container, Divider, experimental_sx, FormControl, FormControlLabel, FormHelperText, Grid, Input, InputLabel, Link, OutlinedInput, styled, TextField, TextFieldProps, Typography } from "@mui/material";
import NewAdvertForm from "@/components/form/new-advert-form";
import getAdvertPlans from "@/requests/getAdvertPlans";
import { AdvertPlanModel } from "@/models/advert-model";
import getPaymentDetail from "@/requests/getPaymentDetail";
import { AdvertPaymentForm, PaymentInfoModel } from "@/models/payment-models";
import { useFormik, yupToFormErrors } from "formik";
import "@repay/react-credit-card/dist/react-credit-card.css";
import dynamic from "next/dynamic";
import { ChangeEvent, useCallback, useContext, useMemo, useState } from "react";
import MuiIMask from "@/components/form/i-mask-input";
import BlockButton from "@/components/form/block-button";
import { FOCUS_TYPE } from "@repay/react-credit-card/dist/ReactCreditCard";
import * as yup from "yup";
import postPaymentAdvert from "@/requests/postPaymentAdvert";
import { AuthContext } from "../_app";
import useClientAxios from "@/hooks/useClientAxios";
import { AxiosError } from "axios";
import { openInfoSnackbar } from "@/store/info-snackbar";
import NextLink from "next/link";
import BookmarkIcon from '@mui/icons-material/Bookmark';
export default function PayAdvert({
    paymentDetail
}: { paymentDetail: PaymentInfoModel }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const actx = useContext(AuthContext);
    const axios = useClientAxios(actx.user);
    const CreditCard = useMemo(() => {
        if (typeof window !== 'undefined') {
            return dynamic(() => import("@repay/react-credit-card"));
        }
        return null;
    }, [typeof window])
    const initialValues: Partial<AdvertPaymentForm> & { sale_policy: boolean, privacy_policy: boolean } = {
        cardNumber: '',
        expireYear: '',
        expireMonth: '',
        cvc: '',
        title: paymentDetail.billingAddress.title || "",
        city: paymentDetail.billingAddress.city || "",
        district: paymentDetail.billingAddress.district || "",
        address: paymentDetail.billingAddress.address || "",
        name: '',
        surname: '',
        sale_policy: false,
        privacy_policy: false,
    }


    const formik = useFormik({
        initialValues,
        onSubmit: async () => {
            formik.setSubmitting(true);
            try {
                const res = await postPaymentAdvert(axios, formik.values, router.query.id as string);
                formik.resetForm();
                dispatch(openInfoSnackbar({ message: "Ödeme alındı.İlan sayfasına yönlendiriliyorsunuz.", severity: "success" }))
                router.replace({pathname: '/ilan/[slug]',query: {slug: paymentDetail.ads.slug}});

            }
            catch (er) {
                if (er instanceof AxiosError) {
                    let errorMessage = "Ödeme yaparken bir sorun oluştu";
                    if (er.response?.status === 422) {
                        errorMessage = er.response.data.data;
                    }
                    dispatch(openInfoSnackbar({ message: errorMessage, severity: "error" }))
                }
                console.error(er);
            }
            formik.setSubmitting(false);
        },
        validationSchema: yup.object({
            name: yup.string().required().min(2).max(64).label('Bu alan'),
            surname: yup.string().required().min(2).max(64).label('Bu alan'),
            cardNumber: yup.string().required().length(16).label('Bu alan'),
            expireMonth: yup.string().required().length(2).label('Bu alan'),
            expireYear: yup.string().required().length(2).label('Bu alan'),
            cvc: yup.string().required().length(3).label('Bu alan'),
            title: yup.string().required().min(2).max(64).label('Bu alan'),
            city: yup.string().required().min(2).max(32).label('Bu alan'),
            district: yup.string().required().min(2).max(32).label('Bu alan'),
            address: yup.string().required().max(512).label('Bu alan'),
            privacy_policy: yup.boolean().required().isTrue().label('Bu alan'),
            sale_policy: yup.boolean().required().isTrue().label('Bu alan'),
        })
    })
    const makeFormikBinding = useCallback((key: string, formik: any) => {
        return {
            value: (formik.values as any)[key],
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
            error: Boolean((formik.touched as any)[key] && Boolean((formik.errors as any)[key])),
            helperText: (formik.touched as any)[key] && (formik.errors as any)[key],
            id: `advert-payment-${key}`,
            name: key
        };

    }, [])
    const [focused, setFocus] = useState<FOCUS_TYPE | undefined>(undefined);
    const makeFormikBindingForCard = useCallback((key: string, formik: any) => {
        const a = makeFormikBinding(key, formik) as any;
        a.onFocus = (e: FocusEvent) => setFocus((e.target as any).name as FOCUS_TYPE);
        return a;
    }, [])
    const fullname = useMemo(() => {
        let a = "";
        if (formik.values.name) {
            a += formik.values.name;
        }
        if (formik.values.surname) {
            if (formik.values.name) {
                a += " ";
            }
            a += formik.values.surname;
        }
        return a;
    }, [formik.values.name, formik.values.surname])
    const expiration = useMemo(() => {
        let a = "";
        if (formik.values.expireMonth) {
            a += formik.values.expireMonth;
        }
        if (formik.values.expireYear) {
            if (formik.values.expireMonth) {
                a += "/";
            }
            else {
                a += "  "
            }
            a += formik.values.expireYear;
        }
        return a;
    }, [formik.values.expireMonth, formik.values.expireYear])
    const formProps: TextFieldProps = useMemo(() => ({ size: "small", variant: "outlined", fullWidth: true }), [])
    const handleCardNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        let a = event.target.value;
        if (a) {
            a = a.replaceAll(' ', '');
        }
        formik.setFieldValue('cardNumber', a);

    }
    return (
        <>
            <Container>

                <Box sx={{ mb: 2 }}>

                    <Typography
                        component="h1"
                        typography={"h3"}
                        fontWeight={700}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: { xs: "2rem", sm: "3.2rem" },
                        }}
                    >
                        İLAN ÖDEMESİ

                    </Typography>
                    <NextLink href={{pathname: '/ilan/[slug]',query: {slug: paymentDetail.ads.slug}}} passHref>

                    
                    <Typography
                        target="_blank"
                        component="a"
                        typography={"h6"}

                        sx={{
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: { xs: "1rem", sm: "1.2rem" },
                        }}
                    >
                        {paymentDetail.ads.title}
                    </Typography>
                    </NextLink>
                </Box>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} lg={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Card >
                                        <CardContent>
                                            <Typography sx={{ typography: "h6" }}>KART BİLGİLERİ</Typography>
                                        </CardContent>
                                        <Divider />
                                        <CardContent>
                                            <Grid container spacing={2} justifyContent="center" alignItems={"center"}>
                                                <Grid item xs={"auto"} md={"auto"}>
                                                    <Box sx={{
                                                        transform: { xs: 'scale(0.8)', sm: 'unset' },
                                                        "@media(max-width: 360px)": {
                                                            transform: "scale(0.6)",
                                                        },
                                                    }}>

                                                        {CreditCard && <CreditCard
                                                            number={formik.values.cardNumber}
                                                            name={fullname}
                                                            expiration={expiration}
                                                            focused={focused}
                                                            cvc={formik.values.cvc}
                                                            placeholderName="İSİM SOYİSİM"
                                                            expirationBefore="" />}
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} md>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField label={"Ad"} placeholder={"Ad"} {...formProps} {...makeFormikBindingForCard('name', formik)} />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField label={"Soyad"} placeholder={"Soyad"} {...formProps} {...makeFormikBindingForCard('surname', formik)} />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <FormControl error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)} variant="outlined" size="small" fullWidth>
                                                                <InputLabel htmlFor="cardNumber">Kart Numarası</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    name="cardNumber"
                                                                    id="cardNumber"
                                                                    label={"Kart Numarası"}
                                                                    inputProps={{
                                                                        definitions: {
                                                                            '#': /[0-9]/,
                                                                        }, mask: "#### #### #### ####"
                                                                    }}
                                                                    placeholder="#### #### #### ####"
                                                                    onChange={handleCardNumberChange}
                                                                    onBlur={formik.handleBlur}
                                                                    onFocus={makeFormikBindingForCard('cardNumber', formik).onFocus}
                                                                    value={formik.values.cardNumber}
                                                                    type="tel"
                                                                    inputComponent={MuiIMask as any}
                                                                />
                                                                {formik.touched.cardNumber && Boolean(formik.errors.cardNumber) && <FormHelperText>{formik.errors.cardNumber}</FormHelperText>}
                                                            </FormControl>

                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <FormControl variant="outlined" size="small" error={formik.touched.expireMonth && Boolean(formik.errors.expireMonth)} fullWidth>
                                                                <InputLabel htmlFor="expireMonth">Ay</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    name="expireMonth"
                                                                    type="tel"
                                                                    id="expireMonth"
                                                                    label={"Ay"}
                                                                    inputProps={{
                                                                        definitions: {
                                                                            '#': /[0-9]/,
                                                                        }, mask: "##"
                                                                    }}
                                                                    placeholder="##"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    onFocus={makeFormikBindingForCard('expireMonth', formik).onFocus}
                                                                    value={formik.values.expireMonth}
                                                                    inputComponent={MuiIMask as any}
                                                                />
                                                                {formik.touched.expireMonth && Boolean(formik.errors.expireMonth) && <FormHelperText>{formik.errors.expireMonth}</FormHelperText>}
                                                            </FormControl>

                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <FormControl variant="outlined" size="small" error={formik.touched.expireYear && Boolean(formik.errors.expireYear)} fullWidth>
                                                                <InputLabel htmlFor="expireYear">Yıl</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    name="expireYear"
                                                                    type="tel"
                                                                    id="expireYear"
                                                                    label={"Yıl"}
                                                                    inputProps={{
                                                                        definitions: {
                                                                            '#': /[0-9]/,
                                                                        }, mask: "##"
                                                                    }}
                                                                    placeholder="##"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    onFocus={makeFormikBindingForCard('expireYear', formik).onFocus}
                                                                    value={formik.values.expireYear}

                                                                    inputComponent={MuiIMask as any}
                                                                />
                                                                {formik.touched.expireYear && Boolean(formik.errors.expireYear) && <FormHelperText>{formik.errors.expireYear}</FormHelperText>}
                                                            </FormControl>

                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <FormControl variant="outlined" size="small" error={formik.touched.cvc && Boolean(formik.errors.cvc)} fullWidth>
                                                                <InputLabel htmlFor="cvc">CVC</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    name="cvc"
                                                                    type="tel"
                                                                    id="cvc"
                                                                    label={"CVC"}
                                                                    inputProps={{
                                                                        definitions: {
                                                                            '#': /[0-9]/,
                                                                        }, mask: "###"
                                                                    }}
                                                                    placeholder="###"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    onFocus={makeFormikBindingForCard('cvc', formik).onFocus}
                                                                    value={formik.values.cvc}

                                                                    inputComponent={MuiIMask as any}
                                                                />
                                                                {formik.touched.cvc && Boolean(formik.errors.cvc) && <FormHelperText>{formik.errors.cvc}</FormHelperText>}
                                                            </FormControl>

                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Typography sx={{ typography: "h6" }}>FATURA BİLGİLERİ</Typography>
                                        </CardContent>
                                        <Divider />
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField label={"Kurum/Kişi Adı"} placeholder={"Kurum/Kişi Adı"} {...formProps} {...makeFormikBindingForCard('title', formik)} />
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <TextField label={"Şehir"} placeholder={"Şehir"} {...formProps} {...makeFormikBindingForCard('city', formik)} />
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <TextField label={"İlçe"} placeholder={"İlçe"} {...formProps} {...makeFormikBindingForCard('district', formik)} />
                                                </Grid>
                                                <Grid item xs={12} sm={12}>
                                                    <TextField multiline minRows={4} label={"Adres"} placeholder={"Adres"} {...formProps} {...makeFormikBindingForCard('address', formik)} />
                                                </Grid>
                                            </Grid>

                                        </CardContent>
                                    </Card>
                                </Grid>

                            </Grid>

                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <Card sx={{}}>
                                <CardContent>
                                    <Typography sx={{ typography: "h6" }}>ÖDEME BİLGİLERİ</Typography>
                                </CardContent>
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={2}>
                                        {paymentDetail.details.map((o, key) => <Grid key={key} item xs={12}>
                                            <FormControlLabel control={
                                                <Checkbox
                                                    color="primary"
                                                    checked
                                                    readOnly
                                                    checkedIcon={<BookmarkIcon />}
                                                />
                                            } label={`${o.title} (${o.price})`} />
                                        </Grid>)}


                                    </Grid>


                                </CardContent>
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <FormControlLabel control={
                                                <Checkbox
                                                    color="primary"
                                                    name="sale_policy"
                                                    checked={formik.values.sale_policy}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                            } label={
                                                <Box sx={[!!formik.errors.sale_policy && !!formik.touched.sale_policy && {
                                                    color: 'error.main'
                                                }]}>
                                                    <NextLink href="/mesafeli-satis-sozlesmesi" passHref>
                                                        <Link sx={{ color: 'primary' }} target="_blank">
                                                            Mesafeli Satış Sözleşmesi
                                                        </Link>
                                                    </NextLink>
                                                    'ni okudum ve onaylıyorum.
                                                </Box>} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel control={
                                                <Checkbox
                                                    color="primary"
                                                    name="privacy_policy"
                                                    checked={formik.values.privacy_policy}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                            } label={
                                                <Box sx={[!!formik.errors.privacy_policy && !!formik.touched.privacy_policy && {
                                                    color: 'error.main'
                                                }]}>
                                                    <NextLink href="/gizlilik-sozlesmesi" passHref>
                                                        <Link sx={{ color: 'primary' }} target="_blank">
                                                            Gizlilik Sözleşmesi
                                                        </Link>
                                                    </NextLink>
                                                    'ni okudum ve onaylıyorum.
                                                </Box>} />
                                        </Grid>
                                    </Grid>
                                    <BlockButton disabled={!formik.isValid || formik.isSubmitting} color="primary" type="submit" sx={{ maxWidth: 1, mt: 2, alignSelf: 'flex-end' }}>{`TOPLAM ${paymentDetail.totalPrice} ÖDE`}</BlockButton>
                                </CardContent>
                            </Card>
                        </Grid>

                    </Grid>
                </Box>


            </Container>

        </>
    );
}
PayAdvert.getLayout = useMakeLayout(Default)



export const getServerSideProps: WithAuthGetServerSideProps = withAuth(async (context, user, axios) => {


    try {
        let queryParams = {};
        const paymentDetail = await getPaymentDetail(axios, context.params?.id as string);

        return {
            props: {
                paymentDetail
            },
        };
    } catch (error) {
        console.error(error);
        return {
            notFound: true,
        };
    } finally {
    }
}, true);
