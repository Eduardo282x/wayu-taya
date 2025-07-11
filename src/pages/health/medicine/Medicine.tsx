import type { GroupMedicine, IMedicine, MedicineBody, ICategory, IForm } from "@/services/medicine/medicine.interface"
import { DropdownColumnFilter } from "@/components/table/DropdownColumnFilter"
import { TableComponents } from "@/components/table/TableComponents"
import { FilterComponent } from "@/components/table/FilterComponent"
import {
  getMedicine,
  postMedicine,
  putMedicine,
  deleteMedicine,
  getMedicineTemplate,
  getCategories,
  getForms,
  uploadMedicineFile,
} from "@/services/medicine/medicine.service"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import type { Column } from "@/components/table/table.interface"
import { MedicineForm } from "./MedicineForm"
import { HeaderPages } from "@/pages/layout/Header"
import { medicineColumns } from "./medicine.data"
import { Button } from "@/components/ui/button"
import { GiMedicines } from "react-icons/gi"
import { useEffect, useState } from "react"
import { FaPills } from "react-icons/fa"
import ConfirmDeleteMedicineDialog from "./ConfirmDeleteMedicineDialog"
import { FaDownload, FaUpload } from "react-icons/fa6"
import { UploadMedicineDialog } from "./UploadMedicineDialog"

export const Medicine = () => {
  const [medicines, setMedicines] = useState<GroupMedicine>({ allMedicine: [], medicine: [] })
  const [medicineSelected, setMedicineSelected] = useState<IMedicine | null>(null)
  const [columns, setColumns] = useState<Column[]>(medicineColumns)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categories, setCategories] = useState<ICategory[]>([])
  const [forms, setForms] = useState<IForm[]>([])

  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  useEffect(() => {
    getMedicineApi()
    getCategoriesAndForms()
  }, [])

  const getMedicineApi = async () => {
    setLoading(true)
    try {
      const response: IMedicine[] = await getMedicine()
      setMedicines({ allMedicine: response, medicine: response })
    } catch (err) {
      console.error("Error al obtener medicamentos:", err)
    }
    setLoading(false)
  }

  const getCategoriesAndForms = async () => {
    try {
      const responseCategory: ICategory[] = await getCategories()
      setCategories(responseCategory)
      const responseForms: IForm[] = await getForms()
      setForms(responseForms)
    } catch (error) {
      console.error("Error al cargar categorías o formas:", error)
    }
  }

  const openAddForm = () => {
    setMedicineSelected(null)
    setIsAddFormOpen(true)
  }

  const handleMedicineSubmit = async (formData: MedicineBody) => {
    setLoading(true)
    try {
      if (medicineSelected) {
        await putMedicine(medicineSelected.id, formData)
      } else {
        await postMedicine(formData)
      }
      setIsAddFormOpen(false)
      await getMedicineApi()
    } catch (error) {
      console.error("Error al guardar el medicamento:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDeleteMedicine = async () => {
    if (medicineSelected) {
      setLoading(true)
      try {
        await deleteMedicine(medicineSelected.id)
        await getMedicineApi()
        setIsDeleteDialogOpen(false)
        setMedicineSelected(null)
      } catch (error) {
        console.error("Error al eliminar el medicamento:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const setMedicineFilter = (filteredMedicines: IMedicine[]) => {
    setMedicines((prev) => ({ ...prev, medicine: filteredMedicines }))
  }

  const getActionTable = (action: string, data: IMedicine) => {
    setMedicineSelected(data)
    if (action === "edit") {
      setIsAddFormOpen(true)
    }
    if (action === "delete") {
      setIsDeleteDialogOpen(true)
    }
  }
  const downloadTemplate = async () => {
    setLoading(true)
    const response = await getMedicineTemplate()
    const url = URL.createObjectURL(response)
    const link = window.document.createElement("a")
    link.href = url
    link.download = `Plantilla excel`
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setLoading(false)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setUploadedFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFile(file)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSaveMedicineFile = async () => {
    if (!uploadedFile) return
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', uploadedFile);
    
    await uploadMedicineFile(formData);
    setUploadedFile(null)
    setIsUploadOpen(false);
    getMedicineApi();
    setLoading(false);
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
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

          <Button onClick={downloadTemplate} variant={"animatedNormal"} className="bg-green-700">
            <FaDownload /> Descargar plantilla
          </Button>
          <Button onClick={() => setIsUploadOpen(true)} variant={"animatedNormal"} className="bg-green-700">
            <FaUpload />
            Cargar datos
          </Button>
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
        onSubmit={handleMedicineSubmit}
        medicineData={medicineSelected}
        categories={categories}
        forms={forms}
      />

      <ConfirmDeleteMedicineDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDeleteMedicine}
        medicineName={medicineSelected?.name}
      />

      {isUploadOpen && (
        <UploadMedicineDialog
          isUploadOpen={isUploadOpen}
          setIsUploadOpen={setIsUploadOpen}
          dragActive={dragActive}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          handleFileInput={handleFileInput}
          formatFileSize={formatFileSize}
          uploadedFile={uploadedFile}
          handleSaveMedicineFile={handleSaveMedicineFile}
          removeUploadedFile={removeUploadedFile}
        />
      )}
    </>
  )
}
