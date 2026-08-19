import { getDataApi, getDataFileApi, postDataApi, putDataApi } from "../api.service";
import { DonationBody, DonationsContent, IDonations, LotesContent } from "./donations.interface";
import { BaseResponse } from "../base.interface";

const donationsUrl = "/donations";

export const getDonations = async (): Promise<DonationsContent> => {
    const response = await getDataApi<DonationsContent>(donationsUrl);
    if (response.data == null) {
        return { donations: [] }
    }
    return response.data;
}

export const getLotes = async (): Promise<LotesContent> => {
    const response = await getDataApi<LotesContent>(`${donationsUrl}/lotes`);
    if (response.data == null) {
        return { lotes: [] }
    }
    return response.data;
}

export const getDonationsNormalDownloadReport = (id: number) => {
    return getDataFileApi(`${donationsUrl}/download/${id}`);
}
export const getDonationsNoteDeliveryDownload = (id: number) => {
    return getDataFileApi(`${donationsUrl}/note-delivery/${id}`);
}

export const postDonation = async (data: DonationBody): Promise<BaseResponse<IDonations | null>> => {
    return postDataApi<DonationBody, IDonations>(donationsUrl, data);
}

export const putDonation = async (id: number, data: DonationBody): Promise<BaseResponse<IDonations | null>> => {
    return putDataApi<DonationBody, IDonations>(`${donationsUrl}/${id}`, data);
}
