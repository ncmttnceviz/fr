import CategoryModel from "@/models/category-model";
import { handleCategoryModal} from "@/store/category-tree";
import {
    FormControl,
    InputLabel
} from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import SolidInput from "./solid-input";
export default function CategoryInput({ category }: { category?: CategoryModel}) {
    const dispatch = useDispatch();
    const ancestorName = useMemo(() => {
        if (category?.ancestors?.length) {
            return category.ancestors[category.ancestors?.length - 1].title;
        }
        return null;
    }, [category]);
    const value = useMemo(() => {
        if (ancestorName) {
            return `${ancestorName} -> ${category?.title}`
        }
        return category?.title || "Tüm İlanlar";
    }, [category, ancestorName])
    const htmlFor = `filter-data-category`;

    return (
        <FormControl
            onClick={() => dispatch(handleCategoryModal(true))}
            variant="standard"
            color="secondary"
            fullWidth
            sx={{
                cursor: 'pointer',
                label: {
                    color: "black !important",
                },
                'input': {
                    cursor: 'pointer'
                }
            }}
        >
            <InputLabel
                shrink
                htmlFor={htmlFor}
                sx={{ fontSize: 16, fontWeight: 600, color: "black" }}
            >
                Kategori
            </InputLabel>

            <SolidInput
                value={value}
                readOnly
                fullWidth
                color="secondary"
                id={htmlFor}
            />
        </FormControl>
    );
}