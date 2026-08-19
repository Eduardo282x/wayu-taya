import { getDataApi, getDataFileApi, postDataApi, putDataApi } from "../api.service";
import { DonationBody, DonationsQueryParams, IDonations, LotesContent, PaginatedDonationsContent } from "./donations.interface";
import { BaseResponse } from "../base.interface";

const donationsUrl = "/donations";

export const getDonations = async (params?: DonationsQueryParams): Promise<PaginatedDonationsContent> => {
    const queryParams: Record<string, string | number> = {
        page: params?.page ?? 1,
        size: params?.size ?? 100,
    };

    if (params?.type && params.type !== 'all') queryParams.type = params.type;
    if (params?.lote) queryParams.lote = params.lote;
    if (params?.providerId != null) queryParams.providerId = params.providerId;
    if (params?.institutionId != null) queryParams.institutionId = params.institutionId;
    if (params?.startDate) queryParams.startDate = params.startDate;
    if (params?.endDate) queryParams.endDate = params.endDate;
    if (params?.controlNumber) queryParams.controlNumber = params.controlNumber;

    const response = await getDataApi<PaginatedDonationsContent>(donationsUrl, { params: queryParams });
    if (response.data == null) {
        return {
            donations: [],
            page: params?.page ?? 1,
            size: params?.size ?? 100,
            total: 0,
            totalPages: 0,
        }
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
