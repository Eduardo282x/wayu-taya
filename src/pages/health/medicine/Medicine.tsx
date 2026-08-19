import type { IMedicine, MedicineBody } from "@/services/medicine/medicine.interface"
import { DropdownColumnFilter } from "@/components/table/DropdownColumnFilter"
import { TableComponents } from "@/components/table/TableComponents"
import {
  getMedicineTemplate,
  uploadMedicineFile,
} from "@/services/medicine/medicine.service"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import type { Column } from "@/components/table/table.interface"
import { MedicineForm } from "./MedicineForm"
import PageTransitionComponent from "@/components/PageTransition"
import { HeaderPages } from "@/layout/header/Header"
import { medicineColumns } from "./medicine.data"
import { Button } from "@/components/ui/button"
import { GiMedicines } from "react-icons/gi"
import { useEffect, useMemo, useState } from "react"
import { FaPills } from "react-icons/fa"
import ConfirmDeleteMedicineDialog from "./ConfirmDeleteMedicineDialog"
import { FaDownload, FaUpload } from "react-icons/fa6"
import { UploadMedicineDialog } from "./UploadMedicineDialog"
import {
  useMedicinesQuery,
  useCategoriesQuery,
  useFormsQuery,
  useCreateMedicineMutation,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
  medicineKeys,
} from "./medicine.hook"
import { useMedicineStore } from "./medicineStore"
import { useQueryClient } from "@tanstack/react-query"
import { debounce } from "@/lib/debounce"

export const Medicine = () => {
  const [medicineSelected, setMedicineSelected] = useState<IMedicine | null>(null)
  const [columns, setColumns] = useState<Column[]>(medicineColumns)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const { page, size, name, setPage, setSize, setName } = useMedicineStore()
  const { data: medicinesData, isFetching } = useMedicinesQuery()
  const { data: categoriesData } = useCategoriesQuery()
  const { data: formsData } = useFormsQuery()
  const createMedicine = useCreateMedicineMutation()
  const updateMedicine = useUpdateMedicineMutation()
  const deleteMedicine = useDeleteMedicineMutation()
  const queryClient = useQueryClient()

  const currentMedicines = medicinesData?.medicines ?? []
  const totalMedicines = medicinesData?.total ?? 0

  const [searchMedicine, setSearchMedicine] = useState<string>(name)

  const debouncedName = useMemo(
    () => debounce((value: string) => setName(value), 300),
    []
  )

  useEffect(() => {
    setSearchMedicine(name)
  }, [name])

  const openAddForm = () => {
    setMedicineSelected(null)
    setIsAddFormOpen(true)
  }

  const handleMedicineSubmit = async (formData: MedicineBody) => {
    try {
      if (medicineSelected) {
        await updateMedicine.mutateAsync({ id: medicineSelected.id, data: formData })
      } else {
        await createMedicine.mutateAsync(formData)
      }
      setIsAddFormOpen(false)
    } catch (error) {
      console.error("Error al guardar el medicamento:", error)
    }
  }

  const handleConfirmDeleteMedicine = async () => {
    if (medicineSelected) {
      try {
        await deleteMedicine.mutateAsync(medicineSelected.id)
        setIsDeleteDialogOpen(false)
        setMedicineSelected(null)
      } catch (error) {
        console.error("Error al eliminar el medicamento:", error)
      }
    }
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
    queryClient.invalidateQueries({ queryKey: medicineKeys.all })
    setLoading(false);
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
  }

  return (
    <div className='px-3 lg:p-0 h-full flex flex-col'>
      {loading && (
        <ScreenLoader />
      )}
      <PageTransitionComponent toggle={isAddFormOpen}>
          <div className="h-full overflow-auto">
            <HeaderPages title="Medicamentos" Icon={FaPills} />

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
                <input
                  type="search"
                  placeholder="Buscar medicamentos..."
                  className="w-40 lg:w-60 focus:outline-0 shadow-2xl border-1 border-gray-400 bg-white rounded-lg h-9 placeholder:opacity-60 p-2 manrope focus:ring-1 focus:ring-[#3449D5] transition-all 100s"
                  value={searchMedicine}
                  onChange={(e) => {
                    setSearchMedicine(e.target.value)
                    debouncedName(e.target.value)
                  }}
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
                data={currentMedicines}
                actionTable={getActionTable}
                totalItems={totalMedicines}
                page={page}
                onPageChange={setPage}
                rowsPerPage={size}
                onRowsPerPageChange={setSize}
                loading={isFetching}
              />
            </div>

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
          </div>

          <div className="h-full px-2">
            <MedicineForm
              open={isAddFormOpen}
              onOpenChange={setIsAddFormOpen}
              onSubmit={handleMedicineSubmit}
              medicineData={medicineSelected}
              categories={categoriesData?.categories ?? []}
              forms={formsData?.forms ?? []}
              ignoreHeader={false}
            />
          </div>
      </PageTransitionComponent>
    </div>
  )
}
