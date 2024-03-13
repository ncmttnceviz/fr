import { PaymentInfoModel } from "@/models/payment-models";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,id: string) {
    let url ="/payment/order/"+id;
    const res = await axios.get(url,{maxRedirects: 0});
    return res.data.data as PaymentInfoModel;

}