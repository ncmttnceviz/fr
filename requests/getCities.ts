import { CityModel } from "@/models/location-models";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance) {
    const res = await axios.get("/cities");
    return res.data.data as CityModel[];

}