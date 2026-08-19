import { DonationBody, DonationMedicine, TypeDonation, IDonations } from "@/services/donations/donations.interface"
import FormInputCustom from "@/components/formInput/FormInputCustom"
import { Button } from "@/components/ui/button"
import { FaArrowLeft } from "react-icons/fa"
import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { IProviders } from "@/services/provider/provider.interface"
import FormSelectCustom from "@/components/formInput/FormSelectCustom"
import { FormAutocompleteV2 } from "@/components/formInput/FormAutoCompleteCustomV2"
import { IStore } from "@/services/store/store.interface"
import { IMedicine, MedicineBody, Category, Form } from "@/services/medicine/medicine.interface"
import { getCategories, getForms, postMedicine } from "@/services/medicine/medicine.service"
import { IInstitution } from "@/services/institution/institution.interface"
import { DonationTypeForm } from "./donations.data"
import { IInventory } from "@/services/inventory/inventory.interface"
import { formatDate, formatDateForInput } from "@/utils/formatters"
import { IoMdAdd } from "react-icons/io";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogHeader,
  StyledDialogTitle,
  StyledDialogDescription,
} from "@/components/StyledDialog/StyledDialog"
import { MedicineForm } from "../medicine/MedicineForm"
export interface SaveDonationResult {
  success: boolean;
  message?: string;
}

interface DonationsFormProps {
  donation: IDonations | null;
  providers: IProviders[];
  stores: IStore[];
  inventory: IInventory[];
  medicines: IMedicine[];
  institutions: IInstitution[];
  onSave: (donation: DonationBody) => Promise<SaveDonationResult>
  onCancel: () => void
}

