import { Column } from "@/components/table/table.interface";
import { DetDonation, IDonations } from "@/services/donations/donations.interface";
import { formatDate } from "@/utils/formatters";
import { MdEdit } from "react-icons/md";
import { DonationDownloadMenu } from "./DonationDownloadMenu";

export interface IDonationsFilters {
    type: 'all' | 'Entrada' | 'Salida';
    lote: string;
    providerId: number | null;
    institutionId: number | null;
    startDate: string | null;
    endDate: string | null;
    controlNumber: string;
}

export type DonationTypeForm = 'medicineId' | 'amount' | 'storageId' | 'lote' | 'benefited' | 'expirationDate';

export const donationsColumns: Column[] = [
    {
        label: "N° Control",
        column: "controlNumber",
        visible: true,
        isIcon: false,
        element: (data: IDonations) => data.controlNumber ? String(data.controlNumber) : '-',
        className: () => 'w-32 max-w-32 text-ellipsis overflow-hidden'
    },
    {
        label: "Proveedor / Institución",
        column: "provider.name",
        visible: true,
        isIcon: false,
        element: (data: IDonations) => data.provider ? `${data.provider.name}` : `${data.institution.name}`,
        className: () => 'w-100 max-w-100 text-ellipsis overflow-hidden'
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
        className: () => 'w-40 max-w-40 text-ellipsis overflow-hidden'
    },
    {
        label: "Lote",
        column: "lote",
        visible: true,
        isIcon: false,
        element: (data: IDonations) => data.lote,
        className: () => 'w-40 max-w-40 text-ellipsis overflow-hidden'
    },
    {
        label: "Fecha",
        column: "date",
        visible: true,
        isIcon: false,
        element: (data: IDonations) => formatDate(data.date),
        className: () => 'w-60 max-w-60 text-ellipsis overflow-hidden'
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
        className: () => 'w-20 max-w-20 text-ellipsis overflow-hidden'
    },
    {
        label: "Descargar",
        column: "download",
        visible: true,
        element: (data: IDonations) =>
            data.type === 'Entrada' ? null : <DonationDownloadMenu donationId={data.id} />,
        className: () => 'w-48 max-w-48 text-ellipsis overflow-hidden',
    },
];

export const detDonationsColumns: Column[] = [
    {
        label: "Medicina",
        column: "medicine.name",
        visible: true,
        isIcon: false,
        element: (data: DetDonation) => (
            <div className="w-100 max-w-100 truncate text-ellipsis overflow-hidden">
                {data.medicine.name} ${data.medicine.presentation}
            </div>
        ),
        disabledClassName: true,
        className: () => 'bg-[#193db9] text-white'
    },
    {
        label: "Cantidad",
        column: "amount",
        visible: true,
        isIcon: false,
        element: (data: DetDonation) => data.amount.toString(),
        className: () => 'bg-[#193db9] text-white ',
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