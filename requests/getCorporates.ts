
import { CorporateModel } from "@/models/auth-models";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance) {
    const res = await axios.get("/homepage/companies");
    return res.data?.data as CorporateModel[];
}