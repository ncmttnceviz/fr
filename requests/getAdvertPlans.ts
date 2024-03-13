import { AdvertPlanModel } from "@/models/advert-model";
import { CategoryDetailModel } from "@/models/category-model";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance) {
    let url ="/ads_plans"
    const res = await axios.get(url,{maxRedirects: 0});
    return res.data.data as AdvertPlanModel[];

}