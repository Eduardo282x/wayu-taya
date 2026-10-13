import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAudit } from "@/services/audit/audit.service"
import { AuditQueryParams } from "@/services/audit/audit.interface"
import { useIsAuthenticated } from "@/store/auth.store"

export const auditKeys = {
    all: ["audit"] as const,
    list: (params: AuditQueryParams) => ["audit", "list", params] as const,
}

export const useAuditQuery = (params: AuditQueryParams, enabled = true) => {
    const isAuthenticated = useIsAuthenticated()

    return useQuery({
        queryKey: auditKeys.list(params),
        queryFn: () => getAudit(params),
        enabled: enabled && isAuthenticated,
        placeholderData: keepPreviousData,
    })
}
