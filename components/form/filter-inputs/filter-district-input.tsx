import { DistrictModel } from "@/models/location-models";
import { RootState, useAppDispatch } from "@/store";
import filter, {
    selectFilterValue,
    selectOption,
    setFilterValue,
} from "@/store/filter";
import { fetchNeighborhoods } from "@/store/location";
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
import { SyntheticEvent, useMemo } from "react";
import { useSelector } from "react-redux";
import SolidInput from "../solid-input";
import SolidInputAutocomplete from "../solid-input-autocomplete";

export default function FilterDistrictInput({ optionId }: { optionId: string }) {
    const option = useSelector(selectOption(optionId));

    const dispatch = useAppDispatch();
    if (option === undefined) {
        return null;
    }
    const htmlFor = `filter-data-${option.type}`;
    const filterValue = useSelector(selectFilterValue(option))

    const cityValue = useSelector((state: RootState) => state.filter.filterValues.find(o => o.optionId == 'city'));
    const districts = useSelector((state: RootState) => state.location.districts.filter(o => o.city_id == cityValue?.value));
    const value = useMemo(() => {
        if (filterValue?.value?.length) {
            return districts.filter(o => o.id && filterValue.value && filterValue.value.split(',').includes(o.id + ""));
        }
        return []
    }, [filterValue,districts]);
    const onChange = (event: SyntheticEvent<Element, Event>, value: DistrictModel[], reason: string) => {
        dispatch(
            setFilterValue({
                option,
                value: value.map(o => o.id).join(','),
            }))
        if (value.length) {
            const lastId = value[value.length - 1].id;
            if (lastId) {
                dispatch(fetchNeighborhoods(lastId))
            }
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
                value={value}
                multiple
                getOptionLabel={(option: DistrictModel) => option.title || ""}
                isOptionEqualToValue={(option, value) => option?.id == value?.id}
                onChange={onChange}
                disableCloseOnSelect
                limitTags={2}
                filterSelectedOptions
                disabled={!!!districts.length}
                options={districts}
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