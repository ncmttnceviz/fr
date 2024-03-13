import { UserModel } from "@/models/auth-models";
export default interface AuthContextProps {
    user?: UserModel,
}