import { MdOutlineCategory } from "react-icons/md";
// import { FaVial } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FilterComponent } from "@/components/table/FilterComponent";
import { categoryColumns } from "./category.data";
import { formColumns } from "./form.data";
import { useState, useEffect } from "react";
import ConfirmDeleteCategoryOrFormDialog from "./ConfirmDeleteCategoryOrFormDialog"; // Nuevo nombre
import AlertDialog from "./alert-dialog";
import { HeaderPages } from "@/pages/layout/Header";
import { TableComponents } from "@/components/table/TableComponents";
import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { Button } from "@/components/ui/button";
import { CategoryAndFormDialog } from "./CategoryAndFormDialog"; // Nuevo diálogo unificado
import {
  GroupCategory,
  GroupForm,
  ICategory,
  IForm,
} from "@/services/medicine/medicine.interface";
import {
  getCategories,
  getForms,
  postCategories,
  postForms,
  putCategories,
  putForms,
} from "@/services/medicine/medicine.service";

export const Category = () => {
  const [categories, setCategories] = useState<GroupCategory>({
    allcategories: [],
    categories: [],
  });
  const [forms, setForms] = useState<GroupForm>({ allForms: [], forms: [] });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState<
    ICategory | IForm | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<"category" | "form">(
    "category"
  );

  const [isAddEditFormOpen, setIsAddEditFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ICategory | IForm | null>(null);

  useEffect(() => {
    fetchDataForCurrentView();
  }, [currentView]);

  const fetchDataForCurrentView = async () => {
    setLoading(true);
    try {
      if (currentView === "category") {
        const response: ICategory[] = await getCategories();
        setCategories({ allcategories: response, categories: response });
      } else {
        const response: IForm[] = await getForms();
        setForms({ allForms: response, forms: response });
      }
    } catch (err: any) {
      console.error("Error al cargar datos:", err);
      setAlertMessage(
        err.response?.data?.message ||
          `Error al cargar ${
            currentView === "category" ? "categorías" : "formas"
          }.`
      );
      setAlertOpen(true);
    }
    setLoading(false);
  };

  const getActionTable = (action: string, data: ICategory | IForm) => {
    setSelectedItemToDelete(data);
    setItemToEdit(data);

    if (action === "delete") {
      setIsDeleteDialogOpen(true);
    } else if (action === "edit") {
      setIsAddEditFormOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedItemToDelete) {
      setLoading(true);
      try {
        if (currentView === "category") {
          setAlertMessage("Categoría eliminada exitosamente.");
        } else {
          setAlertMessage("Forma farmacéutica eliminada exitosamente.");
        }
        setAlertOpen(true);
        fetchDataForCurrentView();
      } catch (err: any) {
        console.error("Error al eliminar:", err);
        setAlertMessage(
          err.response?.data?.message ||
            `Error al eliminar ${
              currentView === "category" ? "categoría" : "forma"
            }.`
        );
        setAlertOpen(true);
      } finally {
        setSelectedItemToDelete(null);
        setIsDeleteDialogOpen(false);
        setLoading(false);
      }
    }
  };

  const handleAddEditSubmit = async (data: any, id?: number) => {
    setLoading(true);
    try {
      if (data.type === "category") {
        if (id) {
          await putCategories(id, {
            name: data.name,
            description: data.description,
          });
          setAlertMessage("Categoría actualizada exitosamente.");
        } else {
          await postCategories({
            name: data.name,
            description: data.description,
          });
          setAlertMessage("Categoría agregada exitosamente.");
        }
      } else {
        if (id) {
          await putForms(id, {
            name: data.name,
            description: data.description,
          });
          setAlertMessage("Forma farmacéutica actualizada exitosamente.");
        } else {
          await postForms({ name: data.name, description: data.description });
          setAlertMessage("Forma farmacéutica agregada exitosamente.");
        }
      }
      setAlertOpen(true);
      setIsAddEditFormOpen(false);
      setItemToEdit(null);
      fetchDataForCurrentView();
    } catch (err: any) {
      console.error("Error al guardar:", err);
      setAlertMessage(
        err.response?.data?.message ||
          `Error al guardar ${
            data.type === "category" ? "la categoría" : "la forma"
          }.`
      );
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAddEditForm = () => {
    setIsAddEditFormOpen(false);
    setItemToEdit(null);
  };

  const handleOpenAddForm = () => {
    setItemToEdit(null); // Asegúrate de que no hay datos preexistentes para editar
    setIsAddEditFormOpen(true);
  };

  return (
    <div className="min-h-[90vh] w-[79.5vw] pr-7 overflow-auto">
      {loading && <ScreenLoader />}
      <HeaderPages
        title="Gestión de Categorías y Formas"
        Icon={MdOutlineCategory}
      />{" "}
      <div className="w-full h-fit border-b-2 border-gray-300 flex items-center pb-2 px-2 justify-between">
        <div className="flex items-center gap-2">
          <FilterComponent
            data={
              currentView === "category"
                ? categories.allcategories
                : forms.allForms
            }
            setDataFilter={(data) => {
              if (currentView === "category") {
                setCategories((prev) => ({
                  ...prev,
                  categories: data as ICategory[],
                }));
              } else {
                setForms((prev) => ({ ...prev, forms: data as IForm[] }));
              }
            }}
            columns={currentView === "category" ? categoryColumns : formColumns}
            placeholder={
              currentView === "category"
                ? "Buscar categoría..."
                : "Buscar forma..."
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={currentView === "category" ? "animated" : "outline"}
            className={
              currentView === "category"
                ? "bg-gradient-to-r from-blue-800 to-[#58c0e9] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }
            onClick={() => setCurrentView("category")}
          >
            Categorías
          </Button>
          <Button
            variant={currentView === "form" ? "animated" : "outline"}
            className={
              currentView === "form"
                ? "bg-gradient-to-r from-blue-800 to-[#58c0e9] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }
            onClick={() => setCurrentView("form")}
          >
            Formas
          </Button>

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
        {currentView === "category" && (
          <TableComponents
            data={categories.categories}
            column={categoryColumns}
            actionTable={getActionTable}
            colSpanColumns={false}
            isExpansible={false}
          />
        )}

        {currentView === "form" && (
          <TableComponents
            data={forms.forms}
            column={formColumns}
            actionTable={getActionTable}
            colSpanColumns={false}
            isExpansible={false}
          />
        )}

        <ConfirmDeleteCategoryOrFormDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          itemName={
            selectedItemToDelete
              ? ""
              : //   ? (selectedItemToDelete as ICategory | IForm).name
                ""
          }
          itemType={
            currentView === "category"
              ? "esta categoría"
              : "esta forma farmacéutica"
          }
        />

        <AlertDialog
          open={alertOpen}
          onOpenChange={setAlertOpen}
          title="Notificación"
          description={alertMessage}
        />

        <CategoryAndFormDialog
          open={isAddEditFormOpen}
          onOpenChange={handleCloseAddEditForm}
          onSubmit={handleAddEditSubmit}
          itemData={itemToEdit}
          initialTab={currentView}
        />
      </div>
    </div>
  );
};
