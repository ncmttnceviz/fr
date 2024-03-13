import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance) {
    const res = await axios.post("/account/send_verification_email",{},{});
    return res.data.data as any;
}