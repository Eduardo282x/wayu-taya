import { GroupMedicine, IMedicine, MedicineBody, Category, Form } from "@/services/medicine/medicine.interface";
import { DropdownColumnFilter } from "@/components/table/DropdownColumnFilter";
import { TableComponents } from "@/components/table/TableComponents";
import { FilterComponent } from "@/components/table/FilterComponent";
import { getMedicine, postMedicine, putMedicine, deleteMedicine, getMedicineTemplate } from "@/services/medicine/medicine.service";
import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { Column } from "@/components/table/table.interface";
import { MedicineForm } from "./MedicineForm";
import { HeaderPages } from "@/pages/layout/Header";
import { medicineColumns } from "./medicine.data";
import { Button } from "@/components/ui/button";
import { GiMedicines } from "react-icons/gi";
import { useEffect, useState } from "react";
import { FaPills } from "react-icons/fa";
import ConfirmDeleteMedicineDialog from "./ConfirmDeleteMedicineDialog";
import { FaDownload, FaUpload } from "react-icons/fa6";

export const Medicine = () => {
  const [medicines, setMedicines] = useState<GroupMedicine>({ allMedicine: [], medicine: [] });
  const [medicineSelected, setMedicineSelected] = useState<IMedicine | null>(null);
  const [columns, setColumns] = useState<Column[]>(medicineColumns);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    getMedicineApi();
    getCategoriesAndForms();
  }, []);

  const getMedicineApi = async () => {
    setLoading(true);
    try {
      const response: IMedicine[] = await getMedicine();
      setMedicines({ allMedicine: response, medicine: response });
    } catch (err) {
      console.error("Error al obtener medicamentos:", err);
    }
    setLoading(false);
  };

  const getCategoriesAndForms = async () => {
    try {
      setCategories([
        { id: 1, category: "Analgésicos" },
        { id: 2, category: "Antibióticos" },
        { id: 3, category: "Antiinflamatorios" },
        { id: 4, category: "Vitaminas" },
        { id: 5, category: "Higiene Personal" },
        { id: 6, category: "Cuidado de la Piel" },
        { id: 7, category: "Cuidado Dental" },
        { id: 8, category: "Suplementos Nutricionales" },
        { id: 9, category: "Accesorios Médicos" },
        { id: 10, category: "Material de Curación" },
        { id: 11, category: "Otros" },
      ]);

      setForms([
        { id: 1, forms: "Tableta" },
        { id: 2, forms: "Cápsula" },
        { id: 3, forms: "Jarabe" },
        { id: 4, forms: "Inyección" },
        { id: 5, forms: "Crema" },
        { id: 6, forms: "Gotas" },
        { id: 7, forms: "Polvo" },
        { id: 8, forms: "Supositorio" },
        { id: 9, forms: "Spray" },
        { id: 10, forms: "Gel" },
        { id: 11, forms: "Parche" },
        { id: 12, forms: "Solución" },
        { id: 13, forms: "Ampolla" },
        { id: 14, forms: "Inhalador" },
        { id: 15, forms: "Otro" },
      ]);
    } catch (error) {
      console.error("Error al cargar categorías o formas:", error);
    }
  };

  const openAddForm = () => {
    setMedicineSelected(null);
    setIsAddFormOpen(true);
  };

  const handleAddOrEditMedicineSubmit = async (formData: MedicineBody) => {
    setLoading(true);
    try {
      if (medicineSelected) {
        await putMedicine(medicineSelected.id, formData);
      } else {
        await postMedicine(formData);
      }
      setIsAddFormOpen(false);
      await getMedicineApi();
    } catch (error) {
      console.error("Error al guardar el medicamento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeleteMedicine = async () => {
    if (medicineSelected) {
      setLoading(true);
      try {
        await deleteMedicine(medicineSelected.id);
        await getMedicineApi();
        setIsDeleteDialogOpen(false);
        setMedicineSelected(null);
      } catch (error) {
        console.error("Error al eliminar el medicamento:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const setMedicineFilter = (filteredMedicines: IMedicine[]) => {
    setMedicines((prev) => ({ ...prev, medicine: filteredMedicines }));
  };

  const getActionTable = (action: string, data: IMedicine) => {
    setMedicineSelected(data);
    if (action === "edit") {
      setIsAddFormOpen(true);
    }
    if (action === "delete") {
      setIsDeleteDialogOpen(true);
    }
  };
  const downloadTemplate = async () => {
    const response = await getMedicineTemplate();
    const url = URL.createObjectURL(response)
    const link = window.document.createElement("a")
    link.href = url
    link.download = `Plantilla excel`
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {loading && <ScreenLoader />}
      <div>
        <HeaderPages title="Medicamentos" Icon={FaPills} />
      </div>

      <div className="flex justify-between items-center px-2 pb-2 pt-1 h-fit border-b-2 border-gray-300">
        <div className="flex items-center gap-2">
          <DropdownColumnFilter columns={columns} setColumns={setColumns} />

          <Button onClick={downloadTemplate} variant={'animatedNormal'} className="bg-green-700"><FaDownload /> Descargar plantilla</Button>
          <Button variant={'animatedNormal'} className="bg-green-700"><FaUpload />Cargar datos</Button>
        </div>

        <div className="flex items-center ">
          <FilterComponent
            data={medicines.allMedicine}
            columns={medicineColumns}
            placeholder="Buscar medicamentos..."
            setDataFilter={setMedicineFilter}
          />
          <Button variant={"animated"} className="h-full" onClick={openAddForm}>
            <GiMedicines className="size-6" />
            Registrar Medicamentos
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <TableComponents
          column={columns.filter((item) => item.visible === true)}
          data={medicines.medicine}
          actionTable={getActionTable}
        />
      </div>

      <MedicineForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSubmit={handleAddOrEditMedicineSubmit}
        medicine={medicineSelected}
        categories={categories}
        forms={forms}
      />

      <ConfirmDeleteMedicineDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDeleteMedicine}
        medicineName={medicineSelected?.name}
      />
    </>
  );
};