export const DonationsForm = ({ donation, providers, stores, inventory, medicines, institutions, onSave, onCancel }: DonationsFormProps) => {
  // const [medicineFilter, setMedicineFilter] = useState<IMedicine[]>([]);
  const today = new Date();
  const defaultDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
  const [alert, setAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [medicineFormOpen, setMedicineFormOpen] = useState<boolean>(false);
  const [medicineFormIndex, setMedicineFormIndex] = useState<number | null>(null);
  const [createdMedicines, setCreatedMedicines] = useState<IMedicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  // const defaultTime = today.toTimeString().slice(0, 5); // "HH:mm"

  const { register, handleSubmit, reset, watch, setValue, getValues } = useForm<DonationBody & { storeId: number }>({
    defaultValues: {
      providerId: 0,
      institutionId: 0,
      type: "Entrada",
      lote: "",
      date: defaultDate,
      storeId: 0,
      medicines: []
    },
  })

  const typeDonation = watch("type");

  const createEmptyMedicine = (id: number): DonationMedicine => ({
    id,
    medicineId: 0,
    details: [{
      amount: 0,
      storageId: 0,
      lote: '',
      benefited: 1,
    }],
    expirationDate: defaultDate,
  })

  const [medicineDetails, setMedicineDetails] = useState<DonationMedicine[]>([
    createEmptyMedicine(1),
    createEmptyMedicine(2),
  ])

  const totalMedicines = medicineDetails.filter((med) => med.medicineId).length;
  const totalUnits = medicineDetails.reduce((acc, med) =>
    acc + (med.details?.reduce((sum, det) => sum + (Number(det.amount) || 0), 0) || 0), 0);

  useEffect(() => {
    setAlert(false);
    setMessage('');

    if (donation) {
      reset({
        providerId: donation.type === 'Entrada' ? Number(donation.providerId) : 0,
        institutionId: donation.type === 'Salida' ? Number(donation.institutionId) : 0,
        type: donation.type as TypeDonation || "Entrada",
        lote: donation.lote,
        date: new Date(donation.date).toISOString().split('T')[0],
      });

      if (donation.type === 'Entrada') {
        setValue('storeId', Number(donation.detDonation?.[0]?.storageId) || 0);
      }

      if (donation.detDonation && donation.detDonation.length > 0) {
        setMedicineDetails(
          donation.detDonation.map((det, index: number) => ({
            id: index + 1,
            medicineId: det.medicine?.id || 0,
            details: [{
              amount: det.amount || 0,
              storageId: 0,
              benefited: det.benefited ?? 1,
            }],
            expirationDate: new Date(det.expirationDate)
          })),
        )
      }
    }
  }, [donation, reset, setValue])

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.categories))
      .catch(() => { });
    getForms()
      .then((res) => setForms(res.forms))
      .catch(() => { });
  }, [])

  const handleMedicineDetailChange = (index: number, field: DonationTypeForm, value: string | number, indexDet?: number) => {
    setMedicineDetails((prev) => {
      const updated = prev.map((detail, i) => {
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
      });

      // Si se interactuó con la última fila, se crea una nueva automáticamente
      if (index === prev.length - 1) {
        updated.push(createEmptyMedicine(prev.length + 1));
      }

      return updated;
    })
  }

  const addMedicineDetail = () => {
    setMedicineDetails((prev) => [...prev, createEmptyMedicine(prev.length + 1)])
  }

  const removeMedicineDetail = (index: number) => {
    if (medicineDetails.length > 1) {
      setMedicineDetails((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleMedicineDetailFocus = (index: number) => {
    setMedicineDetails((prev) => {
      if (index !== prev.length - 1) return prev;
      return [...prev, createEmptyMedicine(prev.length + 1)];
    })
  }

  const setMedicineIdOnRow = (index: number, medicineId: number) => {
    setMedicineDetails((prev) =>
      prev.map((detail, i) => (i === index ? { ...detail, medicineId } : detail))
    );
  }

  const openCreateMedicine = (index: number) => {
    setMedicineFormIndex(index);
    setMedicineFormOpen(true);
  }

  const handleCreateMedicine = async (formData: MedicineBody) => {
    try {
      const created = await postMedicine(formData);
      if (!created) {
        setAlert(true);
        setMessage('No se pudo crear la medicina.');
        return;
      }
      const createdMedicine = (created as unknown as { medicine?: IMedicine })?.medicine ?? created;
      setCreatedMedicines((prev) => [...prev, createdMedicine]);
      if (medicineFormIndex !== null) {
        setMedicineIdOnRow(medicineFormIndex, createdMedicine.id);
      }
      setMedicineFormOpen(false);
      setMedicineFormIndex(null);
    } catch {
      setAlert(true);
      setMessage('Error inesperado al crear la medicina.');
    }
  }

  const hasDonationDetailsChanged = () => {
    if (!donation) return false;

    const normalizeDate = (value: Date | string) => {
      if (value instanceof Date) {
        return value.toISOString().split('T')[0];
      }

      return value;
    };

    const currentDetails = medicineDetails.map((item) => ({
      medicineId: item.medicineId,
      detailCount: item.details.length,
      expirationDate: normalizeDate(item.expirationDate),
      details: item.details.map((det) => ({
        amount: det.amount,
        storageId: det.storageId,
        lote: det.lote ?? '',
        benefited: det.benefited ?? 1,
      })),
    }));

    const originalDetails = donation.detDonation?.map((det) => ({
      medicineId: det.medicine?.id ?? det.medicineId,
      detailCount: 1,
      expirationDate: normalizeDate(det.expirationDate),
      details: [{ amount: det.amount, storageId: 0, lote: '', benefited: det.benefited ?? 1 }],
    })) ?? [];

    return JSON.stringify(currentDetails) !== JSON.stringify(originalDetails);
  };

  const onSubmit = async (data: DonationBody) => {
    if (data.lote == '' || data.date == '') {
      setAlert(true)
      setMessage('Alguno de los campos esta vacio.')
      return;
    }

    const parseMedicineDetails = medicineDetails
      .filter(item => item.medicineId)
      .map(item =>
        item.details.map(det => {
          return {
            ...item,
            ...det
          }
        }).flat()
      ).flat()

    const globalStoreId = Number(getValues('storeId')) || 1;

    const parseData: DonationBody = {
      providerId: data.providerId == 0 ? null : Number(data.providerId),
      institutionId: data.institutionId == 0 ? null : Number(data.institutionId),
      type: data.type,
      lote: data.lote,
      date: new Date(data.date),
      changeDonDetails: donation ? hasDonationDetailsChanged() : false,
      medicines: parseMedicineDetails.map(det => {
        return {
          medicineId: det.medicineId == 0 ? undefined : Number(det.medicineId),
          amount: Number(det.amount),
          benefited: det.benefited ?? 1,
          storageId: data.type === 'Entrada'
            ? globalStoreId
            : (det.storageId == 0 ? 1 : Number(det.storageId)),
          lote: det.lote ?? undefined,
          expirationDate: new Date(det.expirationDate),
        }
      }),
    };
    let result: SaveDonationResult;
    setSaving(true);
    try {
      result = await onSave(parseData);
    } catch {
      result = { success: false, message: 'Error inesperado al guardar la donación.' };
    }
    setSaving(false);

    if (!result.success) {
      setAlert(true);
      setMessage(result.message || 'Error al guardar la donación.');
      return;
    }

    reset();
    setMedicineDetails([createEmptyMedicine(1), createEmptyMedicine(2)]);
    setAlert(false);
    setMessage('');
  }

  const filteredOptions = (detail: DonationMedicine, index: number): { value: string; label: string }[] => {
    const allMedicines = [...medicines, ...createdMedicines];
    return allMedicines
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
        label: `${med.name} ${med.presentation}`,
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
        label: `${med.medicine.name} ${med.medicine.presentation}`,
      }))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 px-2 pb-4 pt-1 border-b-2 border-gray-300">
        <div>
          <h2 className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">
            {donation ? "Editar Donación" : "Registrar Nueva Donación"}
          </h2>
          <p className="manrope text-sm text-gray-600">
            {donation
              ? "Modifica los datos de la donación y guarda los cambios."
              : "Completa los datos para registrar una nueva donación."}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <FaArrowLeft /> Volver
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
        <div className="space-y-4 p-2">
          <div className="space-y-1">
            <h3 className="text-base font-semibold bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent">
              Información General
            </h3>

            {/* Caberera */}
            <div className={`grid gap-4 bg-white rounded-2xl p-3 ${typeDonation == 'Entrada' ? 'grid-cols-6' : 'grid-cols-4'}`}>
              <FormSelectCustom
                label="Tipo"
                id="type"
                {...register("type")}
                options={[
                  { value: "Entrada", label: "Entrada" },
                  { value: "Salida", label: "Salida" }
                ]}
              />

              <div className={`${typeDonation == 'Entrada' ? 'col-span-2' : ''}`}>
                {typeDonation == 'Entrada' ?
                  <FormAutocompleteV2
                    label="Proveedor"
                    appendTo='body'
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
                    appendTo='body'
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
                value={watch("lote")}
                onChange={(e) => setValue("lote", e.target.value)}
                placeholder="Lote"
              />

              <FormInputCustom
                label="Fecha"
                id="date"
                type="date"
                value={formatDateForInput(watch("date"))}
                onChange={(e) => setValue("date", e.target.value)}
              />

              {typeDonation == 'Entrada' && (
                <FormSelectCustom
                  label="Almacén"
                  id="storeId"
                  value={watch("storeId")}
                  options={stores.map(store => ({
                    label: `${store.name} ${store.address}`,
                    value: store.id.toString(),
                  }))}
                  onChange={(e) => setValue("storeId", Number(e.target.value))}
                />
              )}
            </div>
          </div>

          {/* Detalles  */}
          <div className="space-y-2 h-100 max-h-100 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent">
                Detalles de Donación
              </h3>
              <span className="text-sm font-medium text-gray-600">
                {totalMedicines} medicinas - {totalUnits} unidades
              </span>
            </div>

            {typeDonation == 'Entrada'
              ?
              medicineDetails.map((detail, index) => (
                <div key={index} onFocusCapture={() => handleMedicineDetailFocus(index)}>
                  <DonationDetailFormEntry
                    key={index}
                    removeMedicineDetail={removeMedicineDetail}
                    filteredOptions={filteredOptions}
                    index={index}
                    detail={detail}
                    medicineDetails={medicineDetails}
                    handleMedicineDetailChange={handleMedicineDetailChange}
                    onCreateMedicine={openCreateMedicine}
                  />
                </div>
              ))
              :
              medicineDetails.map((detail, index) => (
                <div key={index} onFocusCapture={() => handleMedicineDetailFocus(index)}>
                  <DonationDetailFormExit
                    key={index}
                    removeMedicineDetail={removeMedicineDetail}
                    filteredOptions={filteredOptionsExit}
                    index={index}
                    detail={detail}
                    inventory={inventory}
                    medicineDetails={medicineDetails}
                    handleMedicineDetailChange={handleMedicineDetailChange}
                    onCreateMedicine={openCreateMedicine}
                  />
                </div>
              ))
            }

            <Button
              type="button"
              variant="outline"
              onClick={addMedicineDetail}
              className="w-full border-2 border-dashed"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Medicina
            </Button>
          </div>
        </div>

        {/* Botones */}
        <div className="sticky bottom-0 z-10 bg-white border-t px-4 py-3 flex justify-between items-center gap-4 shrink-0">
          <div className="w-1/2">
            {alert && (
              <p className="text-red-600 font-semibold">{message}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant={'destructive'}
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button type="submit" variant={'animated'} disabled={saving}>
              {saving ? "Guardando..." : `${donation ? "Actualizar" : "Registrar"} Donación`}
            </Button>
          </div>
        </div>
      </form>

      <StyledDialog open={medicineFormOpen} onOpenChange={setMedicineFormOpen}>
        <StyledDialogContent className="sm:max-w-2xl max-w-[95vw] w-full mx-4 max-h-[90vh] overflow-y-auto">
          <StyledDialogHeader>
            <StyledDialogTitle>Agregar Nueva Medicina</StyledDialogTitle>
            <StyledDialogDescription>
              Completa los datos para registrar la medicina y se añadirá a la donación.
            </StyledDialogDescription>
          </StyledDialogHeader>
          <MedicineForm
            ignoreHeader={true}
            open={medicineFormOpen}
            onOpenChange={setMedicineFormOpen}
            onSubmit={handleCreateMedicine}
            medicineData={null}
            categories={categories}
            forms={forms}
          />
        </StyledDialogContent>
      </StyledDialog>
    </div>
  )
}

interface DonationDetailFormEntryProps {
  removeMedicineDetail: (index: number) => void
  filteredOptions: (detail: DonationMedicine, index: number) => { value: string; label: string }[],
  index: number;
  detail: DonationMedicine;
  medicineDetails: DonationMedicine[];
  handleMedicineDetailChange: (index: number, field: DonationTypeForm, value: string | number, indexDet?: number) => void;
  onCreateMedicine: (index: number) => void;
}
const DonationDetailFormEntry = ({
  removeMedicineDetail,
  filteredOptions,
  index,
  medicineDetails,
  detail,
  handleMedicineDetailChange,
  onCreateMedicine
}: DonationDetailFormEntryProps) => {
  return (
    <div className="border border-gray-400 rounded-lg p-2 bg-white relative ">
      {medicineDetails.length > 1 && (
        <div className="absolute top-0 right-0">
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

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-3 flex items-end justify-between gap-2">
          <FormAutocompleteV2
            label="Medicina"
            appendTo='body'
            placeholder="Nombre de la medicina"
            data={filteredOptions(detail, index)}
            valueDefault={detail.medicineId}
            onChange={(value) => handleMedicineDetailChange(index, "medicineId", Number(value))}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="icon"
                className="border-2 border-[#0250b0] text-[#0250b0]"
                onClick={() => onCreateMedicine(index)}
              >
                <IoMdAdd />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="opacity-70" side="left">
              <span>Agregar nueva medicina</span>
            </TooltipContent>
          </Tooltip>
        </div>
        <FormInputCustom
          label="Cantidad"
          id={`amount-${index}`}
          type="number"
          value={detail.details?.[0]?.amount?.toString() ?? '0'}
          onChange={(e) => handleMedicineDetailChange(index, "amount", Number.parseInt(e.target.value) || 0, 0)}
          placeholder="Cantidad"
        />
        <FormInputCustom
          label="Lote"
          id={`lote-${index}`}
          type="text"
          value={detail.details?.[0]?.lote ?? '0'}
          onChange={(e) => handleMedicineDetailChange(index, "lote", Number.parseInt(e.target.value) || 0, 0)}
          placeholder="Lote"
        />
        <FormInputCustom
          label="Fecha de Expiración"
          id={`expirationDate-${index}`}
          type="date"
          value={formatDateForInput(detail.expirationDate)}
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
  removeMedicineDetail,
  filteredOptions,
  index,
  medicineDetails,
  detail,
  inventory,
  handleMedicineDetailChange
}: DonationDetailFormExitProps) => {

  const [medicineSelected, setMedicineSelected] = useState<IInventory | null>(null);
  const availableStock = medicineSelected
    ? medicineSelected.stores?.[0]?.amount ?? medicineSelected.totalStock ?? 0
    : 0;
  const changeMedicine = (value: string) => {

    const setInventory = inventory.find(item => item.medicine.id == Number(value));
    if (setInventory) {
      setMedicineSelected(setInventory);

      handleMedicineDetailChange(index, "medicineId", Number(value))
      handleMedicineDetailChange(index, "storageId", Number(setInventory.stores[0].id), 0)
      handleMedicineDetailChange(index, "lote", setInventory.lotes[0].name, 0)
    }

  }

  return (
    <div className="border border-gray-400 rounded-lg p-2 bg-white relative">
      {medicineDetails.length > 1 && (
        <div className="absolute top-0 right-0">
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

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-2">
          <FormAutocompleteV2
            label="Medicina"
            appendTo='body'
            placeholder="Nombre de la medicina"
            data={filteredOptions(detail, index)}
            valueDefault={detail.medicineId}
            onChange={(value) => changeMedicine(value)}
          />
        </div>
        <FormInputCustom
          label={medicineSelected ? `Cantidad (${availableStock} items)` : "Cantidad"}
          id={`amount-${index}`}
          type="number"
          value={detail.details?.[0]?.amount?.toString() ?? '0'}
          onChange={(e) =>
            handleMedicineDetailChange(index, "amount", Number(e.target.value), 0)
          }
          placeholder="Cantidad"
        />
        <FormSelectCustom
          label="Lote"
          id={`lote-${index}`}
          options={medicineSelected ? medicineSelected.lotes.map(lo => ({
            label: lo.name,
            value: lo.name.toString(),
          })) : []}
          value={detail.details?.[0]?.lote}
          onChange={(value) =>
            handleMedicineDetailChange(index, "lote", value.target.value, 0)
          }
        />
        <FormInputCustom
          label="Beneficiados"
          id={`benefited-${index}`}
          type="number"
          value={detail.details?.[0]?.benefited?.toString() ?? '1'}
          onChange={(e) =>
            handleMedicineDetailChange(index, "benefited", Number(e.target.value), 0)
          }
          placeholder="Beneficiados"
        />
        <FormInputCustom
          label="Expira"
          id={`fecha-${index}`}
          value={medicineSelected ? formatDate(medicineSelected.datesMedicine[0].expirationDate.toString()) : ''}
          readOnly
        />
      </div>
    </div>
  )
}
