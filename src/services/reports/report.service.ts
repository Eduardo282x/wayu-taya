import { getDataFileApi, postDataApi, postDataFileApi } from "@/services/api.service"
import { formatDateForInput } from "@/utils/formatters";
import { BodyReport, IReports, ReportDonations, ReportFilters } from "./report.interface";

const reportUrl = "/reports";

export const getReport = async (data: BodyReport): Promise<IReports | null> => {
    const response = await postDataApi<BodyReport, IReports>(`${reportUrl}/summary-report`, data);
    return response.data;
}

/** Fecha local `YYYY-MM-DD` para no desfasar el rango por la zona horaria. */
const toFilterDate = (value: Date | string): string => {
    return formatDateForInput(value);
}

const buildFilterParams = (filters?: ReportFilters): Record<string, string | number> => {
    const params: Record<string, string | number> = {};
    if (!filters) return params;

    if (filters.from) params.from = toFilterDate(filters.from);
    if (filters.to) params.to = toFilterDate(filters.to);
    if (filters.providerId != null) params.providerId = filters.providerId;
    if (filters.lote) params.lote = filters.lote;
    if (filters.storeId != null) params.storeId = filters.storeId;

    return params;
}

export const generateReportDonations = (data: ReportDonations, filters?: ReportFilters) => {
    return postDataFileApi(`${reportUrl}/unified-by-provider-and-lots`, { ...data, ...filters })
}

export const generateReportInventory = (filters?: ReportFilters) => {
    return getDataFileApi(`${reportUrl}/report-inventory`, { params: buildFilterParams(filters) })
}

export const generateReportStore = (storeId: number, filters?: ReportFilters) => {
    return getDataFileApi(`${reportUrl}/report-inventory/${storeId}`, { params: buildFilterParams(filters) })
}
