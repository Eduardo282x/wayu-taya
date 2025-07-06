import { Login } from "@/pages/auth/login/login.data";
import { postDataApi } from "../api"
import { BodyRecoverPassword } from "./auth.interfaces"

const authUrl = "/auth";

export const authLogin = async (auth: Login) => {
    return await postDataApi(authUrl, auth)
}

export const recoverPasswordLogin = async (password: BodyRecoverPassword) => {
    return await postDataApi(`${authUrl}/recover`, password)
}