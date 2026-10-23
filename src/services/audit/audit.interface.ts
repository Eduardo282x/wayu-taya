import { PaginationMeta, PaginationQuery } from "../base.interface";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

export const AUDIT_ACTIONS: AuditAction[] = ["CREATE", "UPDATE", "DELETE"];

export interface AuditQueryParams extends PaginationQuery {
    entity?: string;
    action?: AuditAction;
    userId?: number;
    from?: string;
    to?: string;
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
    username?: string | null;
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

export const Audit_Actions_Options: {label: string, value: AuditAction}[] = [
    {
        label: 'Creación',
        value: 'CREATE'
    },
    {
        label: 'Actualización',
        value: 'UPDATE'
    },
    {
        label: 'Eliminación',
        value: 'DELETE'
    }
];

export type Entities = 'Donation' | 'Inventory' | 'Medicine'

export const Audit_Entities_Options: {label: string, value: Entities}[] = [
    {
        label: 'Donaciones',
        value: 'Donation'
    },
    {
        label: 'Inventario',
        value: 'Inventory'
    },
    {
        label: 'Medicinas',
        value: 'Medicine'
    }
];
