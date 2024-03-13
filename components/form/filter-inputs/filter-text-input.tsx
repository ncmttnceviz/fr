import {
    selectFilterValue,
    selectOption,
    setFilterValue
} from "@/store/filter";
import {
    FormControl,
    InputLabel
} from "@mui/material";
import { ChangeEvent, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import SolidInput from "../solid-input";
export default function FilterTextInput({ optionId,placeholder }: { optionId: string,placeholder?:string }) {
    const option = useSelector(selectOption(optionId));
  
    const dispatch = useDispatch();
    if (option === undefined) {
      return null;
    }
    const filterValue = useSelector(selectFilterValue(option));
    const htmlFor = `filter-data-${optionId}`;
    const value = useMemo(
      () => filterValue?.value,
      [filterValue]
    );
    const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
      let value = ev.target.value ||"";
      dispatch(
          setFilterValue({
              option,
              value 
          }
      ))
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
        }}
      >
        <InputLabel
          shrink
          htmlFor={htmlFor}
          sx={{ fontSize: 16, fontWeight: 600, color: "black" }}
        >
          {option.title}
        </InputLabel>
        <SolidInput
          value={value || ""}
          fullWidth
          color="secondary"
          placeholder={placeholder}
          onChange={onChange}
          id={htmlFor}
        />
      </FormControl>
    );
  }