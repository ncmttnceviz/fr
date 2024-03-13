import { ListingAdvertModel } from "@/models/advert-model";
import CategoryModel from "@/models/category-model";
import { OptionModel } from "@/models/option-models";
import { PaginationModel } from "@/models/pagination-model";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,slug: string,queryParams:any) {
    let url ="/categories";
    if(slug) {
        url+="/"+slug;
    }
    const res = await axios.post(url,{
    },{
        params: queryParams
    });
    const options: OptionModel[] = res.data.data.options as OptionModel[];
    const paginatedData: PaginationModel<ListingAdvertModel> = res.data.data as PaginationModel<ListingAdvertModel>;
    let category: CategoryModel = res.data.data.category as CategoryModel;
    if(!category) {
        category = {title: 'Tüm İlanlar'} as CategoryModel;
    }
    const categoryAncestors: CategoryModel[] = res.data.data.category_tree as CategoryModel[];
    return{options,paginatedData,category,categoryAncestors};

}