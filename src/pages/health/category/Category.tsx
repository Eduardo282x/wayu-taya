import { MdOutlineCategory } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { FilterComponent } from "@/components/table/FilterComponent";
import { categoryColumns } from "./category.data";
import { formColumns } from "./form.data";
import { useState, useEffect } from "react";
import ConfirmDeleteCategoryOrFormDialog from "./ConfirmDeleteCategoryOrFormDialog"; // Nuevo nombre
import { HeaderPages } from "@/pages/layout/Header";
import { TableComponents } from "@/components/table/TableComponents";
import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { Button } from "@/components/ui/button";
import { CategoryAndFormDialog } from "./CategoryAndFormDialog"; // Nuevo diálogo unificado
import { GroupCategory, GroupForm, ICategory, IForm, TabOptionCategoryForm } from "@/services/medicine/medicine.interface";
import { getCategories, getForms, postCategories, postForms, putCategories, putForms } from "@/services/medicine/medicine.service";

export const Category = () => {
    const [categories, setCategories] = useState<GroupCategory>({ allCategories: [], categories: [], });
    const [forms, setForms] = useState<GroupForm>({ allForms: [], forms: [] });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryFormSelected, setCategoryFormSelected] = useState<ICategory | IForm | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentView, setCurrentView] = useState<TabOptionCategoryForm>("category");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getDataCategoryFormApi();
    }, []);

    const getDataCategoryFormApi = async () => {
        setLoading(true);
        try {
            const responseCategory: ICategory[] = await getCategories();
            setCategories({ allCategories: responseCategory, categories: responseCategory });
            const responseForm: IForm[] = await getForms();
            setForms({ allForms: responseForm, forms: responseForm });
        } catch (err) {
            console.error("Error al cargar datos:", err);
        }
        setLoading(false);
    };

    const getActionTable = (action: string, data: ICategory | IForm) => {
        setCategoryFormSelected(data);
        if (action === "delete") {
            setIsDeleteDialogOpen(true);
        }
        if (action === "edit") {
            setOpen(true);
        }
    };

    const handleOpenAddForm = () => {
        setCategoryFormSelected(null);
        setOpen(true);
    };

    const handleConfirmDelete = async () => {

    };

    const handleAddEditSubmit = async (data: IForm | ICategory) => {
        setLoading(true);
        if (data.initialTab === "category") {
            if (categoryFormSelected) {
                await putCategories(categoryFormSelected.id, data as ICategory);
            } else {
                await postCategories(data as ICategory);
            }
        } else {
            if (categoryFormSelected) {
                await putForms(categoryFormSelected.id, data as IForm);
            } else {
                await postForms(data as IForm);
            }
        }
        setLoading(false);
        setOpen(false)
        getDataCategoryFormApi();
    };

    const tabSelected = (tab: TabOptionCategoryForm): string => {
        if (tab == currentView) {
            return 'bg-gradient-to-r from-blue-800 to-[#58c0e9] text-white'
        }
        return 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
    }

    const setFilters = (data: ICategory[] | IForm[]) => {
        if (currentView === "category") {
            setCategories((prev) => ({ ...prev, categories: data as ICategory[] }));
        } else {
            setForms((prev) => ({ ...prev, forms: data as IForm[] }));
        }
    }

    return (
        <div className="min-h-[90vh] w-[79.5vw] pr-7 overflow-auto">
            {loading && <ScreenLoader />}
            <HeaderPages title="Gestión de Categorías y Formas" Icon={MdOutlineCategory} />

            <div className="w-full h-fit border-b-2 border-gray-300 flex items-center pb-2 px-2 justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant={currentView === "category" ? "animated" : "outline"}
                        className={tabSelected('category')}
                        onClick={() => setCurrentView("category")}
                    >
                        Categorías
                    </Button>
                    <Button
                        variant={currentView === "form" ? "animated" : "outline"}
                        className={tabSelected('form')}
                        onClick={() => setCurrentView("form")}
                    >
                        Formas
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <FilterComponent
                        data={currentView === "category" ? categories.allCategories : forms.allForms}
                        columns={currentView === "category" ? categoryColumns : formColumns}
                        placeholder={currentView === "category" ? "Buscar categoría..." : "Buscar forma..."}
                        setDataFilter={setFilters}
                    />

                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleOpenAddForm}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-800 to-[#58c0e9] text-white"
                    >
                        <FaPlus className="w-4 h-4" />
                        {currentView === "category" ? "Agregar Categoría" : "Agregar Forma"}
                    </Button>
                </div>
            </div>
            <div className="mt-3">
                <TableComponents
                    data={currentView == 'category' ? categories.categories : forms.forms}
                    column={currentView == 'category' ? categoryColumns : formColumns}
                    actionTable={getActionTable}
                />

                <ConfirmDeleteCategoryOrFormDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onConfirm={handleConfirmDelete}
                    itemName={categoryFormSelected ? "" : ""}
                    itemType={currentView === "category" ? "esta categoría" : "esta forma farmacéutica"}
                />

                <CategoryAndFormDialog
                    open={open}
                    onOpenChange={setOpen}
                    onSubmit={handleAddEditSubmit}
                    itemData={categoryFormSelected}
                    initialTab={currentView}
                />
            </div>
        </div>
    );
};
