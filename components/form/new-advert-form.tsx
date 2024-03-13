import useClientAxios from "@/hooks/useClientAxios";
import {
  AdvertPlanModel,
  ListingAdvertModel,
  NewAdvertFormModel,
} from "@/models/advert-model";
import {
  BaseCategoryModel,
  CategoryDetailModel,
} from "@/models/category-model";
import {
  CityModel,
  DistrictModel,
  NeighborhoodModel,
} from "@/models/location-models";
import getCities from "@/requests/getCities";
import { openInfoSnackbar } from "@/store/info-snackbar";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  experimental_sx,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
  TextFieldProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { tr } from "yup-locales";
import AdvertCard from "../image/advert-card";
import BlockButton from "./block-button";
import GoogleMapPicker from "./google-map-picker";
import ImageUpload, { ImageToBeUploaded } from "./image-upload";
import HelpIcon from "@mui/icons-material/Help";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import postAdvert from "@/requests/postAdvert";
import { AuthContext } from "@/pages/_app";
import CategoryNavigator from "../navigation/category-navigator";
import getCategoryDetailed from "@/requests/getCategoryDetailed";
yup.setLocale(tr);
export default function NewAdvertForm({
  advertPlans,
}: {
  advertPlans: AdvertPlanModel[];
}) {
  const formProps: TextFieldProps = {
    size: "small",
    variant: "outlined",
    fullWidth: true,
  };
  const [vipDescription, setVipDescription] = useState(false);
  const [category, setCategory] = useState<BaseCategoryModel | undefined>(
    undefined
  );
  const [showcaseDescription, setShowcaseDescription] = useState(false);
  const noPlan = { plan_key: "none", price: 0 } as AdvertPlanModel;
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const infinteImagePlan = useMemo(
    () => advertPlans.find((o) => o.plan_key == "extraPhoto") || noPlan,
    []
  );
  const vipPlan = useMemo(
    () => advertPlans.find((o) => o.plan_key == "vipPlan") || noPlan,
    []
  );
  const showcasePlan = useMemo(
    () => advertPlans.find((o) => o.plan_key == "categoryPlan") || noPlan,
    []
  );
  const scrollProps = {
    maxHeight: "480px",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: (theme: any) => theme.spacing(1.5),
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(0,0,0,.05)",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(0,0,0,.1);",
    },
  };
  const router = useRouter();
  const actx = useContext(AuthContext);
  const axios = useClientAxios(actx.user);
  const dispatch = useDispatch();
  const tryFormatter = useMemo(
    () =>
      Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      }),
    []
  );

  const initialValues: Partial<
    NewAdvertFormModel & {
      category: CategoryDetailModel;
      payment: number[];
    }
  > = {
    title: "",
    description: "",
    price: 0,
    cover_photo: 0,
    options: [],
    inputs: [],
    attributes: [],
    images: [],
    category: undefined,
    city: undefined,
    district: undefined,
    neighborhood: undefined,
    latitude: 39.9035557,
    longitude: 32.6226794,
    payment: [],
  };
  const formGridProps = { xs: 12 };

  const formik = useFormik({
    initialValues,
    onSubmit: async () => {
      formik.setSubmitting(true);
      try {
        const res = await postAdvert(axios, formik.values, (event) => {
          setUploadProgress((event.loaded / event.total) * 100);
        });
        setUploadProgress(0);
        formik.resetForm();
        if (res.advert_id && res.required_payment) {
          router.replace({
            pathname: "/ilan-ode/[id]",
            query: { id: res.advert_id },
          });
          dispatch(
            openInfoSnackbar({
              message:
                "İlan başarı ile oluşturuldu.Ödeme sayfasına yönlendiriliyorsunuz.",
              severity: "success",
            })
          );
        } else {
          router.replace({ pathname: "/ilanlarim" });
          dispatch(
            openInfoSnackbar({
              message:
                "İlanınız başarı ile oluşturuldu.Sistemimiz tarafından onaylandıktan sonra yayına alınacaktır.",
              severity: "success",
            })
          );
        }
      } catch (er) {
        if (er instanceof AxiosError) {
          let errorMessage =
            "Bir sorun oluştu. Lütfen daha sonra tekrar deneyin.";
          dispatch(
            openInfoSnackbar({ message: errorMessage, severity: "error" })
          );
        }
        console.error(er);
      }
      formik.setSubmitting(false);
    },
    validationSchema: yup.object({
      title: yup.string().max(128).required().label("Bu alan"),
      description: yup.string().max(2048).required().label("Bu alan"),
      price: yup
        .number()
        .typeError("${label} bir sayı olmalıdır")
        .integer("${label} bir tam sayı olmalıdır")
        .min(1)
        .max(99999999999)
        .required()
        .label("İlan fiyatı"),
      images: yup
        .array()
        .label("Bu alan")
        .min(1)
        .when("payment.0", {
          is: (val: any) => !!val,
          then: (schema) => schema.max(200),
          otherwise: (schema) => schema.max(20),
        })
        .of(
          yup.object().shape({
            file: yup
              .mixed()
              .test("size", "Resim boyutu 8MB'dan küçük olmalıdır", (value) => {
                return value.size <= 1024 * 1024 * 8;
              }),
          })
        ),
      city: yup.object().label("Bu alan").required().nullable(),
      district: yup.object().label("Bu alan").required().nullable(),
      neighborhood: yup.object().label("Bu alan").required().nullable(),
      category: yup
        .object()
        .shape({
          children: yup
            .array()
            .length(0, "Seçilen kategorinin alt kategorisi olmamalı."),
        })
        .label("Bu alan")
        .required("Lütfen bir kategori seçin"),
      options: yup.array().of(
        yup
          .object()
          .label("Bu alan")
          .shape({
            optionId: yup.number().required(),
            valueId: yup.number().required().label("Bu alan"),
          })
      ),
      inputs: yup.array().of(
        yup
          .object()
          .label("Bu alan")
          .shape({
            optionId: yup.number().required(),
            valueId: yup
              .string()
              .max(12)
              .matches(/[0-9]+/g, "${label} rakamlardan oluşmalıdır")
              .required()
              .label("Bu alan"),
          })
      ),
      attributes: yup.array().of(
        yup
          .object()
          .label("Bu alan")
          .shape({
            optionId: yup.number().nullable(),
            valueId: yup.number().nullable().label("Bu alan"),
          })
      ),
    }),
  });

  useEffect(() => {
    const fn = async () => {
      if (category && category.id) {
        const cat = await getCategoryDetailed(axios, category.id + "");
        formik.setFieldValue("category", cat, true);
      }
    };
    fn();
  }, [category]);
  const totalPrice = useMemo(() => {
    let total = 0;
    if (formik.values.payment) {
      formik.values.payment.forEach((id) => {
        if (id) {
          const plan = advertPlans.find((o) => o.id == id);
          if (plan) {
            total += Number.parseFloat(plan.price + "");
          }
        }
      });
    }
    return total;
  }, [formik.values.payment]);

  const preview = useMemo(() => {
    if (
      formik.values.images &&
      formik.values.cover_photo !== undefined &&
      formik.values.images[formik.values.cover_photo] &&
      formik.values.images[formik.values.cover_photo].preview &&
      formik.values.city &&
      formik.values.district &&
      formik.values.neighborhood &&
      formik.values.category
    ) {
      const a = {
        title: formik.values.title,
        description: formik.values.description,
        price: formik.values.price,
        image: formik.values.images[formik.values.cover_photo].preview,
        city: formik.values.city.title,
        is_vip: !!(formik.values.payment && formik.values.payment[1]),
        district: formik.values.district.title,
        neighborhood: formik.values.neighborhood.title,
        category_title: formik.values.category.title,
      } as ListingAdvertModel;
      return a;
    }
    return null;
  }, [
    formik.values.title,
    formik.values.description,
    formik.values.price,
    formik.values.images,
    formik.values.city,
    formik.values.district,
    formik.values.neighborhood,
    formik.values.category,
    formik.values.payment,
    formik.values.cover_photo
  ]);
  const makeFormikBinding = useCallback((key: string, formik: any) => {
    return {
      value: (formik.values as any)[key],
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: Boolean(
        (formik.touched as any)[key] && Boolean((formik.errors as any)[key])
      ),
      helperText: (formik.touched as any)[key] && (formik.errors as any)[key],
      id: `new-advert-${key}`,
      name: key,
    };
  }, []);
  const makeFormikBindingOptions = useCallback(
    (key: string, index: number, id: number, formKey: string, formik: any) => {
      const val = (formik.values as any)[key];
      const fieldValue: any = {};
      fieldValue[formKey] = id;
      return {
        input: {
          value: (val && val[index] && val[index]["valueId"]) || "",
          onChange: (event: any) =>
            formik.setFieldValue(
              `${key}.${index}`,
              { ...fieldValue, valueId: event.target.value },
              false
            ),
          onBlur: (event: FocusEvent<HTMLInputElement>) => {
            formik.handleBlur(event);
            formik.setFieldValue(`${key}.${index}`, {
              ...fieldValue,
              valueId: event.target?.value,
            });
          },
          id: `${key}.${index}`,
          name: `${key}.${index}`,
        },
        control: {
          error: Boolean(
            (formik.touched as any)[key] &&
              Boolean(
                (formik.errors as any)[key] &&
                  Boolean((formik.errors as any)[key][index])
              )
          ),
        },
        helperText:
          (formik.touched as any)[key] &&
          (formik.errors as any)[key] &&
          (formik.errors as any)[key][index] &&
          (formik.errors as any)[key][index]["valueId"],
      };
    },
    []
  );

  const makeFormikBindingInputs = useCallback(
    (key: string, index: number, id: number, formik: any) => {
      const a = makeFormikBindingOptions(key, index, id, "optionId", formik);
      const b = { ...a.input, ...a.control, helperText: a.helperText };
      return b;
    },
    []
  );
  const onMapChange = (lat: number, lng: number) => {
    formik.setFieldValue("latitude", lat, true);
    formik.setFieldValue("longitude", lng, true);
  };
  useEffect(() => {
    formik.values.options = [];
    formik.values.inputs = [];

    formik.values.attributes = [];
    let touchObject: any = {};
    if (formik.values.category) {
      touchObject = {
        title: true,
        description: true,
        images: true,
        city: true,
        district: true,
        neighborhood: true,
        category: true,
        price: true,
      };

      formik.values.category?.options.forEach((o) => {
        let key = "options";
        if (o.type === "range" || o.type === "input") {
          key = "inputs";
        }

        ((formik.values as any)[key] as any[]).push({
          optionId: o.id,
          valueId: "",
        });
      });

      formik.setTouched({ options: true, inputs: true, ...touchObject }, true);
    }
  }, [formik.values.category]);

  const [cities, setCities] = useState<CityModel[]>([]);
  const [districts, setDistricts] = useState<DistrictModel[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodModel[]>([]);
  useEffect(() => {
    const fn = async () => {
      setCities(await getCities(axios));
    };
    fn();
  }, []);
  useEffect(() => {
    const fn = async () => {
      if (formik.values.city) {
        const res = await axios.get(`/districts/${formik.values.city.id}`);
        setDistricts(res.data.data as DistrictModel[]);
        formik.setFieldValue("district", 0);
      }
    };
    fn();
  }, [formik.values.city]);
  useEffect(() => {
    const fn = async () => {
      if (formik.values.district) {
        const res = await axios.get(
          `/neighborhoods/${formik.values.district.id}`
        );
        setNeighborhoods(res.data.data as NeighborhoodModel[]);
        formik.setFieldValue("neighborhood", 0);
      }
    };
    fn();
  }, [formik.values.district]);

  const mapHandler = useRef(null);
  useEffect(() => {
    if (
      (mapHandler.current && formik.values.city) ||
      formik.values.district ||
      formik.values.neighborhood
    ) {
      let str: any = [
        formik.values.city?.title,
        formik.values.district?.title,
        formik.values.neighborhood?.title,
      ];
      str = str.filter((o: any) => !!o).join(",");
      (mapHandler.current as any).changeLocationUsingPlaceName(str);
    }
  }, [formik.values.city, formik.values.district, formik.values.neighborhood]);

  const onAttributeChange = (
    event: ChangeEvent<HTMLInputElement>,
    attributeId: number,
    valueId: number
  ) => {
    const val = !!event.target.checked;
    if (formik.values.attributes) {
      formik.setFieldValue(`attributes.${valueId}`, null);
      if (val) {
        formik.setFieldValue(`attributes.${valueId}`, { attributeId, valueId });
      }
    }
  };
  const isAttributeChecked = useCallback(
    (attributeId: number, valueId: number, formik: any) => {
      if (formik.values.attributes) {
        return !!formik.values.attributes[valueId];
      }
      return false;
    },
    []
  );
  return (
    <Box component={"form"} sx={{ my: 3 }} onSubmit={formik.handleSubmit}>
      <Grid
        container
        spacing={2}
        alignItems="stretch"
        justifyContent={"center"}
      >
        <Grid item xs={12} md={7} lg={4}>
          <Card sx={{ height: 1 }}>
            <CardContent onClick={() => console.log(formik.values)}>
              <FormSectionHeader>GENEL BİLGİLER</FormSectionHeader>
            </CardContent>
            <Divider />
            <Box sx={scrollProps}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item {...formGridProps}>
                    <TextField
                      label={"İlan Başlığı"}
                      {...formProps}
                      {...makeFormikBinding("title", formik)}
                    />
                  </Grid>
                  <Grid item {...formGridProps}>
                    <TextField
                      multiline
                      minRows={4}
                      label={"İlan Açıklaması"}
                      {...formProps}
                      type="text"
                      {...makeFormikBinding("description", formik)}
                    />
                  </Grid>
                  <Grid item {...formGridProps}>
                    <TextField
                      label={"İlan Fiyatı"}
                      {...formProps}
                      type="number"
                      {...makeFormikBinding("price", formik)}
                    />
                  </Grid>

                  <Grid item {...formGridProps}>
                    <Autocomplete
                      size="small"
                      disablePortal
                      noOptionsText={"Sonuç Yok"}
                      options={cities}
                      getOptionLabel={(option: CityModel) =>
                        option.title?.trim() || ""
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.id == value?.id
                      }
                      renderInput={(params) => (
                        <TextField
                          name={"city"}
                          error={
                            formik.touched.city && Boolean(formik.errors.city)
                          }
                          helperText={
                            formik.touched.city && (formik.errors as any).city
                          }
                          {...params}
                          label="Şehir"
                        />
                      )}
                      value={formik.values.city || null}
                      onChange={(val, val2) =>
                        formik.setFieldValue("city", val2, true)
                      }
                      onBlur={formik.handleBlur}
                      id={`new-advert-city`}
                    />
                  </Grid>
                  <Grid item {...formGridProps}>
                    <Autocomplete
                      size="small"
                      disabled={!!!formik.values.city}
                      disablePortal
                      noOptionsText={"Sonuç Yok"}
                      options={districts}
                      getOptionLabel={(option: DistrictModel) =>
                        option.title?.trim() || ""
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.id == value?.id
                      }
                      renderInput={(params) => (
                        <TextField
                          name={"district"}
                          error={
                            formik.touched.district &&
                            Boolean(formik.errors.district)
                          }
                          helperText={
                            formik.touched.district &&
                            (formik.errors as any).district
                          }
                          {...params}
                          label="İlçe"
                        />
                      )}
                      value={formik.values.district || null}
                      onChange={(val, val2) =>
                        formik.setFieldValue("district", val2, true)
                      }
                      onBlur={formik.handleBlur}
                      id={`new-advert-district`}
                    />
                  </Grid>
                  <Grid item {...formGridProps}>
                    <Autocomplete
                      size="small"
                      disabled={!!!formik.values.district}
                      disablePortal
                      noOptionsText={"Sonuç Yok"}
                      options={neighborhoods}
                      getOptionLabel={(option: NeighborhoodModel) =>
                        option.title?.trim() || ""
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.id == value?.id
                      }
                      getOptionDisabled={(option) => option.is_parent}
                      renderInput={(params) => (
                        <TextField
                          name={"neighborhood"}
                          error={
                            formik.touched.neighborhood &&
                            Boolean(formik.errors.neighborhood)
                          }
                          helperText={
                            formik.touched.neighborhood &&
                            (formik.errors as any).neighborhood
                          }
                          {...params}
                          label="Mahalle"
                        />
                      )}
                      value={formik.values.neighborhood || null}
                      onChange={(val, val2) =>
                        formik.setFieldValue("neighborhood", val2, true)
                      }
                      onBlur={formik.handleBlur}
                      id={`new-advert-neighborhood`}
                    />
                  </Grid>

                  <Grid item {...formGridProps}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="success"
                          name="payment.0"
                          checked={
                            formik.values.payment &&
                            formik.values.payment[0] == infinteImagePlan.id
                          }
                          onChange={(ev) =>
                            formik.setFieldValue(
                              "payment.0",
                              ev.target.checked
                                ? infinteImagePlan.id
                                : undefined
                            )
                          }
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                      label={`Sınırsız resim ekleme (${tryFormatter.format(
                        infinteImagePlan.price
                      )})`}
                    />

                    <ImageUpload
                      error={formik.errors.images}
                      selectable={true}
                      sortable={true}
                      onChange={(items) =>
                        formik.setFieldValue("images", items, true)
                      }
                      onImageSelect={(item) =>
                        formik.setFieldValue(
                          "cover_photo",
                          item ? Math.max(formik.values.images?.indexOf(item as ImageToBeUploaded) ||0,0) : 0,
                          true
                        )
                      }
                    >
                      RESİM YÜKLE (
                      {`${
                        formik.values.payment && formik.values.payment[0]
                          ? "SINIRSIZ"
                          : "Maks 20"
                      }`}
                      )
                    </ImageUpload>
                  </Grid>
                </Grid>
              </CardContent>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={7} lg={4}>
          <Card sx={{ height: 1 }}>
            <CardContent>
              <FormSectionHeader>HARİTA KONUMU</FormSectionHeader>
            </CardContent>
            <Divider />
            <Box sx={scrollProps}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item {...formGridProps}>
                    <GoogleMapPicker ref={mapHandler} onChange={onMapChange} />
                  </Grid>
                </Grid>
              </CardContent>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={7} lg={4}>
          <Card sx={{ height: 1 }}>
            <CardContent>
              <FormSectionHeader>KATEGORİ</FormSectionHeader>
              {formik.errors.category && (
                <Typography
                  sx={{ mt: 2, typography: "body2", color: "error.main" }}
                >
                  {typeof formik.errors.category === "string"
                    ? formik.errors.category
                    : (formik.errors.category as any).children}
                </Typography>
              )}
            </CardContent>

            <Divider />
            <Box sx={scrollProps}>
              <CategoryNavigator
                noTitle
                sx={{
                  border: "none",
                  boxShadow: "none",
                }}
                category={category}
                onChange={(a) => setCategory(a)}
              />
            </Box>
          </Card>
        </Grid>
        {!!!formik.errors.category && formik.values.category && (
          <Grid item xs={12}>
            <Card sx={{ height: 1 }}>
              <CardContent>
                <FormSectionHeader>İLAN ÖZELLİKLERİ</FormSectionHeader>
              </CardContent>
              <Divider />
              <Box>
                <CardContent>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {formik.values.category.options
                      .filter(
                        (option) =>
                          option.type === "range" || option.type === "input"
                      )
                      .map((option, optKey) => (
                        <Grid key={optKey} xs={12} sm={6} md={4} item>
                          <TextField
                            label={option.title}
                            {...formProps}
                            {...makeFormikBindingInputs(
                              "inputs",
                              optKey,
                              option.id,
                              formik
                            )}
                            inputProps={{ maxLength: 12 }}
                            type="tel"
                          />
                        </Grid>
                      ))}
                    {formik.values.category.options
                      .filter(
                        (option) =>
                          option.type !== "range" && option.type !== "input"
                      )
                      .map((option, optKey) => (
                        <Grid key={optKey} xs={12} sm={6} md={4} item>
                          <FormControl
                            size="small"
                            fullWidth
                            {...makeFormikBindingOptions(
                              "options",
                              optKey,
                              option.id,
                              "optionId",
                              formik
                            ).control}
                          >
                            <InputLabel id={`option-${option.id}`}>
                              {option.title}
                            </InputLabel>
                            <Select
                              labelId={`option-${option.id}`}
                              label={option.title}
                              {...makeFormikBindingOptions(
                                "options",
                                optKey,
                                option.id,
                                "optionId",
                                formik
                              ).input}
                            >
                              {option.values &&
                                option.values.map((optv) => (
                                  <MenuItem key={optv.id} value={optv.id}>
                                    {optv.title}
                                  </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                              {
                                makeFormikBindingOptions(
                                  "options",
                                  optKey,
                                  option.id,
                                  "optionId",
                                  formik
                                ).helperText
                              }
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      ))}
                  </Grid>

                  {formik.values.category &&
                    formik.values.category.attributes.map((attr, attrKey) => (
                      <Grid
                        key={attrKey}
                        container
                        columnSpacing={2}
                        rowSpacing={1}
                        sx={{ mb: 2 }}
                      >
                        <Grid item xs={12}>
                          <Typography sx={{ typography: "h6" }}>
                            {attr.title}
                          </Typography>
                        </Grid>
                        {attr.values.map((attrVal, attrValKey) => (
                          <Grid
                            key={attrValKey}
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            lg={3}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isAttributeChecked(
                                    attr.id,
                                    attrVal.id,
                                    formik
                                  )}
                                  onChange={(ev) =>
                                    onAttributeChange(ev, attr.id, attrVal.id)
                                  }
                                  size="small"
                                />
                              }
                              label={attrVal.title}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    ))}
                </CardContent>
              </Box>
            </Card>
          </Grid>
        )}
        {!formik.isValid && (
          <Grid item xs={12}>
            <Card sx={{ height: 1 }}>
              <CardContent>
                <FormSectionHeader sx={{ color: "error.main" }}>
                  EKSİK ALANLAR VAR
                </FormSectionHeader>
              </CardContent>
              <Divider />
              <Box>
                <CardContent>
                  <Box
                    component="ul"
                    sx={{
                      color: "error.main",
                    }}
                  >
                    {(formik.errors.title ||
                      formik.errors.description ||
                      formik.errors.price ||
                      formik.errors.city ||
                      formik.errors.district ||
                      formik.errors.neighborhood) && (
                      <li>Genel Bilgiler kısmında eksik alanlar var.</li>
                    )}
                    {formik.errors.images && (
                      <li>İlanınızın resmi yok veya resim limitini aştınız.</li>
                    )}
                    {(formik.errors.category || !!!formik?.values?.category) && (
                      <li>Uygun bir kategori seçin.</li>
                    )}
                    {(formik.errors.inputs || formik.errors.options) && (
                      <li>İlan Özellikleri kısmında eksik alanlar var.</li>
                    )}
                  </Box>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        )}
        {formik.isValid && formik.values.category && (
          <Grid item xs={12}>
            <Card sx={{ height: 1 }}>
              <CardContent>
                <FormSectionHeader>ÖNİZLEME</FormSectionHeader>
              </CardContent>
              <Divider />
              <Box>
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    justifyContent={{ xs: "center", lg: "space-between" }}
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={8} lg={4}>
                      {preview && <AdvertCard advert={preview} />}
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          columnGap: 1,
                          color: "primary.main",
                        }}
                      >
                        <EmojiEventsIcon />

                        <Typography sx={{ typography: "h6" }}>
                          İlanınızı Öne Çıkartın
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "noWrap",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="success"
                              name="payment.1"
                              checked={
                                formik.values.payment &&
                                formik.values.payment[1] == vipPlan.id
                              }
                              onChange={(ev) =>
                                formik.setFieldValue(
                                  "payment.1",
                                  ev.target.checked ? vipPlan.id : undefined
                                )
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          }
                          label={`VIP İlan (${tryFormatter.format(
                            vipPlan.price
                          )})`}
                        />
                        <Tooltip
                          title="VIP ilanlar listeleme sayfasında ve anasayfa vitrininde en önde görünür."
                          arrow
                          open={vipDescription}
                        >
                          <Button
                            onMouseEnter={(ev) => setVipDescription(true)}
                            onMouseLeave={(ev) => setVipDescription(false)}
                            onClick={(ev) => setVipDescription((o) => !!!o)}
                            color="success"
                          >
                            <HelpIcon />
                          </Button>
                        </Tooltip>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "noWrap",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="success"
                              name="payment.1"
                              checked={
                                formik.values.payment &&
                                formik.values.payment[2] == showcasePlan.id
                              }
                              onChange={(ev) =>
                                formik.setFieldValue(
                                  "payment.2",
                                  ev.target.checked
                                    ? showcasePlan.id
                                    : undefined
                                )
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          }
                          label={`Vitrinde göster (${tryFormatter.format(
                            showcasePlan.price
                          )})`}
                        />
                        <Tooltip
                          title="İlanınız anasayfada bulunan vitrinde görünür."
                          arrow
                          open={showcaseDescription}
                        >
                          <Button
                            onMouseEnter={(ev) => setShowcaseDescription(true)}
                            onMouseLeave={(ev) => setShowcaseDescription(false)}
                            onClick={(ev) =>
                              setShowcaseDescription((o) => !!!o)
                            }
                            color="success"
                          >
                            <HelpIcon />
                          </Button>
                        </Tooltip>
                      </Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="success"
                            name="payment.0"
                            checked={
                              formik.values.payment &&
                              formik.values.payment[0] == infinteImagePlan.id
                            }
                            onChange={(ev) =>
                              formik.setFieldValue(
                                "payment.0",
                                ev.target.checked
                                  ? infinteImagePlan.id
                                  : undefined
                              )
                            }
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        }
                        label={`Sınırsız resim ekleme (${tryFormatter.format(
                          infinteImagePlan.price
                        )})`}
                      />
                      {formik.isSubmitting && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box sx={{ width: "100%", mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={uploadProgress}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >{`%${Math.round(uploadProgress)}`}</Typography>
                          </Box>
                        </Box>
                      )}
                      <BlockButton
                        disabled={!formik.isValid || formik.isSubmitting}
                        color="primary"
                        type="submit"
                        sx={{ maxWidth: 1, my: 2, alignSelf: "flex-end" }}
                      >
                        {formik.isSubmitting && "RESİMLER YÜKLENİYOR..."}
                        {!formik.isSubmitting &&
                          "İLANI OLUŞTUR" +
                            (totalPrice > 0
                              ? ` VE ${tryFormatter.format(totalPrice)} ÖDE`
                              : "")}
                      </BlockButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

const FormSectionHeader = styled(Typography)(
  experimental_sx({ typography: "h6" })
);
