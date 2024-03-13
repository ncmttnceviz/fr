import { RootState } from "@/store";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/system";
import CategoryModel from "@/models/category-model";
import { useDispatch } from "react-redux";
import { setDynamicCategory } from "@/store/category-tree";
import { useFormik } from "formik";
import {
  selectOption,
  selectFilterValue,
  setFilterValue,
} from "@/store/filter";
import { OptionModel } from "@/models/option-models";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useRouter } from "next/router";
export default function QuickSearchForm() {
  const filterQuery = useFilterQuery();
  const router = useRouter();
  const category = useSelector(
    (state: RootState) => state.categoryTree.category
  );
  const formik = useFormik({
    initialValues: {},
    async onSubmit() {
      formik.setSubmitting(true);
      try {
        await router.push({
          pathname: "/ilanlar/[[...slug]]",
          query: { ...filterQuery, slug: category?.slug?.split("/") || [] },
        });
      } catch {
      } finally {
        formik.setSubmitting(false);
      }
    },
  });
  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <QuickSearchCategorySelect />
        <QuickSearchInput submitting={formik.isSubmitting}/>
      </form>
    </Box>
  );
}

const QuickSearchInput = ({submitting}: {submitting: boolean}) => {
  const option = useSelector(selectOption("search")) as OptionModel;
  const dispatch = useDispatch();
  const filterValue = useSelector(selectFilterValue(option));
  const value = useMemo(() => filterValue?.value, [filterValue]);
  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    let value = ev.target.value || "";
    dispatch(
      setFilterValue({
        option,
        value,
      })
    );
  };
  return (
    <TextField
      sx={[
        {
          width: { xs: 1, sm: "100vw" },
          margin: "0 auto",
          maxWidth: { xs: "unset", sm: 540, md: 880 },
          ".MuiInputBase-root": {
            bgcolor: "white",
            borderRadius: 8,
          },
          input: {
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
            "&::placeholder": {
              opacity: 0.9,
            },
          },
        },
      ]}
      fullWidth
      label=""
      placeholder="İlan Adı veya İlan Kodu yazın"
      value={value || ""}
      onChange={onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton color="primary" type="submit" disabled={submitting}>
              <SearchIcon fontSize="large" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      size="medium"
      variant="outlined"
    />
  );
};

function QuickSearchCategorySelect() {
  const categories = useSelector(
    (state: RootState) => state.categoryTree.categories
  );
  const category = useSelector(
    (state: RootState) => state.categoryTree.category
  );
  const dispatch = useDispatch();
  const categoriesWithAll = useMemo(() => {
    return [{ title: "Tüm İlanlar" } as CategoryModel, ...categories];
  }, [categories]);

  const isActive = useCallback(
    (cat: CategoryModel) => {
      return category?.slug == cat.slug;
    },
    [category]
  );
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: {xs: 'center',md: 'start'},
      }}
    >
      {categoriesWithAll.map((category) => (
        <Box
          onClick={() =>
            dispatch(
              setDynamicCategory({
                category: category?.slug ? category : undefined,
              })
            )
          }
          key={category.slug || category.title}
          sx={[
            {
              cursor: "pointer",
              py: 1.5,
              px: 2,
              bgcolor: "white",
              color: "black",
              minWidth: "120px",
              borderRadius: 3,
              fontSize: "0.92rem",
              fontWeight: 600,
              textAlign: "center",
              mb: 2.5,
              position: "relative",
              "@media(max-width: 450px)": {
                px: 1,
                minWidth: "80px",
              },
              "@media(max-width: 330px)": {
                minWidth: "70px",
                fontSize: ".8rem",
              },
            },
            isActive(category) && {
              bgcolor: "secondary.main",
              color: "white",
              "&:after": {
                border: "1px solid rgba(51, 51, 51, 0.19);",
                position: "absolute",
                content: "''",
                borderColor: (theme) =>
                  `${theme.palette.secondary.main} transparent`,
                borderWidth: "12px 13px 0 13px",
                bottom: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
              },
            },
          ]}
        >
          {category.title}
        </Box>
      ))}
    </Box>
  );
}
