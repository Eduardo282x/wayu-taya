import { MdOutlineProductionQuantityLimits } from "react-icons/md"
import { Button } from "@/components/ui/button"
import { TbMedicineSyrup } from "react-icons/tb";
import InventoryTable from "./inventory-table"
import type { Medicine } from "./types"
import { useState, useMemo, useEffect } from "react"
import InventoryForm from "./inventory-forms"
import ConfirmDeleteDialog from "./confirm-delete-dialog"
import AlertDialog from "./alert-dialog"
import { HeaderPages } from "@/pages/layout/Header";
import { getInventory } from "@/services/inventory/inventory.service";
import { IInventory } from "@/services/inventory/inventory.interface";

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
]

export const Inventory = () => {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null)

  useEffect(() => {
    getInventoryApi()
  },[]) 

  const getInventoryApi = async () => {
    const response: IInventory[] = await getInventory();
    console.log(response);
    console.log(`${response[0].medicine.name} ${response[0].medicine.amount}${response[0].medicine.unit}`);

  }

  const openCreateForm = () => {
    setEditingMedicine(null)
    setIsFormOpen(true)
  }

  const openEditForm = (medicine: Medicine) => {
    setEditingMedicine(medicine)
    setIsFormOpen(true)
  }

  // Guardar medicina (crear o editar)
  const handleMedicineSubmit = (data: Omit<Medicine, "id"> | Medicine) => {
    const medicinaExistente = medicines.some(
      (m) => m.medicina.toLowerCase() === data.medicina.toLowerCase() && ("id" in data ? m.id !== data.id : true),
    )

    if (medicinaExistente) {
      setAlertMessage("Esta medicina ya está registrada en el inventario.")
      setAlertOpen(true)
      return
    }

    // Validar fechas
    const fechaLlegada = new Date(data.fechaLlegada)
    const fechaExpiracion = new Date(data.fechaExpiracion)

    if (fechaExpiracion <= fechaLlegada) {
      setAlertMessage("La fecha de expiración debe ser posterior a la fecha de llegada.")
      setAlertOpen(true)
      return
    }

    if ("id" in data) {
      // Editar medicina existente
      setMedicines(medicines.map((m) => (m.id === data.id ? data : m)))
    } else {
      // Crear nueva medicina
      const newMedicine: Medicine = {
        id: medicines.length > 0 ? Math.max(...medicines.map((m) => m.id)) + 1 : 1,
        ...data,
      }
      setMedicines([...medicines, newMedicine])
    }
    setIsFormOpen(false)
    setEditingMedicine(null)
  }

  const filteredMedicines = useMemo(() => {
    if (!searchTerm) return medicines
    const lowerSearch = searchTerm.toLowerCase()
    return medicines.filter(
      (medicine) =>
        medicine.medicina.toLowerCase().includes(lowerSearch) || medicine.cantidad.toString().includes(lowerSearch),
    )
  }, [searchTerm, medicines])

  const handleDeleteClick = (medicine: Medicine) => {
    setMedicineToDelete(medicine)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (medicineToDelete) {
      setMedicines(medicines.filter((m) => m.id !== medicineToDelete.id))
      setMedicineToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="h-[90vh] w-[79.5vw] pr-7">
      <HeaderPages title="Inventario" Icon={MdOutlineProductionQuantityLimits}/>
      <div className="w-full h-fit border-b-2 border-gray-300 flex items-center pb-1 justify-between">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar medicina..."
          className="focus:outline-0 shadow-2xl border-1 border-gray-400 bg-gray-200 rounded-xl h-[5vh] m-2 placeholder:opacity-60 py-5 px-2 manrope focus:ring-1 focus:ring-[#3449D5] transition-all 200s w-[30%]"
        />
        <Button variant={"animated"} className="h-[90%]" onClick={openCreateForm}>
          <TbMedicineSyrup className="size-6" />
          Agregar Medicina
        </Button>
      </div>
      <div>
        <InventoryTable
          medicines={filteredMedicines}
          onEdit={openEditForm}
          onDelete={(medicineId) => {
            const medicine = medicines.find((m) => m.id === medicineId)
            if (medicine) handleDeleteClick(medicine)
          }}
        />

        <InventoryForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleMedicineSubmit}
          medicine={editingMedicine}
        />

        <ConfirmDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          medicineName={medicineToDelete?.medicina}
        />

        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen} title="Error" description={alertMessage} />
      </div>
    </div>
  )
}
