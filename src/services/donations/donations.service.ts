import { getDataApi, getDataFileApi, postDataApi, putDataApi } from "../api.service";
import { DonationBody, GroupDonations, IDonations } from "./donations.interface";

const donationsUrl = "/donations";

export const getDonations = async (): Promise<GroupDonations> => {
    const response = await getDataApi<GroupDonations>(donationsUrl);
    if (response.data == null) {
        return { allDonations: [], donations: [] }
    }
    return response.data;
}

export const getLotes = async (): Promise<string[]> => {
    const response = await getDataApi<string[]>(`${donationsUrl}/lotes`);
    if (response.data == null) {
        return []
    }
    return response.data;
}

export const getDonationsReport = (id: number) => {
    return getDataFileApi(`${donationsUrl}/download/${id}`);
}

export const postDonation = async (data: DonationBody): Promise<IDonations | null> => {
    const response = await postDataApi<DonationBody, IDonations>(donationsUrl, data);
    return response.data;
}

export const putDonation = async (id: number, data: DonationBody): Promise<IDonations | null> => {
    const response = await putDataApi<DonationBody, IDonations>(`${donationsUrl}/${id}`, data);
    return response.data;
}
