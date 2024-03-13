import { AxiosInstance } from "axios";

export default async function (
  axios: AxiosInstance,
  values: {
    email: string;
    code: string;
    password: string;
    password_confirmation: string;
  }
) {
  const res = await axios.post(
    "/account/reset_password",
    {},
    { params: { ...values } }
  );
  return res.data.data.token as string;
}
