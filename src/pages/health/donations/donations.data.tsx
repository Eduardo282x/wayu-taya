import { Column } from "@/components/table/table.interface";
import { DetDonation, IDonations } from "@/services/donations/donations.interface";
import { formatDate } from "@/utils/formatters";
import { Download } from "lucide-react";
import { MdEdit } from "react-icons/md";

export interface IDonationsFilters {
    type: 'all' | 'Entrada' | 'Salida';
    lote: string;
    providerId: number | null;
    institutionId: number | null;
}

export type DonationTypeForm = 'medicineId' | 'amount' | 'storageId' | 'admissionDate' | 'expirationDate';

export const donationsColumns: Column[] = [
    {
        label: "Proveedor / Institución",
        column: "provider.name",
        visible: true,
        isIcon: false,
        element: (data: IDonations) => data.provider ? `${data.provider.name}` : `${data.institution.name}`,
    },
    {
        label: "Tipo",
        column: "type",
        visible: true,
        isIcon: false,
        element: (data: IDonations) => (
            <p className={`
                px-2 py-1 rounded-full font-medium text-center
                ${data.type == 'Entrada' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}
            `}>
                {data.type}
            </p>
        ),
    },
    {
        label: "Lote",
        column: "lote",
        visible: true,
        isIcon: false,
        element: (data: IDonations) => data.lote,
    },
    {
        label: "Fecha",
        column: "date",
        visible: true,
        isIcon: false,
        element: (data: IDonations) => formatDate(data.date),
    },
    {
        label: "Editar",
        column: "edit",
        visible: true,
        isIcon: true,
        element: () => "",
        icon: {
            label: "Editar donación",
            icon: MdEdit,
            className: "text-blue-800  font-bold",
            variant: "ghost",
        },
    },
    {
        label: "Descargar",
        column: "download",
        visible: true,
        isIcon: true,
        element: () => "",
        hiddenIcon: (data: IDonations) => data.type == 'Entrada',
        icon: {
            label: "Descargar donación",
            icon: Download,
            className: "text-blue-600",
            variant: "ghost",
        },
    },
];

export const detDonationsColumns: Column[] = [
    {
        label: "Medicina",
        column: "medicine.name",
        visible: true,
        isIcon: false,
        element: (data: DetDonation) => `${data.medicine.name} ${data.medicine.amount}${data.medicine.unit}`,
        className: () => 'bg-[#193db9] text-white',
        disabledClassName: true,
    },
    {
        label: "Cantidad",
        column: "amount",
        visible: true,
        isIcon: false,
        element: (data: DetDonation) => data.amount.toString(),
        className: () => 'bg-[#193db9] text-white',
        disabledClassName: true,
    },
    {
        label: "Fecha de ingreso",
        column: "lote",
        visible: true,
        isIcon: false,
        element: (data: DetDonation) => formatDate(data.admissionDate || new Date()),
        className: () => 'bg-[#193db9] text-white',
        disabledClassName: true,
    },
    {
        label: "Fecha de expiración",
        column: "lote",
        visible: true,
        isIcon: false,
        element: (data: DetDonation) => formatDate(data.expirationDate || new Date()),
        className: () => 'bg-[#193db9] text-white',
        disabledClassName: true,
    },
]