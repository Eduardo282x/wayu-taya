export interface GroupProviders {
    allProviders: IProviders[];
    providers: IProviders[];
}

export interface IProviders {
    id: number;
    name: string;
    rif: string;
    address: string;
    country: string;
    email: string;
    deleted: boolean;
}


export interface ProviderBody {
    name: string;
    rif: string;
    address: string;
    country: string;
    email: string;
}