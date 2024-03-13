import { ListingAdvertModel } from "@/models/advert-model";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance) {
    const res = await axios.get("/member_favorites");
    return res.data.data as ListingAdvertModel[];
}