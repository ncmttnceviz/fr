import { OptionModel } from "@/models/option-models";
import FilterCityInput from "./filter-inputs/filter-city-input";
import FilterDistrictInput from "./filter-inputs/filter-district-input";
import FilterNeighborhoodInput from "./filter-inputs/filter-neighborhood-input";
import FilterRangeInput from "./filter-inputs/filter-range-input";
import FilterSelectInput from "./filter-inputs/filter-select-input";
import FilterTextInput from "./filter-inputs/filter-text-input";

export default function FilterForm({ options }: { options: OptionModel[] }) {

  return (
    <>
      {options.map(option => {
        switch (option.type) {
          case 'checkbox':
          case 'select':
            return <FilterSelectInput key={option.id} optionId={"" + option.id} />
          case 'input':
            return <FilterTextInput key={option.type} optionId={""+option.id} />
          case 'range':
            return <FilterRangeInput key={option.id} optionId={"" + option.id} />
          case 'search':
            return <FilterTextInput key={option.type} optionId={option.type} />
          case 'price':
            return <FilterRangeInput key={option.type} optionId={option.type} />
          case 'city':
            return <FilterCityInput key={option.type} optionId={option.type} />
          case 'district':
            return <FilterDistrictInput key={option.type} optionId={option.type} />
          case 'neighborhood':
            return <FilterNeighborhoodInput key={option.type} optionId={option.type} />

          default:
            return null;
        }
      }
      )}
    </>
  )
}