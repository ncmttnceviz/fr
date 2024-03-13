import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,email: string) {
    const res = await axios.post("/account/forgot_password",{},{params: {email}});
    return res.data.data.token as string;
}