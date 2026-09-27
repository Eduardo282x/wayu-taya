import type React from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { FaRegSave, FaArrowLeft } from "react-icons/fa"
import { TiUserAddOutline } from "react-icons/ti"
import FormInputCustom from "@/components/formInput/FormInputCustom"
import { IUsers, Role, UsersBody } from "@/services/users/user.interface"
import FormSelectCustom from "@/components/formInput/FormSelectCustom"
import { emailSchema, lastNameSchema, nameSchema, passwordSchema, usernameSchema, PASSWORD_MAX, PASSWORD_MIN } from "@/lib/validation"

interface UsersFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (user: UsersBody) => void
  user?: IUsers | null
  roles: Role[]
}

type FormValues = {
  name: string
  lastName: string
  username: string
  correo: string
  rolId: number
  password: string
}

/**
 * Un solo esquema para alta y edicion.
 *
 * `password` se valida siempre, pero en edicion ni se muestra ni se envia: lo
 * irrelevante se vuelve irrelevante tambien para el validador, y asi el tipo
 * que infiere zod coincide con el de `useForm` sin gymnastics de tipos.
 */
const usersFormSchema = z.object({
  name: nameSchema,
  lastName: lastNameSchema,
  username: usernameSchema,
  // `correo` es obligatorio en POST /users y en PUT /users/:id. Antes el
  // formulario no lo tenia y el alta fallaba con 400.
  correo: emailSchema,
  // El select de abajo entrega el id como texto ("3"), no como numero, y se
  // convierte a `Number` en su `onValueChange`. OJO: no usar `setValueAs` en un
  // `register` esparcido sobre `FormSelectCustom`, porque RHF solo lo aplica
  // cuando el evento trae `target.type`, y ese componente emite un evento
  // sintetico sin `type`. El id llegaria como texto y esto daria "El rol es
  // requerido" con el campo visiblemente lleno.
  rolId: z.number({ message: "El rol es requerido" }).min(1, { message: "Selecciona un rol" }),
  // Cadena vacia = sin contrasena, y entonces el backend genera una temporal.
  // Cualquier otro valor tiene que cumplir las reglas de complejidad.
  password: z
    .string()
    .refine((value) => value === "" || passwordSchema.safeParse(value).success, {
      message: `La contraseña debe tener entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres, con minúscula, mayúscula y número`,
    }),
})

const UsersForm: React.FC<UsersFormProps> = ({ open, onOpenChange, onSubmit, user, roles }) => {
  const isEdit = !!user

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      lastName: '',
      username: '',
      correo: '',
      rolId: 0,
      password: '',
    },
    resolver: zodResolver(usersFormSchema),
  })

  // `rolId` se registra pero NO se esparce como prop del select. El select se
  // controla con `setValue` (ver mas abajo) porque el evento sintetico que
  // emite `FormSelectCustom` no atraviesa las transformaciones de RHF.
  register("rolId")

  useEffect(() => {
    if (user) {
      // `GET /users` no devuelve `rolId`, solo el nombre del rol. Se resuelve el
      // id cruzando contra `GET /users/roles`. Si no encuentra coincidencia se
      // deja en 0, que el esquema rechaza con "Selecciona un rol": es preferible
      // a mandar un rol equivocado en silencio.
      const resolvedRolId = roles.find((role) => role.rol === user.rol?.rol)?.id ?? 0

      reset({
        name: user.name,
        lastName: user.lastName,
        username: user.username,
        correo: user.correo,
        rolId: resolvedRolId,
        password: '',
      })
    } else {
      reset({ name: '', lastName: '', username: '', correo: '', rolId: 0, password: '' })
    }
  }, [open, user, roles, reset])

  const onValid = (values: FormValues) => {
    const payload: UsersBody = {
      username: values.username,
      name: values.name,
      lastName: values.lastName,
      correo: values.correo,
      rolId: Number(values.rolId),
    }

    // Solo al crear. En edicion, `password` no se manda jamas.
    if (!isEdit && values.password) {
      payload.password = values.password
    }

    onSubmit(payload)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 px-2 pb-4 pt-4 lg:pt-0 border-b-2 border-gray-300 relative">
        <div>
          <h2 className="bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent manrope text-2xl">
            {isEdit ? "Editar Usuario" : "Crear Usuario"}
          </h2>
          <p className="manrope text-sm text-gray-600">
            {isEdit
              ? "Modifica los datos del usuario. La contraseña no se cambia aquí."
              : "Completa los datos para crear un nuevo usuario."}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="flex items-center gap-2 absolute right-2 top-7 -translate-y-1/2"
        >
          <FaArrowLeft /> Volver
        </Button>
      </div>

      <form onSubmit={handleSubmit(onValid)} className="space-y-4 lg:space-y-0 lg:grid grid-cols-2 gap-4 py-4 lg:px-4 overflow-y-auto">
        <div>
          <FormInputCustom
            label="Nombre"
            id="nombre"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>

        <div>
          <FormInputCustom
            label="Apellido"
            id="apellido"
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </div>

        <div>
          <FormInputCustom
            label="Usuario"
            id="usuario"
            {...register("username")}
            error={errors.username?.message}
          />
          <p className="text-xs text-gray-500 manrope mt-1">Con este usuario se inicia sesión.</p>
        </div>

        <div>
          <FormInputCustom
            label="Correo"
            id="correo"
            type="email"
            {...register("correo")}
            error={errors.correo?.message}
          />
        </div>

        <div>
          <FormSelectCustom
            label="Rol"
            id="rol"
            name="rolId"
            options={roles.map((item) => ({ label: item.rol, value: item.id.toString() }))}
            placeholder="Selecciona un rol"
            value={watch("rolId")}
            onValueChange={(value) =>
              setValue("rolId", Number(value), { shouldValidate: true, shouldDirty: true })
            }
            error={errors.rolId?.message}
          />
        </div>

        {!isEdit && (
          <div>
            <FormInputCustom
              label="Contraseña"
              id="password"
              type="password"
              autoComplete="new-password"
              required={false}
              {...register("password")}
              error={errors.password?.message}
            />
            <p className="text-xs text-gray-500 manrope mt-1">
              Opcional. Si la dejas vacía, el sistema genera una temporal y te la mostrará.
            </p>
          </div>
        )}

        <div className="col-span-2 flex items-center justify-center mt-5">
          <Button
            variant="animated"
            className="w-full lg:w-1/2 h-[90%] bg-linear-to-r from-blue-800 to-[#58c0e9]"
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
