import { NeighborhoodModel } from "@/models/location-models";
import { RootState, useAppDispatch } from "@/store";
import filter, {
    selectFilterValue,
    selectOption,
    setFilterValue,
} from "@/store/filter";
import { fetchNeighborhoods } from "@/store/location";
import {
    alpha,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete'
import { SyntheticEvent, useMemo } from "react";
import { useSelector } from "react-redux";
import SolidInput from "../solid-input";
import SolidInputAutocomplete from "../solid-input-autocomplete";

export default function FilterNeighborhoodInput({ optionId }: { optionId: string }) {
    const option = useSelector(selectOption(optionId));

    const dispatch = useAppDispatch();
    if (option === undefined) {
        return null;
    }
    const htmlFor = `filter-data-${option.type}`;
    const filterValue = useSelector(selectFilterValue(option))

    const districtValue = useSelector((state: RootState) => state.filter.filterValues.find(o => o.optionId == 'district'));
    const districtArray = useMemo(() => districtValue?.value ? districtValue?.value.split(',') : [], [districtValue])
    const neighboroods = useSelector((state: RootState) => state.location.neighborhoods.filter(o => {
        if (districtValue?.value !== undefined && districtValue?.value.length) {
            return districtArray.includes(o.district_id + "");
        }

        return false;
    }));
    const value = useMemo(() => {
        if (filterValue?.value?.length) {
            return neighboroods.filter(o => o.id && filterValue.value && filterValue.value.split(',').includes(o.id + ""));
        }
        return []
    }, [filterValue,neighboroods]);
    const onChange = (event: SyntheticEvent<Element, Event>, value: NeighborhoodModel[], reason: string) => {
        dispatch(
            setFilterValue({
                option,
                value: value.map(o => o.id).join(','),
            }))

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
                getOptionLabel={(option: NeighborhoodModel) => option.title || ""}
                isOptionEqualToValue={(option, value) => option.id == value.id}
                getOptionDisabled={(option) => option.is_parent}
                onChange={onChange}
                disableCloseOnSelect
                limitTags={2}
                filterSelectedOptions
                disabled={!!!neighboroods.length}
                options={neighboroods}
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