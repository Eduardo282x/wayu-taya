import { Login } from "@/pages/auth/login/login.data";
import { postDataApi } from "@/services/api"

const peopleUrl = "/auth";

export const getPeople = async (auth: Login) => {
    return await postDataApi(peopleUrl, auth)
}
