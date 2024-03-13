import { CorporateModel } from "@/models/auth-models";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,id:string ) {
    const res = await axios.get("/company/"+id,{});
    return res.data.data as CorporateModel;
}