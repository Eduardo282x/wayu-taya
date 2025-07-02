export interface GroupInstitution {
    allInstitution: IInstitution[];
    institution: IInstitution[];
}

export interface IInstitution {
    id:      number;
    name:    string;
    rif:     string;
    address: string;
    country: string;
    email:   string;
    type:    string;
    deleted: boolean;
}


export interface InstitutionsBody {
    name: string;
    rif: string;
    address: string;
    country: string;
    email: string;
    type: string;
}