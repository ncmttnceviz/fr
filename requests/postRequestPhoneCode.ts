import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,phone: string) {
    const res = await axios.post("/account/send_verification_phone/"+phone,{},{});
    return res.data.data as any;
}