import { useForm, useFieldArray, Controller } from "react-hook-form"
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogHeader,
  StyledDialogTitle,
  StyledDialogDescription,
} from "@/components/StyledDialog/StyledDialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FormInputCustom from "@/components/formInput/FormInputCustom"
import { FaExchangeAlt, FaWarehouse, FaPills, FaPlus } from "react-icons/fa"
import type { IInventory } from "@/services/inventory/inventory.interface"
import { Trash2 } from "lucide-react"

interface MovementItem {
  medicineId: string | number;
  sourceStoreId: string | number;
  quantity: number;
  targetStoreId: string | number;
}

export interface MoveMedicineFormData {
  movements: MovementItem[]
}

interface MoveMedicineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inventory: IInventory[]
  onSubmit?: (data: MoveMedicineFormData) => void
}

export const MoveMedicineDialog = ({ open, onOpenChange, inventory, onSubmit }: MoveMedicineDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MoveMedicineFormData>({
    defaultValues: {
      movements: [{ medicineId: "", sourceStoreId: "", quantity: 1, targetStoreId: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "movements",
  })

  const watchedMovements = watch("movements")

  const getMedicineById = (medicineId: string) => {
    return inventory.find((inv) => inv.medicine.id.toString() === medicineId)
  }

  const getStoresByMedicine = (medicineId: string) => {
    const medicine = getMedicineById(medicineId)
    return medicine?.stores || []
  }

  const getAvailableTargetStores = (medicineId: string, sourceStoreId: string) => {
    if (!medicineId || !sourceStoreId) return []

    // Obtener todos los almacenes disponibles excepto el almacén origen
    const allStores = inventory.flatMap((inv) => inv.stores)
    const uniqueStores = allStores.filter(
      (store, index, self) =>
        index === self.findIndex((s) => s.id === store.id) && store.id.toString() !== sourceStoreId,
    )

    return uniqueStores
  }

  const getMaxQuantity = (medicineId: string, sourceStoreId: string) => {
    const medicine = getMedicineById(medicineId)
    if (!medicine || !sourceStoreId) return 0

    const sourceStore = medicine.stores.find((store) => store.id.toString() === sourceStoreId)
    return sourceStore?.amount || 0
  }

  const handleFormSubmit = (data: MoveMedicineFormData) => {
    // Filtrar movimientos válidos (que tengan todos los campos completos)
    const validMovements = data.movements.filter(
      (movement) => movement.medicineId && movement.sourceStoreId && movement.targetStoreId && movement.quantity > 0,
    )

    if (validMovements.length > 0) {
      onSubmit?.({ movements: validMovements })
      reset()
      onOpenChange(false)
    }
  }

  const addMovement = () => {
    append({ medicineId: "", sourceStoreId: "", quantity: 1, targetStoreId: "" })
  }

  const removeMovement = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <StyledDialog open={open} onOpenChange={onOpenChange}>
      <StyledDialogContent className="sm:max-w-5xl overflow-x-hidden max-w-[95vw] w-full mx-4">
        <StyledDialogHeader>
          <StyledDialogTitle className="flex items-center gap-2">
            <FaExchangeAlt className="text-blue-600" />
            Mover Medicinas
          </StyledDialogTitle>
          <StyledDialogDescription className="flex items-center justify-between">
            Puedes agregar múltiples movimientos de medicinas entre diferentes almacenes.

            {/* Botón para agregar más movimientos */}
            <div className="flex justify-center">
              <Button
                type="button"
                variant="animated"
                onClick={addMovement}
                className="flex items-center gap-2 bg-transparent"
              >
                <FaPlus className="w-4 h-4" />
                Agregar Otro Movimiento
              </Button>
            </div>
          </StyledDialogDescription>
        </StyledDialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto overflow-x-hidden">
          {fields.map((field, index) => {
            const currentMovement = watchedMovements[index]
            // const selectedMedicine = currentMovement?.medicineId ? getMedicineById(currentMovement.medicineId) : null
            const maxQuantity = getMaxQuantity(currentMovement?.medicineId.toString() || "", currentMovement?.sourceStoreId.toString() || "")

            return (
              <div key={field.id} className=" border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
                <div className="flex justify-between items-center w-full">
                  <h4 className="font-medium text-gray-800">Movimiento {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeMovement(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-start justify-around gap-4 w-full">
                  {/* Selección de Medicina */}
                  <div className="space-y-2 w-1/4">
                    <Label className="flex items-center gap-2 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent font-medium">
                      <FaPills className="text-green-600" />
                      Medicina
                    </Label>
                    <Controller
                      name={`movements.${index}.medicineId`}
                      control={control}
                      rules={{ required: "Selecciona una medicina" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            // Reset dependent fields when medicine changes
                            const currentMovements = watchedMovements
                            currentMovements[index] = {
                              ...currentMovements[index],
                              medicineId: value,
                              sourceStoreId: "",
                              targetStoreId: "",
                              quantity: 1,
                            }
                          }}
                          value={field.value.toString()}
                        >
                          <SelectTrigger className="bg-white shadow-xl border focus:outline-1 focus:outline-blue-800 w-full">
                            <SelectValue placeholder="Seleccionar medicina..." />
                          </SelectTrigger>
                          <SelectContent>
                            {inventory.map((inv) => (
                              <SelectItem key={inv.id} value={inv.medicine.id.toString()}>
                                {inv.medicine.name} {inv.medicine.amount}
                                {inv.medicine.unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.movements?.[index]?.medicineId && (
                      <p className="text-red-500 text-sm">{errors.movements[index]?.medicineId?.message}</p>
                    )}
                  </div>

                  {/* Almacén Origen */}
                  <div className="space-y-2 w-1/4">
                    <Label className="flex items-center gap-2 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent font-medium">
                      <FaWarehouse className="text-orange-600" />
                      Almacén Origen
                    </Label>
                    <Controller
                      name={`movements.${index}.sourceStoreId`}
                      control={control}
                      rules={{ required: "Selecciona un almacén origen" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            // Reset target store when source changes
                            const currentMovements = watchedMovements
                            currentMovements[index] = {
                              ...currentMovements[index],
                              sourceStoreId: value,
                              targetStoreId: "",
                            }
                          }}
                          value={field.value.toString()}
                        >
                          <SelectTrigger className="bg-white shadow-xl border focus:outline-1 focus:outline-blue-800 w-full">
                            <SelectValue placeholder="Seleccionar almacén origen..." />
                          </SelectTrigger>
                          <SelectContent>
                            {getStoresByMedicine(currentMovement?.medicineId.toString() || "").map((store) => (
                              <SelectItem key={store.id} value={store.id.toString()}>
                                {store.name} - {store.amount} unidades
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.movements?.[index]?.sourceStoreId && (
                      <p className="text-red-500 text-sm">{errors.movements[index]?.sourceStoreId?.message}</p>
                    )}
                  </div>

                  {/* Cantidad */}
                  <div className="space-y-2 w-1/4">
                    <Controller
                      name={`movements.${index}.quantity`}
                      control={control}
                      rules={{
                        required: "La cantidad es obligatoria",
                        min: { value: 1, message: "La cantidad debe ser mayor a 0" },
                        max: { value: maxQuantity, message: `Máximo ${maxQuantity} unidades disponibles` },
                      }}
                      render={({ field }) => (
                        <FormInputCustom
                          label={`Cantidad (máx: ${maxQuantity})`}
                          id={`quantity-${index}`}
                          type="number"
                          min="1"
                          max={maxQuantity}
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                          error={errors.movements?.[index]?.quantity?.message}
                        />
                      )}
                    />
                  </div>

                  {/* Almacén Destino */}
                  <div className="space-y-2 w-1/4">
                    <Label className="flex items-center gap-2 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent font-medium">
                      <FaWarehouse className="text-purple-600" />
                      Almacén Destino
                    </Label>
                    <Controller
                      name={`movements.${index}.targetStoreId`}
                      control={control}
                      rules={{ required: "Selecciona un almacén destino" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value.toString()}>
                          <SelectTrigger className="bg-white shadow-xl border focus:outline-1 focus:outline-blue-800 w-full">
                            <SelectValue placeholder="Seleccionar almacén destino..." />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableTargetStores(
                              currentMovement?.medicineId.toString() || "",
                              currentMovement?.sourceStoreId.toString() || "",
                            ).map((store) => (
                              <SelectItem key={store.id} value={store.id.toString()}>
                                {store.name} - {store.address}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.movements?.[index]?.targetStoreId && (
                      <p className="text-red-500 text-sm">{errors.movements[index]?.targetStoreId?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Resumen de movimientos */}
          {watchedMovements.some((m) => m.medicineId && m.sourceStoreId && m.targetStoreId && m.quantity > 0) && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-3">Resumen de Movimientos</h4>
              <div className="space-y-2 text-sm text-green-700">
                {watchedMovements
                  .filter((m) => m.medicineId && m.sourceStoreId && m.targetStoreId && m.quantity > 0)
                  .map((movement, index) => {
                    const medicine = getMedicineById(movement.medicineId.toString())
                    const allStores = inventory.flatMap((inv) => inv.stores)
                    const sourceStore = allStores.find((s) => s.id.toString() === movement.sourceStoreId)
                    const targetStore = allStores.find((s) => s.id.toString() === movement.targetStoreId)

                    return (
                      <div key={index} className="flex justify-between items-center bg-white p-2 rounded">
                        <span>
                          {medicine?.medicine.name} - {movement.quantity} unidades
                        </span>
                        <span className="text-xs">
                          {sourceStore?.name} → {targetStore?.name}
                        </span>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
              onClick={() => {
                reset()
                onOpenChange(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="animated"
              className="w-full sm:w-auto"
              disabled={
                !watchedMovements.some((m) => m.medicineId && m.sourceStoreId && m.targetStoreId && m.quantity > 0)
              }
            >
              <FaExchangeAlt className="mr-2" />
              Realizar Movimientos
            </Button>
          </div>
        </form>
      </StyledDialogContent>
    </StyledDialog>
  )
}
