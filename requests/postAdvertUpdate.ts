

import { UpdateAdvertFormModel } from "@/models/advert-model";
import { AxiosInstance } from "axios";

export default async function (axios: AxiosInstance, form: Partial<UpdateAdvertFormModel> & {
    id: string
}, onUploadProgress?: (event: ProgressEvent) => void) {
    const fd = new FormData();
    fd.append('id', form.id);
    ['title', 'description', 'price', 'cover_photo','latitude','longitude'].forEach(key => {
        const val: any = (form as any)[key];
        fd.append(key, val);
    })
    fd.append('city_id',form.city?.id+"");
    fd.append('district_id',form.district?.id+"");
    fd.append('neighborhood_id',form.neighborhood?.id+"");
    if (form.attributes) {
        let i = 0;
        form.attributes.forEach(attr => {
            if (attr) {
                fd.append(`attributes[${i}][attributeId]`, attr.attributeId + "")
                fd.append(`attributes[${i}][valueId]`, attr.valueId + "")
                i++;
            }
        })
    }
    if (form.inputs) {
        let i = 0;
        form.inputs.forEach(attr => {
            if (attr) {
                fd.append(`inputs[${i}][optionId]`, attr.optionId + "")
                fd.append(`inputs[${i}][valueId]`, attr.valueId + "")
                i++;
            }
        })
    }
    if (form.options) {
        let i = 0;
        form.options.forEach(attr => {
            if (attr) {

                fd.append(`options[${i}][optionId]`, attr.optionId + "")
                fd.append(`options[${i}][valueId]`, attr.valueId + "")
                i++;
            }
        })
    }
    if (form.images) {
        let i = 0;
        form.images.forEach((image: any) => {
            if (image) {
                const kn = (n: any = "") => `images[${i}]${n}`;
                if (image?.image_id) {
                    fd.append(kn('[image_id]'), image.image_id + "")
                }
                else {
                    fd.append(kn('[image]'), image.file);
                }
                fd.append(kn('[sort]'), i + "")
                i++;
            }
        })
    }
    if (form.deleted_images) {
        let i = 0;
        form.deleted_images.forEach(image => {
            if (image) {
                fd.append(`deleted_images[${i}]`, image)
                i++;
            }
        })
    }
    const res = await axios.post("/member_ads/update", fd, {
        onUploadProgress
    });
    return res.data.data as {
        status: "ok",
        advert_id: number,
    }
}