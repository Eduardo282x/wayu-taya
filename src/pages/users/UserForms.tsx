import type React from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogHeader,
  StyledDialogTitle,
  StyledDialogDescription,
} from "../../components/StyledDialog/StyledDialog"
import { Button } from "@/components/ui/button"
import { FaRegSave } from "react-icons/fa"
import { TiUserAddOutline } from "react-icons/ti"
// import { FormInputCustoms } from "@/components/formInput/FormInputCustom"
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
    <StyledDialog open={open} onOpenChange={onOpenChange}>
      <StyledDialogContent className="w-[30rem] ">
        <StyledDialogHeader>
          <StyledDialogTitle>{isEdit ? "Editar Usuario" : "Crear Usuario"}</StyledDialogTitle>
          <StyledDialogDescription>
            {isEdit
              ? "Modifica los datos del usuario y guarda los cambios."
              : "Completa los datos para crear un nuevo usuario."}
          </StyledDialogDescription>
        </StyledDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
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
            <FormInputCustom
              label="Correo"
              id="correo"
              type="email"
              {...register("correo", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Correo inválido",
                },
              })}
              error={errors.correo?.message}
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="animated"
              className="p-3 w-[25%] h-[90%] bg-gradient-to-r from-blue-800 to-[#58c0e9]"
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
      </StyledDialogContent>
    </StyledDialog>
  )
}

export default UsersForm
