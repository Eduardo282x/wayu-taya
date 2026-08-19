import { PaginationQuery } from "../base.interface";

export interface MedicineBody {
    name: string;
    description: string;
    code: string;
    category: string;
    medicine: boolean;
    form: string;
    presentation: string;
    temperate: string;
    manufacturer: string;
    activeIngredient: string;
    countryOfOrigin: string;
}

export interface MedicineContent {
    medicines: IMedicine[];
}

export interface MedicineQueryParams extends PaginationQuery {
    name?: string;
}

export interface PaginatedMedicineContent {
    medicines: IMedicine[];
    page: number;
    size: number;
    total: number;
    totalPages: number;
}

export interface MedicineQueryParams extends PaginationQuery {
    name?: string;
}

export interface PaginatedMedicineContent {
    medicines: IMedicine[];
    page: number;
    size: number;
    total: number;
    totalPages: number;
}

export interface IMedicine {
    id: number;
    name: string;
    description: string;
    code: null;
    categoryId: number;
    medicine: boolean;
    presentation: string;
    temperate: string;
    manufacturer: string;
    activeIngredient: string;
    countryOfOrigin: string;
    formId: number;
    category: Category;
    form: Form;
}

export interface Category {
    id: number;
    category: string;
}

export interface Form {
    id: number;
    forms: string;
}

export interface CategoryContent {
    categories: Category[]
}

export interface FormContent {
    forms: Form[]
}

export type TabOptionCategoryForm = "category" | "form"
