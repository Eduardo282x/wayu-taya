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

export interface GroupMedicine {
    allMedicine: IMedicine[];
    medicine: IMedicine[];
}

export interface IMedicine {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    medicine: boolean;
    unit: string;
    amount: number;
    temperate: string;
    manufacturer: string;
    activeIngredient: string;
    countryOfOrigin: string;
    formId: number;
    category: ICategory;
    form: IForm;
}

export interface GroupCategory {
    allCategories: ICategory[];
    categories: ICategory[];
}
export interface GroupForm {
    allForms: IForm[];
    forms: IForm[];
}
export interface ICategory {
    id: number;
    category: string;
    initialTab?: TabOptionCategoryForm;
}

export interface IForm {
    id: number;
    forms: string;
    initialTab?: TabOptionCategoryForm;
}

export type TabOptionCategoryForm = "category" | "form"
