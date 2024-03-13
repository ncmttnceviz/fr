import { CategoryDetailModel } from "@/models/category-model";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,id: string) {
    let url ="/member_ads/category/"+id;
    const res = await axios.get(url,{maxRedirects: 0});
    return res.data.data as CategoryDetailModel;

}