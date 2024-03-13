import { ConfigurableAdvertModel } from "@/models/advert-model";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance) {
    const res = await axios.get("/member_ads");
    return res.data.data as ConfigurableAdvertModel;
}