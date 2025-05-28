import React, { useEffect } from "react";
import { TiUserAddOutline } from "react-icons/ti";
import { useForm } from "react-hook-form";
import StyledInput from "./StyledInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


export interface User {
  id: number;
  nombre: string;
  usuario: string;
  correo: string;
}

interface CreateUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (newUser: Omit<User, "id">) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  open,
  onOpenChange,
  onCreate,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<User, "id">>({
    defaultValues: {
      nombre: "",
      usuario: "",
      correo: "",
    },
  });

 
  useEffect(() => {
    if (open) {
      reset({
        nombre: "",
        usuario: "",
        correo: "",
      });
    }
  }, [open, reset]);

  const onSubmit = (data: Omit<User, "id">) => {
    onCreate(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gray-300">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">Crear Usuario</DialogTitle>
          <DialogDescription className="manrope">
            Completa los datos para crear un nuevo usuario.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4 manrope">
        <div>
          <StyledInput
            label="Nombre"
            id="nombre"
            autoFocus
            {...register("nombre", {
              required: "El nombre es obligatorio",
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, // Solo letras y espacios (incluye acentos y ñ)
                message: "El nombre no puede contener números ni caracteres especiales",
              },
            })}
          />
          {errors.nombre && (
            <p className="text-sm text-red-600 mt-1">{errors.nombre.message}</p>
          )}
        </div>


      <div>
        <StyledInput
          label="Usuario"
          id="usuario"
          {...register("usuario", { required: "El usuario es obligatorio" })}
        />
        {errors.usuario && (
          <p className="text-sm text-red-600 mt-1">{errors.usuario.message}</p>
        )}
      </div>

      <div>
        <StyledInput
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
        />
        {errors.correo && (
          <p className="text-sm text-red-600 mt-1">{errors.correo.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="usuarioForm"
          className="p-3 w-[22%] h-[90%] bg-gradient-to-r from-blue-800 to-[#3da6cf]"
          type="submit"
        >
          <TiUserAddOutline className="self-center size-5" />
          Crear
        </Button>
      </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserForm;
