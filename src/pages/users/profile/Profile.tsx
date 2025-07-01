import { PiUser } from "react-icons/pi"
import { Button } from "@/components/ui/button"
import { MdClear, MdSave } from "react-icons/md"
import { useState } from "react"
import { HeaderPages } from "../../layout/Header"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import FormInputCustom from "@/components/formInput/FormInputCustom"
import { useForm } from "react-hook-form"
import ConfirmDialog from "./ConfirmDialog"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"

interface ProfileData {
  name: string
  lastName: string
  correo: string
  username: string
  password: string
}

export const Profile = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: "" })
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileData>({
    defaultValues: {
      name: "Juan",
      lastName: "Pérez",
      correo: "juan.perez@email.com",
      username: "juanperez",
      password: "miPassword123",
    },
  })

  const saveProfile = async (data: ProfileData) => {
    setLoading(true)

    // Simular llamada a API
    setTimeout(() => {
      console.log("Datos del perfil guardados:", data)
      setConfirmDialog({
        open: true,
        message: "Perfil actualizado correctamente",
      })
      setIsEditing(false) 
      setValue("password", "miPassword123")
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="px-3 lg:p-0">
      {loading && <ScreenLoader />}

      <HeaderPages title="Mi Perfil" Icon={PiUser} />

      <div className="flex justify-end items-center px-2 pb-2 pt-1 h-fit border-b-2 border-gray-300">
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button
              variant="animated"
              className="w-fit lg:h-full text-[0.8rem] lg:text-[1rem]"
              onClick={() => {
                setIsEditing(true)
                setValue("password", "")
              }}
            >
              <PiUser className="size-4 lg:size-6" />
              Editar Datos
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-fit lg:h-full text-[0.8rem] lg:text-[1rem] bg-transparent"
                onClick={() => {
                  setIsEditing(false)
                  reset({
                    name: "Juan",
                    lastName: "Pérez",
                    correo: "juan.perez@email.com",
                    username: "juanperez",
                    password: "miPassword123",
                  })
                }}
              >
                <MdClear className="size-4 lg:size-6" />
                Cancelar
              </Button>
              <Button
                variant="animated"
                className={`w-fit lg:h-full text-[0.8rem] lg:text-[1rem] transition-all duration-300 ${
                  isDirty
                    ? "opacity-100 bg-gradient-to-r from-green-600 to-green-400 shadow-lg scale-105"
                    : "opacity-50 cursor-not-allowed bg-gray-400"
                }`}
                onClick={handleSubmit(saveProfile)}
                disabled={!isDirty}
              >
                <MdSave className="size-4 lg:size-6" />
                Guardar Cambios
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 lg:mt-8 max-w-2xl mx-auto border border-solid rounded-xl border-gray-300">
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit(saveProfile)} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormInputCustom
                  label="Nombre"
                  id="nombre"
                  autoFocus={isEditing}
                  readOnly={!isEditing}
                  {...register("name", {
                    required: "El nombre es obligatorio",
                    pattern: {
                      value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                      message: "El nombre no puede contener números ni caracteres especiales",
                    },
                  })}
                  error={errors.name?.message}
                />
              </div>

              <div>
                <FormInputCustom
                  label="Apellido"
                  id="apellido"
                  readOnly={!isEditing}
                  {...register("lastName", {
                    required: "El apellido es obligatorio",
                    pattern: {
                      value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                      message: "El apellido no puede contener números ni caracteres especiales",
                    },
                  })}
                  error={errors.lastName?.message}
                />
              </div>
            </div>

            <div>
              <FormInputCustom
                label="Usuario"
                id="usuario"
                readOnly={!isEditing}
                {...register("username", {
                  required: "El usuario es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El usuario debe tener al menos 3 caracteres",
                  },
                })}
                error={errors.username?.message}
              />
            </div>

            <div>
              <FormInputCustom
                label="Correo Electrónico"
                id="correo"
                type="email"
                readOnly={!isEditing}
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

            <div className="relative">
              <FormInputCustom
                label={isEditing ? "Nueva Contraseña" : "Contraseña"}
                id="password"
                type={isEditing ? (showPassword ? "text" : "password") : "text"}
                placeholder={isEditing ? "Dejar vacío para mantener la contraseña actual" : ""}
                readOnly={!isEditing}
                {...register("password", {
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
                error={errors.password?.message}
              />
              {isEditing && (
                <div
                  className="absolute right-3 top-8 cursor-pointer z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaRegEye className="text-blue-500 text-lg" />
                  ) : (
                    <FaRegEyeSlash className="text-blue-500 text-lg" />
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        description={confirmDialog.message}
      />
    </div>
  )
}
