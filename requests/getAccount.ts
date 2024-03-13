
import { UserModel } from "@/models/auth-models";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance) {
    const res = await axios.get("/account");
    return res.data?.data as UserModel;
}