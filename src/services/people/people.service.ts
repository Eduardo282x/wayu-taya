import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api.service"
import { IPeople, PeopleBody, PeopleContent } from "./people.interface";

const peopleUrl = "/people";

export const getPeople = async (): Promise<PeopleContent> => {
    const response = await getDataApi<PeopleContent>(peopleUrl);
    if (response.data == null) {
        return { people: [] }
    }
    return response.data;
}

export const postPeopleNormal = async (data: PeopleBody): Promise<IPeople | null> => {
    const response = await postDataApi<PeopleBody, IPeople>(`${peopleUrl}/normal`, data);
    return response.data;
}

export const postPeople = async (data: PeopleBody): Promise<IPeople | null> => {
    const response = await postDataApi<PeopleBody, IPeople>(peopleUrl, data);
    return response.data;
}

export const putPeopleNormal = async (id: number, data: PeopleBody): Promise<IPeople | null> => {
    const response = await putDataApi<PeopleBody, IPeople>(`${peopleUrl}/normal/${id}`, data);
    return response.data;
}

export const putPeople = async (id: number, data: PeopleBody): Promise<IPeople | null> => {
    const response = await putDataApi<PeopleBody, IPeople>(`${peopleUrl}/${id}`, data);
    return response.data;
}

export const deletePeople = async (id: number): Promise<IPeople | null> => {
    const response = await deleteDataApi<IPeople>(`${peopleUrl}/${id}`);
    return response.data;
}
