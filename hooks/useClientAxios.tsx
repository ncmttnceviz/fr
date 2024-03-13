import makeAxios from "@/feature/makeAxios";
import { UserModel } from "@/models/auth-models";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function useClientAxios(user?: UserModel){
    const router = useRouter();
    const axios = useMemo(() =>{
        const a = makeAxios(user?.token ? user?.token : undefined);
         const interceptorId = a.interceptors.response.use((response) =>{
            return response;
            
        },(error: AxiosError) =>{
            if(error.response?.status === 401) {
                a.interceptors.response.eject(interceptorId);
                router.replace({pathname: '/'})
            }
            return Promise.reject(error);
        })
        return a;
    },[router.pathname,user]);
    return axios;


}