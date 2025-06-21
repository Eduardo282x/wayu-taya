import { IMedicine } from "../medicine/medicine.interface";
import { IProviders } from "../provider/provider.interface";

export type TypeDonation = "Entrada" | "Salida";

export interface DonationBody {
    providerId: number;
    type: TypeDonation;
    date: Date,
    lote: string,
    medicines: DonationMedicine[]
}

export interface DonationMedicine {
    medicineId: number;
    amount: number;
    storageId: number;
    admissionDate: Date;
    expirationDate: Date;
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
    type: string;
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
    admissionDate?: Date;
    expirationDate?: Date;
}