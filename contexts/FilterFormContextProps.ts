import CategoryModel from "@/models/category-model";
import { CityModel } from "@/models/location-models";
import { OptionModel } from "@/models/option-models";

export default interface FilterFormContextProps {
    categoryTree: CategoryModel[];
    category: CategoryModel;
    categoryAncestors: CategoryModel[];
    options: OptionModel[];
    cities: CityModel[];
}