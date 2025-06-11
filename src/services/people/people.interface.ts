export interface PeopleBody {
    id_parroquia: number;
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

export interface GroupPeople {
    allPeople: IPeople[]
    people: IPeople[]
}

export interface IPeople {
    id:             number;
    name:           string;
    lastName:       string;
    address:        string;
    parishId:       number;
    email:          string;
    phone:          string;
    identification: string;
    sex:            string;
    birthdate:      Date;
    createAt:       Date;
    updateAt:       Date;
    deleted:        boolean;
    parish:         Parish;
}

export interface Parish {
    id:     number;
    name:   string;
    townId: number;
}
