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
import { IMedicine, MedicineBody } from "@/services/medicine/medicine.interface"
import { useCategoriesQuery, useFormsQuery, useCreateMedicineMutation, useMedicineSearchQuery } from "../medicine/medicine.hook"
import { IInstitution } from "@/services/institution/institution.interface"
import { DonationTypeForm } from "./donations.data"
import { IInventory } from "@/services/inventory/inventory.interface"
import { useInventorySearchQuery } from "../inventory/inventory.hook"
import { formatDate, formatDateForInput } from "@/utils/formatters"
import { apiMessage } from "@/services/api-error"
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
import { DonationUploadDialog } from "./DonationUploadDialog"
import { DonationInventoryWarningDialog } from "./DonationInventoryWarningDialog"
import { FaFileExcel } from "react-icons/fa";
export interface SaveDonationResult {
  success: boolean;
  message?: string;
}

/** Fila del formulario con clave estable para React (no usar el indice). */
type DonationMedicineRow = DonationMedicine & { rowKey: string };

const createRowKey = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

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
  const defaultDate = formatDateForInput(today); // "YYYY-MM-DD" en calendario local
  const [alert, setAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [medicineFormOpen, setMedicineFormOpen] = useState<boolean>(false);
  const [medicineFormIndex, setMedicineFormIndex] = useState<number | null>(null);
  const [createdMedicines, setCreatedMedicines] = useState<IMedicine[]>([]);
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);
  const [inventoryWarningOpen, setInventoryWarningOpen] = useState<boolean>(false);
  const [pendingDonation, setPendingDonation] = useState<DonationBody | null>(null);
  // const defaultTime = today.toTimeString().slice(0, 5); // "HH:mm"

  const { data: categoriesData } = useCategoriesQuery();
  const { data: formsData } = useFormsQuery();
  const createMedicine = useCreateMedicineMutation();

  const [medicineQuery, setMedicineQuery] = useState("");
  const [debouncedMedicineQuery, setDebouncedMedicineQuery] = useState("");
  const [inventoryQuery, setInventoryQuery] = useState("");
  const [debouncedInventoryQuery, setDebouncedInventoryQuery] = useState("");
  const [medicineDirectory, setMedicineDirectory] = useState<Record<number, IMedicine>>({});
  const [inventoryDirectory, setInventoryDirectory] = useState<Record<number, IInventory>>({});

  useEffect(() => {
    const id = setTimeout(() => setDebouncedMedicineQuery(medicineQuery), 300);
    return () => clearTimeout(id);
  }, [medicineQuery]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedInventoryQuery(inventoryQuery), 300);
    return () => clearTimeout(id);
  }, [inventoryQuery]);

  const { data: medicineSearchData, isFetching: isSearchingMedicines } = useMedicineSearchQuery(debouncedMedicineQuery);
  const { data: inventorySearchData, isFetching: isSearchingInventory } = useInventorySearchQuery(debouncedInventoryQuery);

  const resetMedicineSearch = () => {
    setMedicineQuery("");
    setDebouncedMedicineQuery("");
  };

  const resetInventorySearch = () => {
    setInventoryQuery("");
    setDebouncedInventoryQuery("");
  };

  useEffect(() => {
    setMedicineDirectory((prev) => {
      const next = { ...prev };
      let changed = false;
      const sources: IMedicine[] = [
        ...medicines,
        ...createdMedicines,
        ...(donation?.detDonation?.map((det) => det.medicine).filter(Boolean) as IMedicine[] ?? []),
        ...(medicineSearchData?.medicines ?? []),
      ];
      sources.forEach((med) => {
        if (med && next[med.id] == null) {
          next[med.id] = med;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [medicines, createdMedicines, donation, medicineSearchData]);

  useEffect(() => {
    setInventoryDirectory((prev) => {
      const next = { ...prev };
      let changed = false;
      const sources: IInventory[] = [...inventory, ...(inventorySearchData?.inventory ?? [])];
      sources.forEach((inv) => {
        if (inv?.medicine && next[inv.medicine.id] == null) {
          next[inv.medicine.id] = inv;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [inventory, inventorySearchData]);

  const { register, handleSubmit, reset, watch, setValue, getValues } = useForm<DonationBody & { storeId: number }>({
    defaultValues: {
      providerId: 0,
      institutionId: 0,
      type: "Entrada",
      lote: "",
      controlNumber: "",
      date: defaultDate,
      storeId: 0,
      medicines: []
    },
  })

  const typeDonation = watch("type");

  const createEmptyMedicine = (id: number, defaultStorageId = 0): DonationMedicineRow => ({
    id,
    rowKey: createRowKey(),
    medicineId: 0,
    details: [{
      amount: 0,
      storageId: defaultStorageId,
      lote: '',
      benefited: 1,
    }],
    expirationDate: defaultDate,
  })

  const getDefaultStorageId = (): number => {
    const selected = medicineDetails.find(d => Number(d.details?.[0]?.storageId) > 0);
    return Number(selected?.details?.[0]?.storageId) || 0;
  }

  const [medicineDetails, setMedicineDetails] = useState<DonationMedicineRow[]>([
    createEmptyMedicine(1),
    createEmptyMedicine(2),
  ])

  /** Almacen por defecto derivado de datos reales (nunca un id fijo). */
  const defaultStoreId = stores[0]?.id ?? 0;

  const totalMedicines = medicineDetails.filter((med) => med.medicineId).length;
  const totalUnits = medicineDetails.reduce((acc, med) =>
    acc + (med.details?.reduce((sum, det) => sum + (Number(det.amount) || 0), 0) || 0), 0);

  useEffect(() => {
    setAlert(false);
    setMessage('');
    setInventoryWarningOpen(false);
    setPendingDonation(null);

    if (donation) {
      reset({
        providerId: donation.type === 'Entrada' ? Number(donation.providerId) : 0,
        institutionId: donation.type === 'Salida' ? Number(donation.institutionId) : 0,
        type: donation.type as TypeDonation || "Entrada",
        lote: donation.lote,
        controlNumber: donation.controlNumber == null ? undefined : String(donation.controlNumber),
        date: formatDateForInput(donation.date),
      });

      if (donation.type === 'Entrada') {
        setValue('storeId', Number(donation.detDonation?.[0]?.storageId) || 0);
      }

      if (donation.detDonation && donation.detDonation.length > 0) {
        setMedicineDetails(
          donation.detDonation.map((det, index: number) => ({
            id: index + 1,
            rowKey: createRowKey(),
            medicineId: det.medicine?.id || 0,
            details: [{
              amount: det.amount || 0,
              storageId: det.storageId || 0,
              lote: det.lote ?? '',
              benefited: det.benefited ?? 1,
            }],
            expirationDate: new Date(det.expirationDate)
          })),
        )
      }
    }
  }, [donation, reset, setValue])

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
        updated.push(createEmptyMedicine(prev.length + 1, getDefaultStorageId()));
      }

      return updated;
    })
  }

  const addMedicineDetail = () => {
    setMedicineDetails((prev) => [...prev, createEmptyMedicine(prev.length + 1, getDefaultStorageId())])
  }

  const removeMedicineDetail = (index: number) => {
    if (medicineDetails.length > 1) {
      setMedicineDetails((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleMedicineDetailFocus = (index: number) => {
    setMedicineDetails((prev) => {
      if (index !== prev.length - 1) return prev;
      return [...prev, createEmptyMedicine(prev.length + 1, getDefaultStorageId())];
    })
  }

  const setMedicineIdOnRow = (index: number, medicineId: number) => {
    setMedicineDetails((prev) =>
      prev.map((detail, i) => (i === index ? { ...detail, medicineId } : detail))
    );
  }

  const handleMedicineSelectEntry = (index: number, medicineId: number) => {
    handleMedicineDetailChange(index, "medicineId", medicineId);
    const medicine = medicineDirectory[medicineId];
    handleMedicineDetailChange(index, "lote", medicine?.lote ?? "", 0);
  }

  const handleApplyUpload = (uploaded: DonationMedicine[]) => {
    const defaultStorageId = getDefaultStorageId();
    setMedicineDetails(
      uploaded.map((item, index) => ({
        ...item,
        id: index + 1,
        rowKey: createRowKey(),
        details: item.details.map((det) => ({
          ...det,
          storageId: defaultStorageId,
        })),
      }))
    );
  }

  const openCreateMedicine = (index: number) => {
    setMedicineFormIndex(index);
    setMedicineFormOpen(true);
  }

  const handleCreateMedicine = async (formData: MedicineBody) => {
    try {
      const response = await createMedicine.mutateAsync(formData);
      const created = response?.data;
      if (!response?.success || !created) {
        setAlert(true);
        setMessage(apiMessage(response, 'No se pudo crear la medicina.'));
        return;
      }
      setCreatedMedicines((prev) => [...prev, created]);
      if (medicineFormIndex !== null) {
        setMedicineIdOnRow(medicineFormIndex, created.id);
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
      return formatDateForInput(value);
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
      details: [{ amount: det.amount, storageId: det.storageId || 0, lote: det.lote ?? '', benefited: det.benefited ?? 1 }],
    })) ?? [];

    return JSON.stringify(currentDetails) !== JSON.stringify(originalDetails);
  };

  /**
   * Un cambio afecta al inventario cuando se modifican los elementos de la
   * donación, cuando cambia el almacén de una Entrada o cuando se cambia el
   * tipo (Entrada <-> Salida). Cambios de cabecera como proveedor, institución,
   * control o fecha no reprocesan el inventario por sí solos.
   */
  const hasInventoryAffectingChanges = (data: DonationBody): boolean => {
    if (!donation) return false;

    const detailsChanged = hasDonationDetailsChanged();
    const typeChanged = data.type !== donation.type;
    const storeChanged =
      data.type === 'Entrada' &&
      Number(getValues('storeId')) !== Number(donation.detDonation?.[0]?.storageId ?? 0);

    return detailsChanged || typeChanged || storeChanged;
  };

  const persistDonation = async (parseData: DonationBody) => {
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

  const handleConfirmInventoryWarning = async () => {
    if (!pendingDonation) return;
    const parseData = pendingDonation;
    setInventoryWarningOpen(false);
    setPendingDonation(null);
    await persistDonation(parseData);
  }

  const handleCancelInventoryWarning = () => {
    setInventoryWarningOpen(false);
    setPendingDonation(null);
  }

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

    const globalStoreId = Number(getValues('storeId')) || defaultStoreId;

    if (data.type === 'Entrada' && !globalStoreId) {
      setAlert(true);
      setMessage('No hay almacenes disponibles. Registra un almacén antes de continuar.');
      return;
    }

    const parseData: DonationBody = {
      providerId: data.providerId == 0 ? null : Number(data.providerId),
      institutionId: data.institutionId == 0 ? null : Number(data.institutionId),
      type: data.type,
      lote: data.lote,
      controlNumber: data.controlNumber,
      date: new Date(data.date),
      changeDonDetails: donation ? hasInventoryAffectingChanges(data) : false,
      medicines: parseMedicineDetails.map(det => {
        return {
          medicineId: det.medicineId == 0 ? undefined : Number(det.medicineId),
          amount: Number(det.amount),
          benefited: det.benefited ?? 1,
          storageId: data.type === 'Entrada'
            ? globalStoreId
            : (Number(det.storageId) || defaultStoreId),
          lote: det.lote ?? undefined,
          expirationDate: new Date(det.expirationDate),
        }
      }),
    };

    if (parseData.medicines.some((med) => !med.storageId)) {
      setAlert(true);
      setMessage('Selecciona un almacén para cada medicina.');
      return;
    }

    if (donation?.hasOutflows && parseData.changeDonDetails) {
      setPendingDonation(parseData);
      setInventoryWarningOpen(true);
      return;
    }

    await persistDonation(parseData);
  }

  const filteredOptions = (detail: DonationMedicine, index: number): { value: string; label: string }[] => {
    const current = detail.medicineId ? medicineDirectory[detail.medicineId] : undefined;
    const base = medicineQuery.trim()
      ? (medicineSearchData?.medicines ?? [])
      : Object.values(medicineDirectory);
    const allMedicines = current && !base.some((med) => med.id === current.id)
      ? [...base, current]
      : base;
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
    const current = detail.medicineId ? inventoryDirectory[detail.medicineId] : undefined;
    const base = inventoryQuery.trim()
      ? (inventorySearchData?.inventory ?? [])
      : Object.values(inventoryDirectory);
    const allInventory = current && !base.some((inv) => inv.medicine.id === current.medicine.id)
      ? [...base, current]
      : base;
    return allInventory
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
          <h2 className="bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent manrope text-2xl">
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
            <h3 className="text-base font-semibold bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent">
              Información General
            </h3>

            {/* Caberera */}
            <div className={`grid gap-4 bg-white rounded-2xl p-3 ${typeDonation == 'Entrada' ? 'grid-cols-7' : 'grid-cols-5'}`}>
              <FormInputCustom
                label="N° Control"
                id="controlNumber"
                value={watch("controlNumber")}
                onChange={(e) => setValue("controlNumber", e.target.value)}
                placeholder="controlNumber"
              />
              <FormSelectCustom
                label="Tipo"
                id="type"
                {...register("type")}
                value={typeDonation}
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
              <h3 className="text-base font-semibold bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent">
                Detalles de Donación
              </h3>
              <div className="flex items-center gap-3">
                {typeDonation == 'Entrada' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadOpen(true)}
                    className="border-[#0250b0] text-[#0250b0]"
                  >
                    <FaFileExcel className="w-4 h-4 mr-1" /> Cargar por Excel
                  </Button>
                )}
                <span className="text-sm font-medium text-gray-600">
                  {totalMedicines} medicinas - {totalUnits} unidades
                </span>
              </div>
            </div>

            {typeDonation == 'Entrada'
              ?
              medicineDetails.map((detail, index) => (
                <div key={detail.rowKey} onFocusCapture={() => handleMedicineDetailFocus(index)}>
                  <DonationDetailFormEntry
                    key={detail.rowKey}
                    removeMedicineDetail={removeMedicineDetail}
                    filteredOptions={filteredOptions}
                    index={index}
                    detail={detail}
                    medicineDetails={medicineDetails}
                    handleMedicineDetailChange={handleMedicineDetailChange}
                    onCreateMedicine={openCreateMedicine}
                    onSearch={setMedicineQuery}
                    searching={isSearchingMedicines || medicineQuery.trim() !== debouncedMedicineQuery.trim()}
                    onOpenChange={(isOpen) => { if (isOpen) resetMedicineSearch(); }}
                    onMedicineChange={handleMedicineSelectEntry}
                  />
                </div>
              ))
              :
              medicineDetails.map((detail, index) => (
                <div key={detail.rowKey} onFocusCapture={() => handleMedicineDetailFocus(index)}>
                  <DonationDetailFormExit
                    key={detail.rowKey}
                    removeMedicineDetail={removeMedicineDetail}
                    filteredOptions={filteredOptionsExit}
                    index={index}
                    detail={detail}
                    inventory={inventory}
                    stores={stores}
                    medicineDetails={medicineDetails}
                    handleMedicineDetailChange={handleMedicineDetailChange}
                    onCreateMedicine={openCreateMedicine}
                    onSearch={setInventoryQuery}
                    searching={isSearchingInventory || inventoryQuery.trim() !== debouncedInventoryQuery.trim()}
                    onOpenChange={(isOpen) => { if (isOpen) resetInventorySearch(); }}
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
            categories={categoriesData?.categories ?? []}
            forms={formsData?.forms ?? []}
          />
        </StyledDialogContent>
      </StyledDialog>

      <DonationUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        medicines={medicines}
        createdMedicines={createdMedicines}
        categories={categoriesData?.categories ?? []}
        forms={formsData?.forms ?? []}
        onCreateMedicine={async (formData) => (await createMedicine.mutateAsync(formData)).data}
        onApply={handleApplyUpload}
      />

      <DonationInventoryWarningDialog
        open={inventoryWarningOpen}
        onOpenChange={(openDialog) => { if (!openDialog) handleCancelInventoryWarning(); }}
        mode="edit"
        donation={donation}
        stores={stores}
        loading={saving}
        onConfirm={handleConfirmInventoryWarning}
      />
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
  onSearch?: (query: string) => void;
  searching?: boolean;
  onOpenChange?: (open: boolean) => void;
  onMedicineChange?: (index: number, medicineId: number) => void;
}
const DonationDetailFormEntry = ({
  removeMedicineDetail,
  filteredOptions,
  index,
  medicineDetails,
  detail,
  handleMedicineDetailChange,
  onCreateMedicine,
  onSearch,
  searching,
  onOpenChange,
  onMedicineChange
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
          <div className="w-[92%]">
            <FormAutocompleteV2
              label="Medicina"
              appendTo='body'
              placeholder="Nombre de la medicina"
              data={filteredOptions(detail, index)}
              valueDefault={detail.medicineId}
              onChange={(value) =>
                onMedicineChange
                  ? onMedicineChange(index, Number(value))
                  : handleMedicineDetailChange(index, "medicineId", Number(value))
              }
              onSearch={onSearch}
              loading={searching}
              onOpenChange={onOpenChange}
            />
          </div>
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
          value={detail.details?.[0]?.lote ?? ''}
          onChange={(e) => handleMedicineDetailChange(index, "lote", e.target.value || '', 0)}
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
  stores: IStore[];
}
const DonationDetailFormExit = ({
  removeMedicineDetail,
  filteredOptions,
  index,
  medicineDetails,
  detail,
  inventory,
  stores,
  handleMedicineDetailChange,
  onSearch,
  searching,
  onOpenChange
}: DonationDetailFormExitProps) => {

  const [medicineSelected, setMedicineSelected] = useState<IInventory | null>(null);
  const rowStoreId = Number(detail.details?.[0]?.storageId) || 0;

  useEffect(() => {
    if (!detail.medicineId) return;
    const found = inventory.find(item => item.medicine.id === detail.medicineId);
    if (found) setMedicineSelected(found);
  }, [detail.medicineId, inventory]);

  const selectedStore = medicineSelected?.stores.find(store => store.id === rowStoreId);
  const availableStock = medicineSelected
    ? selectedStore?.amount ?? medicineSelected.totalStock ?? 0
    : 0;
  const availableStores = medicineSelected
    ? medicineSelected.stores.filter(s => (s.amount ?? 0) > 0)
    : stores;
  const storeOptions = (availableStores.length > 0 ? availableStores : stores)
    .map(store => ({
      label: `${store.name} - ${store.amount ?? 0} unidades`,
      value: store.id.toString(),
    }));
  const changeMedicine = (value: string) => {

    const setInventory = inventory.find(item => item.medicine.id == Number(value));
    if (setInventory) {
      setMedicineSelected(setInventory);

      const store = setInventory.stores.find(s => s.id === rowStoreId && (s.amount ?? 0) > 0);
      const fallback = setInventory.stores.find(s => (s.amount ?? 0) > 0) ?? setInventory.stores[0];
      const storageId = store?.id ?? fallback?.id ?? 0;
      const lote = setInventory.lotes.find(l => l.storeId === storageId) ?? setInventory.lotes[0];

      handleMedicineDetailChange(index, "medicineId", Number(value))
      handleMedicineDetailChange(index, "storageId", storageId, 0)
      handleMedicineDetailChange(index, "lote", lote?.name ?? '', 0)
      handleMedicineDetailChange(index, "expirationDate", lote?.expirationDate ? formatDateForInput(lote.expirationDate) : '')
    }

  }

  const changeLote = (loteName: string) => {
    handleMedicineDetailChange(index, "lote", loteName, 0);
    const lote = medicineSelected?.lotes.find(
      lo => lo.name === loteName && (!rowStoreId || lo.storeId === rowStoreId)
    );
    handleMedicineDetailChange(index, "expirationDate", lote?.expirationDate ? formatDateForInput(lote.expirationDate) : '');
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

      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-2">
          <FormAutocompleteV2
            label="Medicina"
            appendTo='body'
            placeholder="Nombre de la medicina"
            data={filteredOptions(detail, index)}
            valueDefault={detail.medicineId}
            onChange={(value) => changeMedicine(value)}
            onSearch={onSearch}
            loading={searching}
            onOpenChange={onOpenChange}
          />
        </div>
        <FormSelectCustom
          label="Almacén"
          id={`storageId-${index}`}
          value={rowStoreId}
          options={storeOptions}
          onChange={(e) => handleMedicineDetailChange(index, "storageId", Number(e.target.value), 0)}
        />
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
          options={medicineSelected ? medicineSelected.lotes
            .filter(lo => !rowStoreId || lo.storeId === rowStoreId)
            .map(lo => ({
              label: lo.name,
              value: lo.name.toString(),
            })) : []}
          value={detail.details?.[0]?.lote}
          onChange={(e) =>
            changeLote(e.target.value)
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
          disabled={true}
          className="bg-gray-300 text-gray-600"
          id={`fecha-${index}`}
          value={medicineSelected && detail.expirationDate ? formatDate(detail.expirationDate) : ''}
          readOnly
        />
      </div>
    </div>
  )
}
