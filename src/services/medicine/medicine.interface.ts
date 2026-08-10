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
    benefited: number;
}

export interface MedicineContent {
    medicines: IMedicine[];
}

export interface IMedicine {
    id:               number;
    name:             string;
    description:      string;
    code:             null;
    categoryId:       number;
    medicine:         boolean;
    presentation:     string;
    temperate:        string;
    manufacturer:     string;
    activeIngredient: string;
    countryOfOrigin:  string;
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

export interface CategoryContent { 
    categories: Category[]
}

export interface FormContent { 
    forms: Form[]
}

export type TabOptionCategoryForm = "category" | "form"
