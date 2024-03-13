import { DetailAdvertModel } from "@/models/advert-model";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,slug: string,queryParams:any) {
    const res = await axios.get("/ads/"+slug,{params: {...queryParams}});
    return res.data.data as DetailAdvertModel;
}