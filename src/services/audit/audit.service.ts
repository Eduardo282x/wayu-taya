import { getDataApi } from "@/services/api.service"
import { AuditLog, AuditQueryParams, PaginatedAuditContent } from "./audit.interface"

const auditUrl = "/audit";

export const getAudit = async (params?: AuditQueryParams): Promise<PaginatedAuditContent> => {
    const queryParams: Record<string, string | number> = {
        page: params?.page ?? 1,
        size: params?.size ?? 100,
    };

    if (params?.entity) queryParams.entity = params.entity;
    if (params?.action) queryParams.action = params.action;
    if (params?.userId != null) queryParams.userId = params.userId;

    const response = await getDataApi<PaginatedAuditContent>(auditUrl, { params: queryParams });

    if (response.data == null) {
        return {
            logs: [],
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

export const getAuditById = async (id: number): Promise<AuditLog | null> => {
    const response = await getDataApi<AuditLog>(`${auditUrl}/${id}`);
    return response.data;
}
