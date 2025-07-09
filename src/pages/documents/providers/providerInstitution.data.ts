import { Column } from "@/components/table/table.interface";
import { GroupInstitution, IInstitution } from "@/services/institution/institution.interface";
import { GroupProviders, IProviders, ProviderBody } from "@/services/provider/provider.interface";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";


export interface ProviderInstitutionProps {
    setLoading: (loader: boolean) => void;
    columns: Column[];
    getActionForm: (action: ProviderBody | IInstitution) => void
}

export interface ProvidersProps extends ProviderInstitutionProps {
    providers: GroupProviders
    setProviders: (data: GroupProviders) => void
}

export interface InstitutionProps extends ProviderInstitutionProps {
    institution: GroupInstitution
    setInstitution: (data: GroupInstitution) => void
}

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
        label: "Correo",
        column: "email",
        visible: true,
        isIcon: false,
        element: (data: IInstitution) => data.email,
    },
    {
        label: "Parroquia",
        column: "parish.name",
        visible: true,
        isIcon: false,
        element: (data: IInstitution) => data.parish.name,
    },
    {
        label: "Editar",
        column: "edit",
        visible: true,
        isIcon: true,
        element: () => "",
        icon: {
            label: "Editar institución",
            icon: FaRegEdit,
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
            icon: FaRegEdit,
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