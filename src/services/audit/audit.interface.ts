import { PaginationMeta, PaginationQuery } from "../base.interface";

export interface AuditQueryParams extends PaginationQuery {
    entity?: string;
    action?: string;
    userId?: number;
}

export interface AuditUser {
    id: number;
    name: string;
    lastName: string;
    username?: string;
}

export interface AuditLog {
    id: number;
    action: string;
    entity: string;
    entityId?: number | null;
    userId?: number | null;
    user?: AuditUser | null;
    before?: unknown;
    after?: unknown;
    description?: string;
    createdAt: Date;
}

export interface PaginatedAuditContent {
    logs: AuditLog[];
    pagination: PaginationMeta;
}

/** Entidades del modulo Salud que se pueden auditar. */
export const AUDIT_ENTITIES = ["Donation", "Inventory", "Medicine"] as const;
