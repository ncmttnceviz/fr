import { RegisterFormModel } from "@/models/auth-models";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,form: Partial<RegisterFormModel>) {
    const a: any = {...form};
    if(a.iaa !== undefined) {
        a.iaa = a.iaa ? 1 : 0;
    }
    if(a.caa !== undefined) {
        a.caa = a.caa ? 1 : 0;
    }
    const res = await axios.post("/auth/register",{},{params: {...a}});
    return res.data.data as {token: string};
}