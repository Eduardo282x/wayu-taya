import { MdOutlineProductionQuantityLimits } from "react-icons/md"
import { MedicineDetails } from "./inventory-table-variant"
import { FilterComponent } from "@/components/table/FilterComponent"
import { GroupMedicine, medicineColumns, type Medicine } from "./inventory.data"
import { useState, useEffect } from "react"
import ConfirmDeleteDialog from "./confirm-delete-dialog"
import AlertDialog from "./alert-dialog"
import { HeaderPages } from "@/pages/layout/Header"
import { getInventory } from "@/services/inventory/inventory.service"
import type { IInventory } from "@/services/inventory/inventory.interface"
import { TableComponents } from "@/components/table/TableComponents"

const initialMedicines: Medicine[] = [
  {
    id: 1,
    medicina: "Paracetamol 500mg",
    cantidad: 100,
    fechaLlegada: "2024-01-15",
    fechaExpiracion: "2026-01-15",
  },
  {
    id: 2,
    medicina: "Ibuprofeno 400mg",
    cantidad: 75,
    fechaLlegada: "2024-02-10",
    fechaExpiracion: "2024-12-10",
  },
  {
    id: 3,
    medicina: "Amoxicilina 250mg",
    cantidad: 50,
    fechaLlegada: "2024-03-05",
    fechaExpiracion: "2025-07-01",
  },
];

export const Inventory = () => {
  const [medicines, setMedicines] = useState<GroupMedicine>({ allMedicine: initialMedicines, medicine: initialMedicines })
  const [alertOpen, setAlertOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null)

  useEffect(() => {
    getInventoryApi();
  }, []);

  const getInventoryApi = async () => {
    const response: IInventory[] = await getInventory()
    console.log(response)
    console.log(`${response[0].medicine.name} ${response[0].medicine.amount}${response[0].medicine.unit}`)
  }

  const getActionTable = (action: string, data: Medicine) => {
    console.log(action);
    console.log(data);

  }

  const handleConfirmDelete = () => {
    // if (medicineToDelete) {
    //   const updatedMedicines = medicines.allMedicine.filter((m) => m.id !== medicineToDelete.id)
    //   setMedicines(updatedMedicines)
      setMedicineToDelete(null)
    //   setIsDeleteDialogOpen(false)
    // }
  };

  return (
    <div className="min-h-[90vh] w-[79.5vw] pr-7 overflow-auto">
      <HeaderPages title="Inventario" Icon={MdOutlineProductionQuantityLimits} />

      {/* Barra de herramientas con filtros */}
      <div className="w-full h-fit border-b-2 border-gray-300 flex items-center pb-1 justify-end mb-4">
        <div className="flex items-center gap-4">
          <FilterComponent
            data={medicines.allMedicine}
            setDataFilter={(data) => setMedicines((prev) => { return { ...prev, medicine: data } })}
            columns={medicineColumns}
            placeholder="Buscar medicina..."
          />
        </div>
      </div>

      <div>
        <TableComponents
          data={medicines.medicine}
          column={medicineColumns}
          actionTable={getActionTable}
          colSpanColumns={true}
          isExpansible={true}
          renderRow={(medicine: Medicine, index: number) => (
            <MedicineDetails medicine={medicine} key={index}>
            </MedicineDetails>
          )}
        />

        <ConfirmDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          medicineName={medicineToDelete?.medicina}
        />

        <AlertDialog
          open={alertOpen}
          onOpenChange={setAlertOpen}
          title="Error"
          description={'Mensaje'}
        />
      </div>
    </div>
  );
};
