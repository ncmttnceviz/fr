import { RootState } from "@/store";
import {
    selectFilterValue,
    selectOption,
    setFilterValue,
} from "@/store/filter";
import {
    alpha,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import SolidInput from "../solid-input";

export default function FilterSelectInput({ optionId }: { optionId: string }) {
    const option = useSelector(selectOption(optionId));

    const dispatch = useDispatch();
    if (option === undefined) {
        return null;
    }
    const filterValue = useSelector(selectFilterValue(option));
    const filterValues = useSelector((state: RootState) => state.filter.filterValues)
    const htmlFor = `filter-data-${option.id}`;
    const multiple = option.type === "checkbox";
    const value = useMemo(
        () =>
            multiple ? (filterValue?.value?.split(",")) || [] : filterValue?.value || "",
        [filterValues]
    );
    const onChange = (ev: SelectChangeEvent<string[] | string>) => {
        let value = ev.target.value;
        if (value instanceof Array<string>) {
            if (value.length) {
                const lastElem = value[value.length - 1];
                if (value.filter(o => o == lastElem).length > 1) {
                    value = value.filter(o => o != lastElem)
                }
            }
        }
        dispatch(
            setFilterValue({
                option,
                value: multiple
                    ? (typeof value === 'string' ? value.split(',') : value).join(",")
                    : (ev.target.value == filterValue?.value ? "" : ev.target.value + ""),
            })
        )
    }

    return (
        <FormControl
            variant="standard"
            color="secondary"
            fullWidth
            sx={{
                label: {
                    color: "black !important",
                },
                "MuiMenuItem-root.Mui-selected": {
                    bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                },
            }}
        >
            <InputLabel
                shrink
                htmlFor={htmlFor}
                sx={{ fontSize: 16, fontWeight: 600, color: "white" }}
            >
                {option.title}
            </InputLabel>
            <Select
                color="secondary"
                multiple={multiple}
                value={value}
                defaultValue={multiple ? [] : ""}
                onChange={onChange}

                input={
                    <SolidInput
                        fullWidth
                        color="secondary"
                        id={htmlFor}
                        placeholder={"Lütfen Seçin"}
                    />
                }
            >
                {option.values?.map((val) => (
                    <MenuItem key={val.id} color="secondary" value={val.id}>
                        {val.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}