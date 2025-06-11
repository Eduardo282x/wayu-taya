import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api"
import { PeopleBody } from "./people.interface";

const peopleUrl = "/people";

export const getPeople = async () => {
    return await getDataApi(peopleUrl);
}
export const postPeopleNormal = async (data: PeopleBody) => {
    return await postDataApi(`${peopleUrl}/normal`, data)
}
export const postPeople = async (data: PeopleBody) => {
    return await postDataApi(peopleUrl, data)
}
export const putPeopleNormal = async (id: number, data: PeopleBody) => {
    return await putDataApi(`${peopleUrl}/normal/${id}`, data)
}
export const putPeople = async (id: number, data: PeopleBody) => {
    return await putDataApi(`${peopleUrl}/${id}`, data)
}
export const deletePeople = async (id: number) => {
    return await deleteDataApi(`${peopleUrl}/${id}`)
}
