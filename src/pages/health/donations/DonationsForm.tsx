import { DonationBody, DonationMedicine, DonationType, IDonations } from "@/services/donations/donations.interface"
import FormInputCustom from "@/components/formInput/FormInputCustom"
import { Button } from "@/components/ui/button"
import { StyledDialogFooter } from "@/components/StyledDialog/StyledDialog"
import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { IProviders } from "@/services/provider/provider.interface"
import FormSelectCustom from "@/components/formInput/FormSelectCustom"
import { FormAutocompleteV2 } from "@/components/formInput/FormAutoCompleteCustomV2"
import { IStore } from "@/services/store/store.interface"
import { IMedicine } from "@/services/medicine/medicine.interface"
import { IInstitution } from "@/services/institution/institution.interface"
import { DonationTypeForm } from "./donations.data"

interface DonationsFormProps {
  donation: IDonations | null;
  providers: IProviders[];
  stores: IStore[];
  medicines: IMedicine[];
  institutions: IInstitution[];
  onSave: (donation: DonationBody) => void
  onCancel: () => void
}

export const DonationsForm = ({ donation, providers, stores, medicines, institutions, onSave, onCancel }: DonationsFormProps) => {
  // const [medicineFilter, setMedicineFilter] = useState<IMedicine[]>([]);
  const today = new Date();
  const defaultDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
  // const defaultTime = today.toTimeString().slice(0, 5); // "HH:mm"

  const { register, handleSubmit, reset, watch, setValue, getValues } = useForm<DonationBody>({
    defaultValues: {
      providerId: 0,
      institutionId: 0,
      type: "Entrada",
      lote: "",
      date: defaultDate,
      medicines: []
    },
  })

  const typeDonation = watch("type");

  useEffect(() => {
    console.log(typeDonation);
  }, [typeDonation])

  const [medicineDetails, setMedicineDetails] = useState<DonationMedicine[]>([
    {
      medicineId: 0,
      amount: 0,
      storageId: 0,
      admissionDate: new Date(),
      expirationDate: new Date(),
    },
  ])

  useEffect(() => {
    if (donation) {
      reset({
        providerId: donation.type === 'Entrada' ? Number(donation.providerId) : 0,
        institutionId: donation.type === 'Salida' ? Number(donation.institutionId) : 0,
        type: donation.type as DonationType || "Entrada",
        lote: donation.lote,
        date: new Date(donation.date).toISOString().split('T')[0],
      });

      if (donation.detDonation && donation.detDonation.length > 0) {
        setMedicineDetails(
          donation.detDonation.map((det) => ({
            medicineId: det.medicine?.id || 0,
            amount: det.amount || 0,
            storageId: 0,
            admissionDate: new Date(det.admissionDate),
            expirationDate: new Date(det.expirationDate)
          })),
        )
      }
    }
  }, [donation])

  const handleMedicineDetailChange = (index: number, field: DonationTypeForm, value: string | number) => {
    console.log(value);

    setMedicineDetails((prev) => prev.map((detail, i) => (i === index ? { ...detail, [field]: value } : detail)))
  }

  const addMedicineDetail = () => {
    setMedicineDetails((prev) => [
      ...prev,
      {
        medicineId: 0,
        amount: 0,
        storageId: 0,
        admissionDate: defaultDate,
        expirationDate: defaultDate,
      },
    ])
  }

  const removeMedicineDetail = (index: number) => {
    if (medicineDetails.length > 1) {
      setMedicineDetails((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const onSubmit = (data: DonationBody) => {
    const parseData = {
      providerId: data.providerId == 0 ? null : Number(data.providerId),
      institutionId: data.institutionId == 0 ? null : Number(data.institutionId),
      type: data.type,
      lote: data.lote,
      date: new Date(data.date),
      medicines: medicineDetails.map(det => {
        return {
          ...det,
          admissionDate: new Date(det.admissionDate),
          expirationDate: new Date(det.expirationDate),
        }
      })
    };
    onSave(parseData);
  }

  const filteredOptions = (detail: DonationMedicine, index: number): { value: string; label: string }[] => {
    return medicines
      .filter(med => {
        // Obtén los ids seleccionados en otros campos (excepto el actual)
        const selectedIds = medicineDetails
          .filter((_, i) => i !== index)
          .map(item => item.medicineId?.toString());
        // Muestra la opción si:
        // - No está seleccionada en otro campo
        // - O es la seleccionada actualmente en este campo
        return (
          !selectedIds.includes(med.id.toString()) ||
          med.id.toString() === detail.medicineId?.toString()
        );
      })
      .map(med => ({
        value: med.id.toString(),
        label: `${med.name} ${med.amount}${med.unit}`,
      }))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent">
          Información General
        </h3>

        <div className="flex items-center justify-around gap-4 bg-white rounded-2xl p-4">
          <div className="w-60">
            <FormSelectCustom
              label="Tipo"
              id="type"
              {...register("type")}
              options={[
                { value: "Entrada", label: "Entrada" },
                { value: "Salida", label: "Salida" }
              ]}
            />
          </div>

          <div className="w-full">
            {typeDonation == 'Entrada' ?
              <FormAutocompleteV2
                label="Proveedor"
                placeholder="Selecciona un proveedor"
                valueDefault={Number(getValues('providerId'))}
                data={providers.map(provider => ({
                  value: provider.id.toString(),
                  label: provider.name,
                }))}
                onChange={(value) => setValue('providerId', Number(value))}
              />
              :
              <FormAutocompleteV2
                label="Institución"
                placeholder="Selecciona una institución"
                valueDefault={Number(getValues('institutionId'))}
                data={institutions.map(institution => ({
                  value: institution.id.toString(),
                  label: institution.name,
                }))}
                onChange={(value) => setValue('institutionId', Number(value))}
              />
            }
          </div>

          <FormInputCustom
            label="Lote"
            id="lote"
            {...register("lote")}
            placeholder="Lote"
          />

          <FormInputCustom
            label="Fecha"
            id="date"
            type="date"
            {...register("date")}
          />
        </div>
      </div>

      <div className="space-y-2">
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

            <div className="flex items-center justify-around gap-4">
              <div className="w-60">
                <FormAutocompleteV2
                  label="Medicina"
                  placeholder="Nombre de la medicina"
                  data={filteredOptions(detail, index)}
                  valueDefault={detail.medicineId}
                  onChange={(value) => handleMedicineDetailChange(index, "medicineId", Number(value))}
                />
              </div>
              <div className="w-20">
                <FormInputCustom
                  label="Cantidad"
                  id={`amount-${index}`}
                  type="number"
                  value={detail.amount.toString()}
                  onChange={(e) => handleMedicineDetailChange(index, "amount", Number.parseInt(e.target.value) || 0)}
                  placeholder="Cantidad"
                />
              </div>
              <div className="w-40">
                <FormSelectCustom
                  label="Almacén"
                  id={`store-${index}`}
                  options={stores.map(store => {
                    return {
                      label: `${store.name} ${store.address}`,
                      value: store.id.toString()
                    }
                  })}
                  onChange={(value) => handleMedicineDetailChange(index, "storageId", Number(value.target.value))}
                />
              </div>
              <FormInputCustom
                label="Fecha de Ingreso"
                id={`admissionDate-${index}`}
                type="date"
                value={detail.admissionDate.toLocaleString()}
                onChange={(e) => handleMedicineDetailChange(index, "admissionDate", e.target.value)}
              />
              <FormInputCustom
                label="Fecha de Expiración"
                id={`expirationDate-${index}`}
                type="date"
                value={detail.expirationDate.toLocaleString()}
                onChange={(e) => handleMedicineDetailChange(index, "expirationDate", e.target.value)}
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
