import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,id: string,status: boolean) {
    const res = await axios.post("/member_ads/change_publish_status",{},{params: {id, status: status ? 1: 0}});
    return res.data.data.token as string;
}