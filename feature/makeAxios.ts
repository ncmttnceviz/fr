import axios, { HeadersDefaults } from "axios";

export default function(token?: string,) {
    const a =  axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1",
    })
    if(token) {
        a.defaults.headers = {
            Authorization: `Bearer ${token}`
        } as HeadersDefaults & {Authorization: string}
    }
    return a;
} 