import { Column } from "@/components/table/table.interface";
import { DetDonation, IDonations } from "@/services/donations/donations.interface";
import { formatDate } from "@/utils/formatters";
import { Download } from "lucide-react";
import { MdEdit } from "react-icons/md";

export const donationsColumns: Column[] = [
    {
        label: "Proveedor",
        column: "provider.name",
        visible: true,
        isIcon: false,
        element: (data: IDonations) => `${data.provider.name}`,
    },
    {
        label: "Tipo",
        column: "type",
        visible: true,
        isIcon: false,
        element: (data: IDonations) => data.type,
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
        className: () => 'bg-[#193db9] text-white'
    },
    {
        label: "Cantidad",
        column: "amount",
        visible: true,
        isIcon: false,
        element: (data: DetDonation) => data.amount.toString(),
        className: () => 'bg-[#193db9] text-white'
    },
    {
        label: "Fecha de ingreso",
        column: "lote",
        visible: true,
        isIcon: false,
        element: (data: DetDonation) => formatDate(data.admissionDate || new Date()),
        className: () => 'bg-[#193db9] text-white'
    },
    {
        label: "Fecha de expiración",
        column: "lote",
        visible: true,
        isIcon: false,
        element: (data: DetDonation) => formatDate(data.expirationDate || new Date()),
        className: () => 'bg-[#193db9] text-white'
    },
]