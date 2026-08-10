import { Login } from "@/pages/auth/login/login.data";
import { postDataApi } from "../api.service"
import { BodyRecoverPassword, LoginResponse } from "./auth.interfaces"
import { BaseResponse } from "../base.interface";

const authUrl = "/auth";

export const authLogin = async (auth: Login): Promise<BaseResponse<LoginResponse> | null>=> {
    try {
        return await postDataApi(`${authUrl}/login`, auth);
    } catch (error) {
        console.log(error)
        return null
    }
}

export const recoverPasswordLogin = async (password: BodyRecoverPassword) => {
    return await postDataApi(`${authUrl}/recover`, password)
}