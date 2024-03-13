import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,id: string) {
    const res = await axios.delete(`/member_ads/${id}`,{});
    return res.data.data as any;
}