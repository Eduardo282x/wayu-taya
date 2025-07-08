import { postDataApi, postDataFileApi } from "@/services/api"
import { BodyReport, ReportDonations } from "./report.interface";

const reportUrl = "/reports";

export const getReport = async (data: BodyReport) => {
    return await postDataApi(`${reportUrl}/summary-report`, data)
}
export const generateReportDonations = async (data: ReportDonations) => {
    return await postDataFileApi(`${reportUrl}/unified-by-provider-and-lots`, data)
}
