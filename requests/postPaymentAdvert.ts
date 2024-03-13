


import { AdvertPaymentForm } from "@/models/payment-models";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,form: Partial<AdvertPaymentForm>,id: string) {
    const res = await axios.post("/payment",{adsId: id,...form,cardHolderName: form.name + " "+form.surname},{});
    return res.data.data as any;
}