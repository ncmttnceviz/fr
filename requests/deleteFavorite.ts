import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,id: string) {
    const res = await axios.delete("/member_favorites/"+id,{});
}