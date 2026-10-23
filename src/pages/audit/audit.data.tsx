import type { Column } from "@/components/table/table.interface";
import type { AuditLog } from "@/services/audit/audit.interface";
import { formatDate } from "@/utils/formatters";
import { formatDateTime } from "@/hooks/formaters";

const ACTION_STYLES: Record<string, string> = {
    CREATE: "bg-green-200 text-green-800",
    UPDATE: "bg-yellow-200 text-yellow-800",
    DELETE: "bg-red-200 text-red-800",
};

const TRANSLATE: Record<string, string> = {
    CREATE: 'Creación',
    UPDATE: 'Edición',
    DELETE: 'Eliminacion',
}

const TRANSLATE_ENTITY: Record<string, string> = {
    DetDonation: 'Detalle de donación',
    Donation: 'Donación',
    HistoryInventory: 'Historial de inventario',
    Inventory: 'Inventario',
    Medicine: 'Medicina/Producto',
}

export const auditColumns: Column[] = [
    {
        label: "Fecha",
        column: "createdAt",
        visible: true,
        isIcon: false,
        element: (data: AuditLog) => (
            <div className="flex flex-col">
                <span>{formatDate(data.createdAt)}</span>
                <span className="text-xs text-gray-500">{formatDateTime(data.createdAt)}</span>
            </div>
        ),
    },
    {
        label: "Usuario",
        column: "user",
        visible: true,
        isIcon: false,
        element: (data: AuditLog) => data.username,
        className: () => 'max-w-60 overflow-hidden text-ellipsis',
    },
    {
        label: "Acción",
        column: "action",
        visible: true,
        isIcon: false,
        element: (data: AuditLog) => (
            <p className={`px-2 py-1 rounded-full text-xs text-center font-medium ${ACTION_STYLES[data.action] ?? "bg-gray-200 text-gray-800"}`}>
                {TRANSLATE[data.action]}
            </p>
        ),
    },
    {
        label: "Entidad",
        column: "entity",
        visible: true,
        isIcon: false,
        element: (data: AuditLog) => TRANSLATE_ENTITY[data.entity],
    },
    // {
    //     label: "ID",
    //     column: "entityId",
    //     visible: true,
    //     isIcon: false,
    //     element: (data: AuditLog) => (data.entityId != null ? String(data.entityId) : "-"),
    // },
    {
        label: "Descripción",
        column: "description",
        visible: true,
        isIcon: false,
        element: (data: AuditLog) => data.description ?? "-",
        className: () => 'max-w-160 w-160 overflow-hidden text-ellipsis',
    },
];
