
import { User } from "./types";
import { FaRegSave } from "react-icons/fa";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import StyledInput from "./StyledInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


interface EditUserFormProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedUser: User) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  user,
  open,
  onOpenChange,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    defaultValues: user || {
      id: 0,
      nombre: "",
      usuario: "",
      correo: "",
    },
  });

  useEffect(() => {
    reset(user || { id: 0, nombre: "", usuario: "", correo: "" });
  }, [user, reset]);

  const onSubmit = (data: User) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gray-300">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">Editar Usuario</DialogTitle>
          <DialogDescription className="manrope">
            Modifica los datos del usuario y guarda los cambios.
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
      className="p-3 w-[25%] h-[90%] bg-gradient-to-r from-blue-800 to-[#58c0e9]"
      type="submit"
    >
      <FaRegSave className="self-center size-5" />
      Guardar
    </Button>
  </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserForm;
