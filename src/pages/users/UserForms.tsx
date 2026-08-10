import type React from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { FaRegSave, FaArrowLeft } from "react-icons/fa"
import { TiUserAddOutline } from "react-icons/ti"
import FormInputCustom from "@/components/formInput/FormInputCustom"
import { IUsers, Role, UsersBody } from "@/services/users/user.interface"
import FormSelectCustom from "@/components/formInput/FormSelectCustom"

interface UsersFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (user: UsersBody) => void
  user?: IUsers | null
  roles: Role[]
}

const UsersForm: React.FC<UsersFormProps> = ({ open, onOpenChange, onSubmit, user, roles }) => {
  const isEdit = !!user

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UsersBody>({
    defaultValues: {
      name: '',
      lastName: '',
      correo: '',
      username: '',
      rolId: 0,
    }
  })

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name,
        lastName: user.lastName,
        correo: user.correo,
        username: user.username,
        rolId: user.rolId
      }
      reset(userData)
    } else {
      const userData = {
        name: '',
        lastName: '',
        correo: '',
        username: '',
        rolId: 0,
      }
      reset(userData)
    }
  }, [open, user, reset])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 px-2 pb-4 pt-1 border-b-2 border-gray-300">
        <div>
          <h2 className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">
            {isEdit ? "Editar Usuario" : "Crear Usuario"}
          </h2>
          <p className="manrope text-sm text-gray-600">
            {isEdit
              ? "Modifica los datos del usuario y guarda los cambios."
              : "Completa los datos para crear un nuevo usuario."}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="flex items-center gap-2"
        >
          <FaArrowLeft /> Volver
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 p-4 overflow-y-auto">
        <div>
          <FormInputCustom
            label="Nombre"
            id="nombre"
            autoFocus
            {...register("name", {
              required: "El nombre es obligatorio",
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                message:
                  "El nombre no puede contener números ni caracteres especiales",
              },
            })}
            error={errors.name?.message}
          />
        </div>

        <div>
          <FormInputCustom
            label="Apellido"
            id="apellido"
            {...register("lastName", {
              required: "El apellido es obligatorio",
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                message:
                  "El apellido no puede contener números ni caracteres especiales",
              },
            })}
            error={errors.lastName?.message}
          />
        </div>

        <div>
          <FormInputCustom
            label="Usuario"
            id="usuario"
            {...register("username", {
              required: "El usuario es obligatorio",
            })}
            error={errors.username?.message}
          />
        </div>

        <div>
          <FormSelectCustom
            label="Rol"
            id="rol"
            options={roles.map(item => ({ label: item.rol, value: item.id.toString() }))}
            {...register("rolId")}
            error={errors.rolId?.message}
          />
        </div>

        <div className="col-span-2 flex items-center justify-center mt-5">
          <Button
            variant="animated"
            className="w-1/2 h-[90%] bg-gradient-to-r from-blue-800 to-[#58c0e9]"
            type="submit"
          >
            {isEdit ? (
              <>
                <FaRegSave className="self-center size-5" /> Guardar
              </>
            ) : (
              <>
                <TiUserAddOutline className="self-center size-5" /> Crear
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default UsersForm
