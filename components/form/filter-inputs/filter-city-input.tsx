import { CityModel } from "@/models/location-models";
import { RootState, useAppDispatch } from "@/store";
import {
    selectFilterValue,
    selectOption,
    setFilterValue,
} from "@/store/filter";
import { fetchDistricts } from "@/store/location";
import {
    alpha,
    Autocomplete,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import SolidInput from "../solid-input";
import SolidInputAutocomplete from "../solid-input-autocomplete";

export default function FilterCityInput({ optionId }: { optionId: string }) {
    const option = useSelector(selectOption(optionId));
    const cities = useSelector((state: RootState) => state.location.cities);
    const dispatch = useAppDispatch();
    if (option === undefined || cities?.length === 0) {
        return null;
    }

    const htmlFor = `filter-data-${option.id}`;
    const filterValue = useSelector(selectFilterValue(option));
    const value = useMemo(() => {
        if (filterValue?.value?.length) {
            return cities.find(o => o.id && filterValue.value && o.id+"" == filterValue?.value);
        }
        return undefined;
    }, [filterValue]);

    const onChange = (event: SyntheticEvent<Element, Event>, value: CityModel|null, reason: string) => {
        dispatch(
            setFilterValue({
                option,
                value: value ? ""+value.id : ""
            }))
            
                if(value && value.id) {
                    
                        dispatch(fetchDistricts(value.id));
                    
                }
            

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
    

            <Autocomplete
                color="secondary"
                value={value || null}
              
                getOptionLabel={(option: CityModel) => option.title?.trim() || ""}
                isOptionEqualToValue={(option, value) => option?.id == value?.id}
                onChange={onChange}
               
                disabled={!!!cities.length}
                options={cities}
                noOptionsText="Sonuç Yok"


                renderInput={(params: any) =>
                    <SolidInputAutocomplete
                        {...params}
                        variant="standard"
                        fullWidth
                        color="secondary"
                 
                        id={htmlFor}
                    />
                }
            />
        </FormControl>
    );
}