import CategoryModel from "@/models/category-model";
import { CityModel } from "@/models/location-models";
import { FilterValueModel, OptionModel, SortModel } from "@/models/option-models";
import { AppDispatch } from "@/store";
import { initializeTree } from "@/store/category-tree";
import { setFilterValue, setOptions, setSortingType } from "@/store/filter";
import { fetchDistricts, fetchNeighborhoods, initializeCities } from "@/store/location";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useSetupInitialFilter(categoryTree: CategoryModel[],
    options: OptionModel[],
    cities: CityModel[],
    defaultFilterValues?: FilterValueModel[], 
    defaultSort?: SortModel) {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        dispatch(initializeTree(categoryTree));
        dispatch(initializeCities(cities));
        dispatch(setOptions(options));
        if (defaultSort) {
            dispatch(setSortingType(defaultSort));
        }
        options.forEach(option => {
            const optionId = (option.special ? option.type : option.id);
            const dfv = defaultFilterValues ? defaultFilterValues.find(o => o.optionId == optionId) : undefined;
            if (dfv) {
                if (optionId == 'city' && dfv.value) {
                    dispatch(fetchDistricts(parseInt(dfv.value)))
                }
                else if (optionId == 'district' && dfv.value) {
                    dfv.value.split(",").forEach(o => {
                        if (!Number.isNaN(o)) {
                            dispatch(fetchNeighborhoods(parseInt(o)))
                        }
                    })
                }
                dispatch(setFilterValue({ option, value: "" + dfv.value, initial: true }))
            }
        })
    }, [router.query]);
}