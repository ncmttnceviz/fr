import { ListingAdvertModel } from "@/models/advert-model";
import { PaginationModel } from "@/models/pagination-model";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,id: string,queryParams:{
    page: number,
    per_page: number,
}) {
    const res = await axios.get("/company/"+id+"/adverts",{params: {...queryParams}});
    return res.data.data as PaginationModel<ListingAdvertModel>;
}