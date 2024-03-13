import { UserModel } from "@/models/auth-models";
import getAccount from "@/requests/getAccount";
import { AxiosInstance } from "axios";
import { removeCookies } from "cookies-next";
import { GetServerSideProps, GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import makeAxios from "./makeAxios";
type AddArgument<
    Fn extends (...args: any[]) => any,
    NextArg
    > =
    Fn extends (...arg: [...infer PrevArg]) => infer Return
    ? (...args: [...PrevArg, NextArg]) => Return
    : never;
export type WithAuthGetServerSideProps = AddArgument<AddArgument<GetServerSideProps, UserModel | null>,AxiosInstance>;
export function withAuth(gssp: WithAuthGetServerSideProps, mustBeAuthenticated: boolean = false) {
    return async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {

        const token = context.req.cookies.token;
        let axios = makeAxios(token);
        let user = null;
        if (token) {

            try {
                user = await getAccount(axios)
                user.token = token;
            }
            catch (error: any) {
                if (error.response?.status === 401) {
                    removeCookies('token', { req: context.req, res: context.res });
                    if (mustBeAuthenticated) {
                        return {
                            redirect: {
                                permanent: false,
                                destination: '/?logout'
                                
                            }
                        };
                    }
                    else {
                        axios = makeAxios();
                    }
                }
            }
        }
        else if(mustBeAuthenticated){
            
                return {
                    redirect: {
                        permanent: false,
                        destination: '/'
                    }
                };
            
        }
        
        const gsspData = await gssp(context, user,axios) as any;
        return {
            ...gsspData,
            props: {
                ...gsspData.props,
                user
            }
        };
    }
}