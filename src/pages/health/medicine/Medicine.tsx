import type React from "react"

import type { GroupMedicine, IMedicine, MedicineBody, Category, Form } from "@/services/medicine/medicine.interface"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"

export const Medicine = () => {
  const [medicines, setMedicines] = useState<GroupMedicine>({ allMedicine: [], medicine: [] })
  const [medicineSelected, setMedicineSelected] = useState<IMedicine | null>(null)
  const [columns, setColumns] = useState<Column[]>(medicineColumns)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [forms, setForms] = useState<Form[]>([])

  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedDescription, setSelectedDescription] = useState("")

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
      const responseCategory: Category[] = await getCategories()
      setCategories(responseCategory)
      const responseForms: Form[] = await getForms()
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
    const response = await getMedicineTemplate()
    const url = URL.createObjectURL(response)
    const link = window.document.createElement("a")
    link.href = url
    link.download = `Plantilla excel`
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
    URL.revokeObjectURL(url)
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

  const handleSaveMedicineFile = () => {
    if (!uploadedFile) return

    console.log("Procesando archivo de medicinas:", uploadedFile.name)
    console.log("Descripción:", selectedDescription)

    setUploadedFile(null)
    setSelectedDescription("")
    setIsUploadOpen(false)

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
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cargar datos de medicinas</DialogTitle>
              <DialogDescription>Sube un archivo Excel con los datos de las medicinas</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-blue-800 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Arrastra tu archivo aquí</p>
                <p className="text-sm text-gray-500 mb-4">o haz clic para seleccionar un archivo Excel</p>
                <input
                  type="file"
                  className="hidden"
                  id="medicine-file-upload"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileInput}
                />
                <Label
                  htmlFor="medicine-file-upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 cursor-pointer"
                >
                  Seleccionar archivo
                </Label>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Descripción del archivo</Label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 text-sm"
                  rows={3}
                  value={selectedDescription}
                  onChange={(e) => setSelectedDescription(e.target.value)}
                  placeholder="Describe el contenido del archivo de medicinas..."
                />
              </div>

              {uploadedFile && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <FaPills className="text-blue-800" size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeUploadedFile} className="h-8 w-8 p-0">
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveMedicineFile}
                  disabled={!uploadedFile}
                  className="bg-blue-800 hover:bg-blue-900"
                >
                  Cargar medicinas
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
