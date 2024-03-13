

import { NewAdvertFormModel } from "@/models/advert-model";
import { CategoryDetailModel } from "@/models/category-model";
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,form: Partial<NewAdvertFormModel & {
    category: CategoryDetailModel,
    payment: number[],
}>,onUploadProgress?: ( event: ProgressEvent) => void ) {
    const fd = new FormData();
    ['title','description','price','longitude','latitude','cover_photo'].forEach(key => {
        const val: any = (form as any)[key];
        fd.append(key,val);
    })
    fd.append('category_id',form.category?.id+"");
    fd.append('city_id',form.city?.id+"");
    fd.append('district_id',form.district?.id+"");
    fd.append('neighborhood_id',form.neighborhood?.id+"");
    if(form.attributes) {
        let i = 0;
        form.attributes.forEach(attr => {
            if(attr) {
                fd.append(`attributes[${i}][attributeId]`,attr.attributeId+"")
                fd.append(`attributes[${i}][valueId]`,attr.valueId+"")
                i++;
            }
        })
    }
    if(form.inputs) {
        let i = 0;
        form.inputs.forEach(attr => {
            if(attr) {
                fd.append(`inputs[${i}][optionId]`,attr.optionId+"")
                fd.append(`inputs[${i}][valueId]`,attr.valueId+"")
                i++;
            }
        })
    }
    if(form.options) {
        let i = 0;
        form.options.forEach(attr => {
            if(attr) {

                fd.append(`options[${i}][optionId]`,attr.optionId+"")
                fd.append(`options[${i}][valueId]`,attr.valueId+"")
                i++;
            }
        })
    }
    if(form.images) {
        let i = 0;
        form.images.forEach(image => {
            if(image) {
                fd.append(`images[${i}]`,image.file)
                i++;
            }
        })
    }
    if(form.payment) {
        let i = 0;
        form.payment.forEach(plan => {
            if(plan) {

                fd.append(`payment[${i}]`,plan+"")
                i++;
            }
        })
    }

    const res = await axios.post("/member_ads",fd,{
        onUploadProgress
    });
    return res.data.data as {
        status: "ok",
        message: string,
        advert_id: number,
        required_payment: boolean
    }
}