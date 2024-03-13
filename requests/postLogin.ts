import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,email: string,password: string) {
    const res = await axios.post("/auth/login",{},{params: {email,password}});
    return res.data.data.token as string;
}