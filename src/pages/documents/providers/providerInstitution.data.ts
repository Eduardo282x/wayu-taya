import { Column } from "@/components/table/table.interface";
import { formatLabelLocation } from "@/hooks/formaters";
import { IInstitution } from "@/services/institution/institution.interface";
import { IProviders } from "@/services/provider/provider.interface";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";

export const institutionColumns: Column[] = [
    {
        label: "Institución",
        column: "name",
        visible: true,
        isIcon: false,
        element: (data: IInstitution) => data.name,
    },
    {
        label: "Rif",
        column: "rif",
        visible: true,
        isIcon: false,
        element: (data: IInstitution) => data.rif,
    },
    {
        label: "Responsable",
        column: "responsible",
        visible: true,
        isIcon: false,
        element: (data: IInstitution) => data.responsible,
    },
    {
        label: "Tipo",
        column: "type",
        visible: true,
        isIcon: false,
        element: (data: IInstitution) => data.type,
    },
    {
        label: "Dirección",
        column: "address",
        visible: true,
        isIcon: false,
        element: (data: IInstitution) => data.address,
    },
    {
        label: "Teléfono",
        column: "phone",
        visible: true,
        isIcon: false,
        element: (data: IInstitution) => data.phone,
    },
    {
        label: "Correo",
        column: "email",
        visible: false,
        isIcon: false,
        element: (data: IInstitution) => data.email,
    },
    // La columna existe y se ve, pero el `FilterComponent` resuelve rutas
    // planas, asi que `location.parish` no llega a filtrar. Para que filtre
    // habria que aplanar `location` en la respuesta o adaptar el filtrado.
    {
        label: "Ubicación",
        column: "location.parish",
        visible: true,
        isIcon: false,
        element: (data: IInstitution) => formatLabelLocation(data.location, "Sin ubicación"),
    },
    {
        label: "Editar",
        column: "edit",
        visible: true,
        isIcon: true,
        element: () => "",
        icon: {
            label: "Editar institución",
            icon: FiEdit2,
            className: "text-blue-600",
            variant: "ghost",
        },
    },
    {
        label: "Eliminar",
        column: "delete",
        visible: true,
        isIcon: true,
        element: () => "",
        icon: {
            label: "Eliminar institución",
            icon: FaRegTrashAlt,
            className: "text-red-600",
            variant: "ghost",
        },
    },
];

export const providerColumns: Column[] = [
    {
        label: "Proveedor",
        column: "name",
        visible: true,
        isIcon: false,
        element: (data: IProviders) => data.name,
    },
    {
        label: "Persona Responsable",
        column: "responsible",
        visible: true,
        isIcon: false,
        element: (data: IProviders) => data.responsible,
    },
    {
        label: "Rif",
        column: "rif",
        visible: true,
        isIcon: false,
        element: (data: IProviders) => data.rif,
    },
    {
        label: "Dirección",
        column: "address",
        visible: true,
        isIcon: false,
        element: (data: IProviders) => data.address,
    },
    {
        label: "Ciudad",
        column: "country",
        visible: false,
        isIcon: false,
        element: (data: IProviders) => data.country,
    },
    {
        label: "Teléfono",
        column: "phone",
        visible: false,
        isIcon: false,
        element: (data: IProviders) => data.phone,
    },
    {
        label: "Correo",
        column: "email",
        visible: false,
        isIcon: false,
        element: (data: IProviders) => data.email,
    },
    {
        label: "Editar",
        column: "edit",
        visible: true,
        isIcon: true,
        element: () => "",
        icon: {
            label: "Editar proveedor",
            icon: FiEdit2,
            className: "text-blue-600",
            variant: "ghost",
        },
    },
    {
        label: "Eliminar",
        column: "delete",
        visible: true,
        isIcon: true,
        element: () => "",
        icon: {
            label: "Eliminar proveedor",
            icon: FaRegTrashAlt,
            className: "text-red-600",
            variant: "ghost",
        },
    },
];