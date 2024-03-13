import { RootState } from "@/store";
import filter, {
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
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import SolidInput from "../solid-input";

export default function FilterRangeInput({ optionId, placeholder }: { optionId: string, placeholder?: string }) {
    const option = useSelector(selectOption(optionId));

    const dispatch = useDispatch();
    if (option === undefined) {
        return null;
    }
    const filterValue = useSelector(selectFilterValue(option));
    const htmlFor = `filterData${optionId}`;

    const minValue = useMemo(
        () => {
            if (filterValue?.value?.length) {
                return filterValue.value.split(',')[0];
            }
            return "";
        },
        [filterValue]
    );
    const maxValue = useMemo(
        () => {
            if (filterValue?.value?.length) {
                return filterValue.value.split(',')[1];
            }
            return "";
        },
        [filterValue]
    );
    const handleChangeEvent = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, doAfter: (val: string) => void) => {
        const val = event.target.value;
        if (!val) {
            doAfter("");
            return;
        }
        else if (!Number.isNaN(Number(val))) {
            const value = parseInt(val);
            if (value > 0 && value < 9999999999) {
                doAfter(value + "");
            }
        }

        else {
            event.preventDefault();
        }
    }

    const doAfter = (index:number) => (newVal: string) => {
        let val = filterValue?.value ? filterValue.value : ",";
        const vals = val.split(',');
        vals[index] = newVal
        val = vals.join(",");
        if (val == ",") {
            val = "";
        }
        dispatch(
            setFilterValue({
                option,
                value: val
            }
            ))
    }

    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl
                variant="standard"
                color="secondary"
                fullWidth
                sx={{
                    label: {
                        color: "black !important",
                    },
                }}
            >
                <InputLabel
                    shrink
                    htmlFor={htmlFor}
                    sx={{ fontSize: 16, fontWeight: 600, color: "black" }}
                >
                    {option.title} Min
                </InputLabel>
                <SolidInput
                    value={minValue}
                    fullWidth
                    color="secondary"
                    placeholder={placeholder}
                    onChange={(ev) => handleChangeEvent(ev, doAfter(0))}
                    id={htmlFor + "Min"}
                />
            </FormControl>
            <FormControl
                variant="standard"
                color="secondary"
                fullWidth
                sx={{
                    label: {
                        color: "black !important",
                    },
                }}
            >
                <InputLabel
                    shrink
                    htmlFor={htmlFor}
                    sx={{ fontSize: 16, fontWeight: 600, color: "black" }}
                >
                    {option.title} Max
                </InputLabel>
                <SolidInput
                    value={maxValue}
                    fullWidth
                    color="secondary"
                    placeholder={placeholder}
                    onChange={(ev) => handleChangeEvent(ev,  doAfter(1))}
                    id={htmlFor + "Max"}
                />
            </FormControl>
        </Box>

    );
}