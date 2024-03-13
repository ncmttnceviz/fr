import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,id: string) {
    const res = await axios.post("/member_favorites",{},{params: {ads_id: id}});
}