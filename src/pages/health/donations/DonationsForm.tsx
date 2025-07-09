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
import { IInventory } from "@/services/inventory/inventory.interface"
import { formatDate } from "@/utils/formatters"

interface DonationsFormProps {
  donation: IDonations | null;
  providers: IProviders[];
  stores: IStore[];
  inventory: IInventory[];
  medicines: IMedicine[];
  institutions: IInstitution[];
  onSave: (donation: DonationBody) => void
  onCancel: () => void
}

export const DonationsForm = ({ donation, providers, stores, inventory, medicines, institutions, onSave, onCancel }: DonationsFormProps) => {
  // const [medicineFilter, setMedicineFilter] = useState<IMedicine[]>([]);
  const today = new Date();
  const defaultDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
  const [alert, setAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
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

  const [medicineDetails, setMedicineDetails] = useState<DonationMedicine[]>([
    {
      id: 1,
      medicineId: 0,
      details: [{
        amount: 0,
        storageId: 0,
        lote: ''
      }],
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
          donation.detDonation.map((det, index: number) => ({
            id: index + 1,
            medicineId: det.medicine?.id || 0,
            details: [{
              amount: det.amount || 0,
              storageId: 0,
            }],
            admissionDate: new Date(det.admissionDate),
            expirationDate: new Date(det.expirationDate)
          })),
        )
      }
    }
  }, [donation])

  const handleMedicineDetailChange = (index: number, field: DonationTypeForm, value: string | number, indexDet?: number) => {
    setMedicineDetails((prev) => prev.map((detail, i) => {
      if (i !== index) return detail;

      // Si se pasa indexDet, actualiza el campo dentro de details
      if (indexDet !== undefined) {
        return {
          ...detail,
          details: detail.details.map((det, j) =>
            j === indexDet ? { ...det, [field]: value } : det
          ),
        };
      }

      // Si no, actualiza el campo directo del objeto
      return { ...detail, [field]: value };
    })
    )

  }

  const addMedicineDetail = () => {
    setMedicineDetails((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        medicineId: 0,
        details: [{
          amount: 0,
          storageId: 0,
        }],
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

  const removeMedicineDetailAmountStorage = (medicineIndex: number, detailIndex: number) => {
    setMedicineDetails((prev) =>
      prev.map((detail, i) =>
        i === medicineIndex
          ? {
            ...detail,
            details: detail.details.filter((_, j) => j !== detailIndex),
          }
          : detail
      )
    );
  };

  const addMedicineDetailAmountStorage = (index: number) => {
    setMedicineDetails((prev) =>
      prev.map((detail, i) =>
        i === index
          ? {
            ...detail,
            details: [
              ...detail.details,
              {
                amount: 0,
                storageId: 0,
              },
            ],
          }
          : detail
      )
    );
  }

  const onSubmit = (data: DonationBody) => {
    if (data.lote == '' || data.date == '') {
      setAlert(true)
      setMessage('Alguno de los campos esta vacio.')
      return;
    }

    const parseMedicineDetails = medicineDetails.map(item =>
      item.details.map(det => {
        return {
          ...item,
          ...det
        }
      }).flat()
    ).flat()

    const parseData = {
      providerId: data.providerId == 0 ? null : Number(data.providerId),
      institutionId: data.institutionId == 0 ? null : Number(data.institutionId),
      type: data.type,
      lote: data.lote,
      date: new Date(data.date),
      medicines: parseMedicineDetails.map(det => {
        return {
          ...det,
          storageId: det.storageId == 0 ? 1 : det.storageId,
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

  const filteredOptionsExit = (detail: DonationMedicine, index: number): { value: string; label: string }[] => {
    return inventory
      .filter(inv => {
        // Obtén los ids seleccionados en otros campos (excepto el actual)
        const selectedIds = medicineDetails
          .filter((_, i) => i !== index)
          .map(item => item.medicineId?.toString());
        // Muestra la opción si:
        // - No está seleccionada en otro campo
        // - O es la seleccionada actualmente en este campo
        return (
          !selectedIds.includes(inv.medicine.id.toString()) ||
          inv.medicine.id.toString() === detail.medicineId?.toString()
        );
      })
      .map(med => ({
        value: med.medicine.id.toString(),
        label: `${med.medicine.name} ${med.medicine.amount}${med.medicine.unit}`,
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

        {typeDonation == 'Entrada'
          ?
          medicineDetails.map((detail, index) => (
            <DonationDetailFormEntry
              key={index}
              addMedicineDetailAmountStorage={addMedicineDetailAmountStorage}
              removeMedicineDetail={removeMedicineDetail}
              filteredOptions={filteredOptions}
              index={index}
              detail={detail}
              medicineDetails={medicineDetails}
              stores={stores}
              handleMedicineDetailChange={handleMedicineDetailChange}
              removeMedicineDetailAmountStorage={removeMedicineDetailAmountStorage}
            />
          ))
          :
          medicineDetails.map((detail, index) => (
            <DonationDetailFormExit
              key={index}
              addMedicineDetailAmountStorage={addMedicineDetailAmountStorage}
              removeMedicineDetail={removeMedicineDetail}
              filteredOptions={filteredOptionsExit}
              index={index}
              detail={detail}
              inventory={inventory}
              medicineDetails={medicineDetails}
              stores={stores}
              handleMedicineDetailChange={handleMedicineDetailChange}
              removeMedicineDetailAmountStorage={removeMedicineDetailAmountStorage}
            />
          ))
        }

      </div>

      <StyledDialogFooter className="flex justify-between pt-4 w-full ">
        <div className=" w-1/2">
          {alert && (
            <p className="text-red-600 font-semibold">{message}</p>
          )}
        </div>

        <div className="flex gap-2 w-1/2 justify-end">
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
        </div>
      </StyledDialogFooter>
    </form>
  )
}

interface DonationDetailFormEntryProps {
  addMedicineDetailAmountStorage: (index: number) => void
  removeMedicineDetail: (index: number) => void
  filteredOptions: (detail: DonationMedicine, index: number) => { value: string; label: string }[],
  index: number;
  detail: DonationMedicine;
  medicineDetails: DonationMedicine[];
  stores: IStore[];
  handleMedicineDetailChange: (index: number, field: DonationTypeForm, value: string | number, indexDet?: number) => void;
  removeMedicineDetailAmountStorage: (medicineIndex: number, detailIndex: number) => void;
}
const DonationDetailFormEntry = ({
  addMedicineDetailAmountStorage,
  removeMedicineDetail,
  filteredOptions,
  index,
  medicineDetails,
  detail,
  stores,
  handleMedicineDetailChange,
  removeMedicineDetailAmountStorage
}: DonationDetailFormEntryProps) => {
  return (
    <div className="border border-gray-400 rounded-lg p-4 space-y-4 bg-white">
      <div className="grid grid-cols-3">
        <h4 className="font-medium bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent">Medicina {index + 1}</h4>
        <div className="flex items-center justify-end">
          <Button onClick={() => addMedicineDetailAmountStorage(index)} className="w-40 mr-18" type="button">Agregar almacén</Button>
        </div>
        {medicineDetails.length > 1 && (
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => removeMedicineDetail(index)}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-start justify-around gap-4">
        <div className="w-60">
          <FormAutocompleteV2
            label="Medicina"
            placeholder="Nombre de la medicina"
            data={filteredOptions(detail, index)}
            valueDefault={detail.medicineId}
            onChange={(value) => handleMedicineDetailChange(index, "medicineId", Number(value))}
          />
        </div>
        <div className="flex flex-col gap-2">
          {detail.details && detail.details.map((det, indexDet: number) => (
            <div className="flex items-center gap-2 relative" key={indexDet}>
              <div className="w-20">
                <FormInputCustom
                  label="Cantidad"
                  id={`amount-${index}-${indexDet}`}
                  type="number"
                  value={det.amount.toString()}
                  onChange={(e) => handleMedicineDetailChange(index, "amount", Number.parseInt(e.target.value) || 0, indexDet)}
                  placeholder="Cantidad"
                />
              </div>
              <div className="w-40">
                <FormSelectCustom
                  label="Almacén"
                  id={`store-${index}-${indexDet}`}
                  options={stores.map(store => {
                    return {
                      label: `${store.name} ${store.address}`,
                      value: store.id.toString()
                    }
                  })}
                  onChange={(value) => handleMedicineDetailChange(index, "storageId", Number(value.target.value), indexDet)}
                />
              </div>

              {detail.details.length > 1 && indexDet != 0 &&
                <div className="absolute top-2 -right-2">
                  <button
                    onClick={() => removeMedicineDetailAmountStorage(index, indexDet)}
                    type="button"
                    className="cursor-pointer rounded-full bg-red-800 text-white text-center w-5 h-5 text-xs">X</button>
                </div>
              }
            </div>
          ))}
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
  )
}


interface DonationDetailFormExitProps extends DonationDetailFormEntryProps {
  inventory: IInventory[];
}
const DonationDetailFormExit = ({
  addMedicineDetailAmountStorage,
  removeMedicineDetail,
  filteredOptions,
  index,
  medicineDetails,
  detail,
  // stores,
  inventory,
  handleMedicineDetailChange,
  removeMedicineDetailAmountStorage
}: DonationDetailFormExitProps) => {

  const [medicineSelected, setMedicineSelected] = useState<IInventory | null>(null);
  const changeMedicine = (value: string) => {

    const setInventory = inventory.find(item => item.medicine.id == Number(value));
    if (setInventory) {
      setMedicineSelected(setInventory);
    }

    handleMedicineDetailChange(index, "medicineId", Number(value))
  }

  return (
    <div className="border border-gray-400 rounded-lg p-4 space-y-4 bg-white">
      <div className="grid grid-cols-3">
        <h4 className="font-medium bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent">Medicina {index + 1}</h4>
        {medicineSelected && medicineSelected.stores.length > 1 && (
          <div className="flex items-center justify-end">
            <Button onClick={() => addMedicineDetailAmountStorage(index)} className="w-40 mr-18" type="button">Agregar almacén</Button>
          </div>
        )}
        {medicineDetails.length > 1 && (
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => removeMedicineDetail(index)}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-start justify-around gap-4">
        <div className="w-60">
          <FormAutocompleteV2
            label="Medicina"
            placeholder="Nombre de la medicina"
            data={filteredOptions(detail, index)}
            valueDefault={detail.medicineId}
            onChange={(value) => changeMedicine(value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          {detail.details.map((det, indexDet: number) => {

            return (
              <div className="flex items-center gap-4 relative" key={indexDet}>
                <div className="w-20">
                  <FormInputCustom
                    label="Cantidad"
                    id={`amount-${index}-${indexDet}`}
                    type="number"

                    value={det.amount.toString()}
                    onChange={(e) =>
                      handleMedicineDetailChange(index, "amount", Number(e.target.value), indexDet)
                    }
                    placeholder="Cantidad"
                  />
                </div>

                <div className="w-40">
                  <FormSelectCustom
                    label="Almacén"
                    id={`store-${index}-${indexDet}`}
                    options={medicineSelected ? medicineSelected.stores.map(store => ({
                      label: `${store.name} ${store.address}`,
                      value: store.id.toString(),
                    })) : []}
                    onChange={(value) =>
                      handleMedicineDetailChange(index, "storageId", Number(value.target.value), indexDet)
                    }
                  />
                </div>

                <div className="w-40">
                  <FormSelectCustom
                    label="Lote"
                    id={`lote-${index}-${indexDet}`}
                    options={medicineSelected ? medicineSelected.lotes.map(lo => ({
                      label: lo.name,
                      value: lo.name.toString(),
                    })) : []}
                    onChange={(value) =>
                      handleMedicineDetailChange(index, "lote", value.target.value, indexDet)
                    }
                  />
                </div>

                {/* Mostrar fecha de expiración */}
                <div className="w-40">
                  <FormInputCustom
                    label="Expira"
                    id={`fecha-${index}-${indexDet}`}
                    value={medicineSelected ? formatDate(medicineSelected.datesMedicine[0].expirationDate.toString()) : ''}
                    readOnly
                  />
                </div>

                {detail.details.length > 1 && indexDet !== 0 && (
                  <div className="absolute top-0 right-0">
                    <button
                      onClick={() => removeMedicineDetailAmountStorage(index, indexDet)}
                      type="button"
                      className="cursor-pointer rounded-full bg-red-800 text-white text-center w-5 h-5 text-xs"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  )
}
