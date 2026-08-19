import { IMedicine } from "../medicine/medicine.interface";
import { IInstitution } from "../institution/institution.interface";
import { IProviders } from "../provider/provider.interface";

export type TypeDonation = "Entrada" | "Salida";

export interface DonationBody {
    providerId: number | null;
    institutionId: number | null;
    benefited?: number | null;
    type: TypeDonation;
    date: Date | string;
    lote: string;
    changeDonDetails?: boolean;
    medicines: DetDonationBody[];
}

export interface DetDonationBody {
    medicineId?: number | null;
    medicine?: MedicineMinBody;
    amount: number;
    benefited?: number | null;
    storageId: number;
    lote?: string;
    expirationDate: Date | string;
}

export interface MedicineMinBody {
    name: string;
    description?: string;
    code?: string;
    category?: string;
    medicine?: boolean;
    form?: string;
    presentation?: string;
    temperate?: string;
    manufacturer?: string;
    activeIngredient?: string;
    countryOfOrigin?: string;
}

export interface DonationMedicine {
    id: number;
    medicineId: number;
    details: DetailDonationMedicine[];
    benefited?: number | null;
    expirationDate: Date | string;
}

export interface DetailDonationMedicine {
    amount: number;
    storageId: number;
    lote?: string;
    benefited?: number;
}


//------------------------

export interface LotesContent {
    lotes: string[]
}

export interface DonationsContent {
    donations: IDonations[];
}

export interface IDonations {
    id: number;
    institutionId: null;
    providerId: number;
    provider: IProviders;
    institution: IInstitution;
    type: TypeDonation;
    date: Date;
    lote: string;
    benefited?: number | null;
    changeDonDetails?: boolean;
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
    storageId?: number;
    lote?: string;
    benefited?: number | null;
    admissionDate: Date;
    expirationDate: Date;
}