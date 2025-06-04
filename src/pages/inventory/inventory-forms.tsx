import type React from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FaRegSave } from "react-icons/fa"
import { MdOutlineAddShoppingCart } from "react-icons/md"
import FormInput from "../../components/FormInput/FormInput"

export interface Medicine {
  id: number
  medicina: string
  cantidad: number
  fechaLlegada: string
  fechaExpiracion: string
}

interface InventoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (medicine: Omit<Medicine, "id"> | Medicine) => void
  medicine?: Medicine | null
}

const InventoryForm: React.FC<InventoryFormProps> = ({ open, onOpenChange, onSubmit, medicine }) => {
  const isEdit = !!medicine

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Medicine, "id"> | Medicine>({
    defaultValues: medicine || { medicina: "", cantidad: 0, fechaLlegada: "", fechaExpiracion: "" },
  })

  useEffect(() => {
    if (open) reset(medicine || { medicina: "", cantidad: 0, fechaLlegada: "", fechaExpiracion: "" })
  }, [open, medicine, reset])

  const validateExpirationDate = (value: string) => {
    const today = new Date()
    const expirationDate = new Date(value)
    if (expirationDate <= today) {
      return "La fecha de expiración debe ser posterior a hoy"
    }
    return true
  }

  const validateArrivalDate = (value: string) => {
    const today = new Date()
    const arrivalDate = new Date(value)
    if (arrivalDate > today) {
      return "La fecha de llegada no puede ser futura"
    }
    return true
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg manrope bg-gray-300">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">
            {isEdit ? "Editar Medicina" : "Agregar Medicina"}
          </DialogTitle>
          <DialogDescription className="manrope">
            {isEdit
              ? "Modifica los datos de la medicina y guarda los cambios."
              : "Completa los datos para agregar una nueva medicina al inventario."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <FormInput
              label="Medicina"
              id="medicina"
              autoFocus
              {...register("medicina", {
                required: "El nombre de la medicina es obligatorio",
                minLength: {
                  value: 2,
                  message: "El nombre debe tener al menos 2 caracteres",
                },
              })}
              error={errors.medicina?.message}
            />
          </div>

          <div>
            <FormInput
              label="Cantidad"
              id="cantidad"
              type="number"
              min="1"
              {...register("cantidad", {
                required: "La cantidad es obligatoria",
                min: {
                  value: 1,
                  message: "La cantidad debe ser mayor a 0",
                },
                valueAsNumber: true,
              })}
              error={errors.cantidad?.message}
            />
          </div>

          <div>
            <FormInput
              label="Fecha de Llegada"
              id="fechaLlegada"
              type="date"
              {...register("fechaLlegada", {
                required: "La fecha de llegada es obligatoria",
                validate: validateArrivalDate,
              })}
              error={errors.fechaLlegada?.message}
            />
          </div>

          <div>
            <FormInput
              label="Fecha de Expiración"
              id="fechaExpiracion"
              type="date"
              {...register("fechaExpiracion", {
                required: "La fecha de expiración es obligatoria",
                validate: validateExpirationDate,
              })}
              error={errors.fechaExpiracion?.message}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="usuarioForm"
              className="p-3 w-[25%] h-[90%] bg-gradient-to-r from-blue-800 to-[#58c0e9]"
              type="submit"
            >
              {isEdit ? (
                <>
                  <FaRegSave className="self-center size-5" /> Guardar
                </>
              ) : (
                <>
                  <MdOutlineAddShoppingCart className="self-center size-5" /> Agregar
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default InventoryForm
