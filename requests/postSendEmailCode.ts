import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,code: string) {
    const res = await axios.post("/account/verify_email",{},{params: {code}});
    return res.data.data as any;
}