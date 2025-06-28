export interface IProviders {
    id:      number;
    name:    string;
    rif:     string;
    address: string;
    country: string;
    email:   string;
    deleted: boolean;
}


export interface ProviderBody {
    name: string;
    dateofdelivery: string;
    address: string;
    phone: string;
    email: string;
    
}