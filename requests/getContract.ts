import PolicyModel from "@/models/policy-model";
import { AxiosInstance } from "axios";

export default async function (axios: AxiosInstance, key: "cookieContract" | "privacyContract" | "distanceSellingContract" | "membershipContract" | "kvkkContract") {
    const res = await axios.get("/contracts/" + key);
    return res.data.data as PolicyModel;
}