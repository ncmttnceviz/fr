import useClientAxios from "@/hooks/useClientAxios";
import {
  ListingAdvertModel,
  UpdateAdvertFormModel,
  UpdateAdvertModel
} from "@/models/advert-model";
import { CategoryDetailModel } from "@/models/category-model";
import {
  CityModel,
  DistrictModel,
  NeighborhoodModel
} from "@/models/location-models";
import { AuthContext } from "@/pages/_app";
import getCities from "@/requests/getCities";
import postAdvertUpdate from "@/requests/postAdvertUpdate";
import { openInfoSnackbar } from "@/store/info-snackbar";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  experimental_sx,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid, InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  styled,
  TextField,
  TextFieldProps,
  Typography
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
  useState
} from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { tr } from "yup-locales";
import AdvertCard from "../image/advert-card";
import BlockButton from "./block-button";
import GoogleMapPicker from "./google-map-picker";
import ImageUpload, { ImageToBeUploaded, UploadedImage } from "./image-upload";
yup.setLocale(tr);
export default function UpdateAdvertForm({
  advert,
  category,
}: {
  advert: UpdateAdvertModel;
  category: CategoryDetailModel;
}) {
  const formProps: TextFieldProps = useMemo(
    () => ({
      size: "small",
      variant: "outlined",
      fullWidth: true,
    }),
    []
  );

  const [uploadProgress, setUploadProgress] = useState<number>(0);
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

  const [cities, setCities] = useState<CityModel[]>([]);
  const [districts, setDistricts] = useState<DistrictModel[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodModel[]>([]);

  const computeInitialValuesForAdvertMapping = useCallback(() => {
    const object: Partial<UpdateAdvertFormModel> = {
      attributes: [],
      options: [],
      inputs: [],
    };
    if (advert) {
      const fnMutate = (a: any, b: any, useIndex: boolean = false) => {
        a.forEach((o: any, index: number) => {
          if (b) {
            b[useIndex ? index : o.valueId] = o;
          }
        });
      };
      fnMutate(advert.attributes, object.attributes);
      fnMutate(advert.options, object.options, true);
      fnMutate(advert.inputs, object.inputs, true);
    }
    return object;
  }, [advert]);

  const initialValues: Partial<UpdateAdvertFormModel> = {
    title: advert.title,
    description: advert.description,
    price: advert.price,
    cover_photo: advert.images.findIndex((o) => o.isCover),
    images: [...advert.images],
    deleted_images: [],
    latitude: advert.latitude,
    longitude: advert.longitude,
    city: advert.city as any,
    district: advert.district as any,
    neighborhood: advert.neighborhood as any,
    ...computeInitialValuesForAdvertMapping(),
  };
  const formGridProps = { xs: 12 };

  const formik = useFormik({
    initialValues,
    onSubmit: async () => {
      formik.setSubmitting(true);
      try {
        const res = await postAdvertUpdate(
          axios,
          { ...formik.values, id: advert.id + "" },
          (event) => {
            setUploadProgress((event.loaded / event.total) * 100);
          }
        );
        setUploadProgress(0);
        formik.resetForm();

        await router.push({
          pathname: "/ilan/[slug]",
          query: { slug: advert.slug },
        });
        dispatch(
          openInfoSnackbar({
            message: "İlanınız başarı ile güncellendi.",
            severity: "success",
          })
        );
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
        .max(advert.extra_photo ? 200 : 20)
        .of(
          yup.object().shape({
            file: yup
              .mixed()
              .test("size", "Resim boyutu 8MB'dan küçük olmalıdır", (value) => {
                return (
                  value?.size === undefined || value.size <= 1024 * 1024 * 8
                );
              }),
          })
        ),
      deleted_images: yup
        .array()
        .label("Bu alan")
        .nullable()
        .of(yup.number().integer()),
      city: yup.object().label("Bu alan").required().nullable(),
      district: yup.object().label("Bu alan").required().nullable(),
      neighborhood: yup.object().label("Bu alan").required().nullable(),
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
            attributeId: yup.number().nullable(),
            valueId: yup.number().nullable().label("Bu alan"),
          })
          .nullable()
      ),
    }),
  });

  const preview = useMemo(() => {
    if (
      formik.values.images &&
      formik.values.cover_photo !== undefined &&
      formik.values.images[formik.values.cover_photo] &&
      ((formik.values.images[formik.values.cover_photo] as any).preview ||
        (formik.values.images[formik.values.cover_photo] as any).small) &&
      formik.values.city &&
      formik.values.district &&
      formik.values.neighborhood &&
      formik.values.title
    ) {
      const imageObject = formik.values.images[
        formik.values.cover_photo
      ] as any;
      const a = {
        title: formik.values.title,
        description: formik.values.description,
        price: formik.values.price,
        image: imageObject.preview || imageObject.small,
        is_vip: advert.is_vip,
        city: formik.values.city.title,
        district: formik.values.district.title,
        neighborhood: formik.values.neighborhood.title,
        category_title: category.title,
      } as ListingAdvertModel;
      return a;
    }
    return null;
  }, [
    advert,
    category,
    formik.values.title,
    formik.values.description,
    formik.values.price,
    formik.values.images,
    formik.values.cover_photo,
    formik.values.city,
    formik.values.district,
    formik.values.neighborhood,
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

  const handleImageDelete = (item: UploadedImage | ImageToBeUploaded) => {
    if ((item as any).image_id) {
      if (!formik.values.deleted_images?.includes((item as any).image_id)) {
        formik.setFieldValue("deleted_images", [
          ...(formik.values.deleted_images || []),
          (item as any).image_id,
        ]);
      }
    }
  };

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
  const onMapChange = (lat: number, lng: number) => {
    formik.setFieldValue("latitude", lat, true);
    formik.setFieldValue("longitude", lng, true);
  };
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
        if (districts.length > 0) {
          formik.setFieldValue("district", 0,true);
          formik.setTouched({district:true,neighborhood: true});

        }
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
        if (neighborhoods.length > 0) {
          formik.setFieldValue("neighborhood", 0,true);
          formik.setTouched({neighborhood: true})
        }
      }
    };
    fn();
  }, [formik.values.district]);
  return (
    <Box component={"form"} sx={{ my: 3 }} onSubmit={formik.handleSubmit}>
      <Grid
        container
        spacing={2}
        alignItems="stretch"
        justifyContent={"center"}
      >
        <Grid item xs={12} sm={12} md={6} lg={8}>
          <Card sx={{ height: 1 }}>
            <CardContent>
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
                    <ImageUpload
                      error={formik.errors.images}
                      selectable
                      sortable
                      initialImages={advert.images}
                      onDelete={handleImageDelete}
                      initialSelected={advert.images.find((o) => o.isCover)}
                      onChange={(items) =>
                        formik.setFieldValue("images", items, true)
                      }
                      onImageSelect={(item) =>
                        formik.setFieldValue(
                          "cover_photo",
                          item
                            ? Math.max(
                                formik.values.images?.indexOf(item) || 0,
                                0
                              )
                            : 0,
                          true
                        )
                      }
                    >
                      RESİM YÜKLE(
                      {`${advert.extra_photo ? "SINIRSIZ" : "Maks 20"}`})
                    </ImageUpload>
                  </Grid>
                </Grid>
              </CardContent>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: 1 }}>
            <CardContent>
              <FormSectionHeader>HARİTA KONUMU</FormSectionHeader>
            </CardContent>
            <Divider />
            <Box sx={scrollProps}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item {...formGridProps}>
                    <GoogleMapPicker
                      ref={mapHandler}
                      onChange={onMapChange}
                      startFrom={{
                        lat: advert.latitude,
                        lng: advert.longitude,
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ height: 1 }}>
            <CardContent>
              <FormSectionHeader>İLAN ÖZELLİKLERİ</FormSectionHeader>
            </CardContent>
            <Divider />
            <Box>
              <CardContent>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {category.options
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
                  {category.options
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

                {category &&
                  category.attributes.map((attr, attrKey) => (
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
        {formik.isValid && (
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
                    alignItems="flex-end"
                  >
                    <Grid item xs={12} sm={8} lg={4}>
                      {preview && <AdvertCard advert={preview} />}
                    </Grid>
                    <Grid item xs={12} lg={4}>
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
                        {!formik.isSubmitting && "İLANI GÜNCELLE"}
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
