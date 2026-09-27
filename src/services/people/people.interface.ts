import type { Location } from "../location.interface";

export interface PeopleBody {
    location: Location;
    name: string;
    lastName: string;
    address: string;
    email: string;
    phone: string;
    identification: string;
    sex: string;
    birthdate: Date;
    // id_programa: number[];
    // cambioPersona?: boolean;
}

export interface PeopleContent {
    people: IPeople[]
}

export interface IPeople {
    id:             number;
    name:           string;
    lastName:       string;
    address:        string;
    location:       Location;
    email:          string;
    phone:          string;
    identification: string;
    sex:            string;
    birthdate:      Date;
    createAt:       Date;
    updateAt:       Date;
    deleted:        boolean;
}
