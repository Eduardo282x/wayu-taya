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
  const [uploading, setUploading] = useState<boolean>(false)
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const { page, size, name, setPage, setSize, setName } = useMedicineStore()
  const { data: medicinesData, isPending } = useMedicinesQuery()
  const { data: categoriesData } = useCategoriesQuery()
  const { data: formsData } = useFormsQuery()
  const createMedicine = useCreateMedicineMutation()
  const updateMedicine = useUpdateMedicineMutation()
  const deleteMedicine = useDeleteMedicineMutation()
  const queryClient = useQueryClient()

  const currentMedicines = medicinesData?.medicines ?? []
  const totalMedicines = medicinesData?.pagination?.total ?? 0

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

  const handleMedicineSubmit = async (formData: MedicineBody): Promise<boolean> => {
    try {
      const response = medicineSelected
        ? await updateMedicine.mutateAsync({ id: medicineSelected.id, data: formData })
        : await createMedicine.mutateAsync(formData)

      // El interceptor ya notifica exito/error. MedicineForm cierra y limpia solo en exito.
      return response?.success === true
    } catch {
      // El interceptor notifica el error; no se cierra el dialogo.
      return false
    }
  }

  const handleConfirmDeleteMedicine = async () => {
    if (!medicineSelected) return

    try {
      const response = await deleteMedicine.mutateAsync(medicineSelected.id)

      if (response?.success) {
        setIsDeleteDialogOpen(false)
        setMedicineSelected(null)
      }
    } catch {
      // El interceptor notifica el error; no se cierra el dialogo.
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
    link.download = `Plantilla de Carga Masiva para Medicinas ${new Date().toISOString()}.xlsx`
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
    setUploading(true);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    const response = await uploadMedicineFile(formData);

    // El interceptor ya notifica. En error NO se invalida ni se cierra.
    if (!response?.success) {
      setUploading(false);
      return;
    }

    setUploadedFile(null)
    setIsUploadOpen(false);
    queryClient.invalidateQueries({ queryKey: medicineKeys.all })
    setUploading(false);
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
  }

  return (
    <div className='px-2 lg:p-0 h-full flex flex-col'>
      {loading && (
        <ScreenLoader />
      )}
      <PageTransitionComponent toggle={isAddFormOpen}>
          <div className="h-full flex flex-col min-h-0">
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

              <div className="flex items-center gap-2">
                <input
                  type="search"
                  placeholder="Buscar medicamentos..."
                  className="w-40 lg:w-60 focus:outline-0 shadow-2xl border border-gray-400 bg-white rounded-lg h-9 placeholder:opacity-60 p-2 manrope focus:ring-1 focus:ring-[#3449D5] transition-all 100s"
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

            <div className="lg:mx-2 mt-4 flex-1 min-h-0 flex flex-col">
              <TableComponents
                column={columns.filter((item) => item.visible === true)}
                data={currentMedicines}
                actionTable={getActionTable}
                totalItems={totalMedicines}
                page={page}
                onPageChange={setPage}
                rowsPerPage={size}
                onRowsPerPageChange={setSize}
                loading={isPending}
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
                saving={uploading}
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
