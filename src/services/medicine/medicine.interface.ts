export interface MedicineBody {
    name: string;
    description: string;
    categoryId: number;
    medicine: boolean;
    unit: string;
    amount: number;
    temperate: string;
    manufacturer: string;
    activeIngredient: string;
    formId: number;
}

export interface GroupMedicine {
    allMedicine: IMedicine[];
    medicine: IMedicine[];
}

export interface IMedicine {
    id:               number;
    name:             string;
    description:      string;
    categoryId:       number;
    medicine:         boolean;
    unit:             string;
    amount:           number;
    temperate:        string;
    manufacturer:     string;
    activeIngredient: string;
    countryOfOrigin: string;
    formId:           number;
    category:         Category;
    form:             Form;
}

export interface Category {
    id:       number;
    category: string;
}

export interface Form {
    id:    number;
    forms: string;
}
