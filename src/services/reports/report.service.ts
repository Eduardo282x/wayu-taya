import { getDataFileApi, postDataApi, postDataFileApi } from "@/services/api.service"
import { BodyReport, IReports, ReportDonations } from "./report.interface";

const reportUrl = "/reports";

export const getReport = async (data: BodyReport): Promise<IReports | null> => {
    const response = await postDataApi<BodyReport, IReports>(`${reportUrl}/summary-report`, data);
    return response.data;
}

export const generateReportDonations = (data: ReportDonations) => {
    return postDataFileApi(`${reportUrl}/unified-by-provider-and-lots`, data)
}

export const generateReportInventory = () => {
    return getDataFileApi(`${reportUrl}/report-inventory`)
}

export const generateReportStore = (storeId: number) => {
    return getDataFileApi(`${reportUrl}/report-inventory/${storeId}`)
}
