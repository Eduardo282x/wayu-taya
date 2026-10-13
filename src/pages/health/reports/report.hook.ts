import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getReport } from "@/services/reports/report.service"
import { BodyReport } from "@/services/reports/report.interface"
import { useIsAuthenticated } from "@/store/auth.store"

export const reportKeys = {
    all: ["reports"] as const,
    summary: (range: BodyReport) => ["reports", "summary", range] as const,
}

/**
 * Resumen del periodo. La `queryKey` incluye el rango, asi que cambiar de mes
 * dispara UNA sola peticion y reutiliza el cache si se vuelve al rango previo.
 */
export const useSummaryReportQuery = (range: BodyReport, enabled = true) => {
    const isAuthenticated = useIsAuthenticated()

    return useQuery({
        queryKey: reportKeys.summary(range),
        queryFn: () => getReport(range),
        enabled: enabled && isAuthenticated,
        placeholderData: keepPreviousData,
    })
}
