import type React from "react"
import type { IDonations } from "@/services/donations/donations.interface"
import FormInputCustom from "@/components/formInput/FormInputCustom"
import { Button } from "@/components/ui/button"
import { StyledDialogFooter } from "@/components/StyledDialog/StyledDialog"
import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"

interface DonationsFormProps {
  donation: IDonations | null
  onSave: () => void
  onCancel: () => void
}

interface MedicineDetail {
  medicineId: string
  medicineName: string
  amount: number
  admissionDate: string
  expirationDate: string
}

export const DonationsForm = ({ donation, onSave, onCancel }: DonationsFormProps) => {
  const [formData, setFormData] = useState({
    providerName: "",
    type: "",
    lote: "",
    date: "",
  })

  const [medicineDetails, setMedicineDetails] = useState<MedicineDetail[]>([
    {
      medicineId: "",
      medicineName: "",
      amount: 0,
      admissionDate: "",
      expirationDate: "",
    },
  ])

  useEffect(() => {
    if (donation) {
      setFormData({
        providerName: donation.provider?.name || "",
        type: donation.type || "",
        lote: donation.lote || "",
        date: donation.date ? new Date(donation.date).toISOString().split("T")[0] : "",
      })

      if (donation.detDonation && donation.detDonation.length > 0) {
        setMedicineDetails(
          donation.detDonation.map((det) => ({
            medicineId: det.medicine?.id?.toString() || "",
            medicineName: det.medicine?.name || "",
            amount: det.amount || 0,
            admissionDate: det.admissionDate ? new Date(det.admissionDate).toISOString().split("T")[0] : "",
            expirationDate: det.expirationDate ? new Date(det.expirationDate).toISOString().split("T")[0] : "",
          })),
        )
      }
    }
  }, [donation])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleMedicineDetailChange = (index: number, field: string, value: string | number) => {
    setMedicineDetails((prev) => prev.map((detail, i) => (i === index ? { ...detail, [field]: value } : detail)))
  }

  const addMedicineDetail = () => {
    setMedicineDetails((prev) => [
      ...prev,
      {
        medicineId: "",
        medicineName: "",
        amount: 0,
        admissionDate: "",
        expirationDate: "",
      },
    ])
  }

  const removeMedicineDetail = (index: number) => {
    if (medicineDetails.length > 1) {
      setMedicineDetails((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica para enviar los datos al servidor
    console.log("Datos del formulario:", { formData, medicineDetails })
    onSave()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent">
          Información General
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInputCustom
            label="Proveedor"
            id="providerName"
            value={formData.providerName}
            onChange={(e) => handleInputChange("providerName", e.target.value)}
            placeholder="Nombre del proveedor"
            required
          />

          <FormInputCustom
            label="Tipo"
            id="type"
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            placeholder="Tipo de donación"
            required
          />

          <FormInputCustom
            label="Lote"
            id="lote"
            value={formData.lote}
            onChange={(e) => handleInputChange("lote", e.target.value)}
            placeholder="Número de lote"
            required
          />

          <FormInputCustom
            label="Fecha"
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            required
          />
        </div>
      </div>

      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent">
            Detalles de Medicinas
          </h3>
          <Button
            type="button"
            variant={'animated'}
            onClick={addMedicineDetail}
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar Medicina
          </Button>
        </div>

        {medicineDetails.map((detail, index) => (
          <div key={index} className="border border-gray-400 rounded-lg p-4 space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <h4 className="font-medium bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent">Medicina {index + 1}</h4>
              {medicineDetails.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeMedicineDetail(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInputCustom
                label="ID de Medicina"
                id={`medicineId-${index}`}
                value={detail.medicineId}
                onChange={(e) => handleMedicineDetailChange(index, "medicineId", e.target.value)}
                placeholder="ID de la medicina"
                required
              />
              <FormInputCustom
                label="Nombre de Medicina"
                id={`medicineName-${index}`}
                value={detail.medicineName}
                onChange={(e) => handleMedicineDetailChange(index, "medicineName", e.target.value)}
                placeholder="Nombre de la medicina"
                required
              />
              <FormInputCustom
                label="Cantidad"
                id={`amount-${index}`}
                type="number"
                value={detail.amount.toString()}
                onChange={(e) => handleMedicineDetailChange(index, "amount", Number.parseInt(e.target.value) || 0)}
                placeholder="Cantidad"
                min="1"
                required
              />
              <div></div> 
              <FormInputCustom
                label="Fecha de Ingreso"
                id={`admissionDate-${index}`}
                type="date"
                value={detail.admissionDate}
                onChange={(e) => handleMedicineDetailChange(index, "admissionDate", e.target.value)}
                required
              />
              <FormInputCustom
                label="Fecha de Expiración"
                id={`expirationDate-${index}`}
                type="date"
                value={detail.expirationDate}
                onChange={(e) => handleMedicineDetailChange(index, "expirationDate", e.target.value)}
                required
              />
            </div>
          </div>
        ))}
      </div>

      <StyledDialogFooter className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant={'destructive'}
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" variant={'animated'}>
          {donation ? "Actualizar" : "Registrar"} Donación
        </Button>
      </StyledDialogFooter>
    </form>
  )
}
