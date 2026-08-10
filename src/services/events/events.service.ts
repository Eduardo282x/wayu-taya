import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api.service"
import { EventsBody, GroupEvents, IEvents } from "./events.interface";

const eventsUrl = "/events";

export const getEvents = async (): Promise<GroupEvents> => {
    const response = await getDataApi<GroupEvents>(`${eventsUrl}/fixed`);
    if (response.data == null) {
        return { allEvents: [], events: [] }
    }
    return response.data;
}

export const postEvents = async (data: EventsBody): Promise<IEvents | null> => {
    const response = await postDataApi<EventsBody, IEvents>(eventsUrl, data);
    return response.data;
}

export const putEvents = async (id: number, data: EventsBody): Promise<IEvents | null> => {
    const response = await putDataApi<EventsBody, IEvents>(`${eventsUrl}/${id}`, data);
    return response.data;
}

export const deleteEvents = async (id: number): Promise<IEvents | null> => {
    const response = await deleteDataApi<IEvents>(`${eventsUrl}/${id}`);
    return response.data;
}
