import { deleteDataApi, getDataApi, getDataFileApi, postDataApi, putDataApi, type ApiRequestOptions } from "../api.service";
import { DonationBody, DonationSummary, DonationSummaryQueryParams, DonationsQueryParams, IDonations, LotesContent, PaginatedDonationsContent } from "./donations.interface";
import { BaseResponse } from "../base.interface";

const donationsUrl = "/donations";

const buildDonationsQueryParams = (params?: DonationSummaryQueryParams): Record<string, string | number> => {
    const queryParams: Record<string, string | number> = {};

    if (params?.type && params.type !== 'all') queryParams.type = params.type;
    if (params?.lote) queryParams.lote = params.lote;
    if (params?.providerId != null) queryParams.providerId = params.providerId;
    if (params?.institutionId != null) queryParams.institutionId = params.institutionId;
    if (params?.startDate) queryParams.startDate = params.startDate;
    if (params?.endDate) queryParams.endDate = params.endDate;
    if (params?.controlNumber) queryParams.controlNumber = params.controlNumber;

    return queryParams;
}

export const getDonations = async (params?: DonationsQueryParams): Promise<PaginatedDonationsContent> => {
    const queryParams: Record<string, string | number> = {
        page: params?.page ?? 1,
        size: params?.size ?? 100,
        ...buildDonationsQueryParams(params),
    };

    const response = await getDataApi<PaginatedDonationsContent>(donationsUrl, { params: queryParams });
    if (response.data == null) {
        return {
            donations: [],
            pagination: {
                total: 0,
                page: params?.page ?? 1,
                size: params?.size ?? 100,
                totalPages: 0,
            },
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

export const getDonationsSummary = async (params?: DonationSummaryQueryParams): Promise<DonationSummary | null> => {
    const response = await getDataApi<DonationSummary>(`${donationsUrl}/summary`, {
        params: buildDonationsQueryParams(params),
    });
    return response.data ?? null;
}

export const getDonationsNormalDownloadReport = (id: number) => {
    return getDataFileApi(`${donationsUrl}/download/${id}`);
}
export const getDonationsNoteDeliveryDownload = (id: number) => {
    return getDataFileApi(`${donationsUrl}/note-delivery/${id}`);
}
export const getDonationsCertificateDownload = (id: number) => {
    return getDataFileApi(`${donationsUrl}/certificate/${id}`);
}
export const getDonationsExcelTemplate = () => {
    return getDataFileApi(`${donationsUrl}/template`);
}

export const postDonation = async (data: DonationBody, options?: ApiRequestOptions): Promise<BaseResponse<IDonations | null>> => {
    return postDataApi<DonationBody, IDonations>(donationsUrl, data, options);
}

export const putDonation = async (id: number, data: DonationBody, options?: ApiRequestOptions): Promise<BaseResponse<IDonations | null>> => {
    return putDataApi<DonationBody, IDonations>(`${donationsUrl}/${id}`, data, options);
}

export const deleteDonation = async (id: number): Promise<BaseResponse<IDonations | null>> => {
    return deleteDataApi<IDonations>(`${donationsUrl}/${id}`);
}
