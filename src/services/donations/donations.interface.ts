import { IMedicine } from "../medicine/medicine.interface";
import { IProviders } from "../provider/provider.interface";

export type TypeDonation = "Entrada" | "Salida";

export interface DonationBody {
    providerId: number | null;
    institutionId: number | null;
    type: TypeDonation;
    date: Date | string,
    lote: string,
    medicines: DonationMedicine[]
}

export interface DonationMedicine {
    id: number;
    medicineId: number;
    details: DetailDonationMedicine[];
    admissionDate: Date | string;
    expirationDate: Date | string;
}

export interface DetailDonationMedicine {
    amount: number;
    storageId: number;
    lote?: string;
}


//------------------------


export interface GroupDonations {
    allDonations: IDonations[];
    donations: IDonations[];
}

export interface IDonations {
    id: number;
    institutionId: null;
    providerId: number;
    provider: IProviders;
    institution: IProviders;
    type: TypeDonation;
    date: Date;
    lote: string;
    createAt: Date;
    updateAt: Date;
    detDonation: DetDonation[];
}

export interface DetDonation {
    id: number;
    donationId: number;
    medicineId: number;
    amount: number;
    medicine: IMedicine;
    admissionDate: Date;
    expirationDate: Date;
}

export type DonationType = "Entrada" | "Salida";

export interface DonationForm {
    providerName: string;
    type: DonationType;
    lote: string;
    date: Date | string;
}