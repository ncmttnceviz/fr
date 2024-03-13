import CategoryModel from "@/models/category-model";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,slug?:string) {
    let url = "/tree";
    if(slug) {
        url+=`/${slug}`;
    }
    const res = await axios.get(url);
    return res.data.data as CategoryModel[];

}