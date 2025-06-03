import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api"
import { EventsBody } from "./events.interface";

const eventsUrl = "/events";

export const getEvents = async () => {
    return await getDataApi(eventsUrl);
}
export const postEvents = async (data: EventsBody) => {
    return await postDataApi(eventsUrl, data)
}
export const putEvents = async (id: number, data: EventsBody) => {
    return await putDataApi(`${eventsUrl}/${id}`, data)
}
export const deleteEvents = async (id: number) => {
    return await deleteDataApi(`${eventsUrl}/${id}`)
}
