
import { AxiosInstance } from "axios";

export default async function(axios: AxiosInstance,form: {
    fullname: string,
    phone: string,
    whatsapp: string,
    image?: {file: File,preview: string}
},onUploadProgress?: ( event: ProgressEvent) => void ) {
    const fd = new FormData();
    fd.append("fullname",form.fullname);
    fd.append("phone",form.phone);
    fd.append("whatsapp",form.whatsapp);
    if(form.image) {
        fd.append(`image`,form.image.file)
    }

    const res = await axios.post("/account/update",fd,{
        onUploadProgress
    });
    return res.data.data as {
        status: "ok",
    }
}