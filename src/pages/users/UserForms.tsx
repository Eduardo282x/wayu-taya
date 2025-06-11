// src/pages/users/UserForms.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaRegSave } from "react-icons/fa";
import { TiUserAddOutline } from "react-icons/ti";
import FormInput from "@/components/formInput/FormInputCustom";
import { IUsers, UsersBody } from "@/services/users/user.interface";

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  usuario: string;
  correo: string;
}

interface UsersFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (user: UsersBody) => void;
  user?: IUsers | null;
}

const UsersForm: React.FC<UsersFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  user,
}) => {
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UsersBody>({
    defaultValues: user || {
      name: "",
      lastName: "",
      username: "",
      correo: "",
    },
  });

  useEffect(() => {
    if (user)
      reset(user);
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg manrope bg-gray-300">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">
            {isEdit ? "Editar Usuario" : "Crear Usuario"}
          </DialogTitle>
          <DialogDescription className="manrope">
            {isEdit
              ? "Modifica los datos del usuario y guarda los cambios."
              : "Completa los datos para crear un nuevo usuario."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <FormInput
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
            <FormInput
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
            <FormInput
              label="Usuario"
              id="usuario"
              {...register("username", {
                required: "El usuario es obligatorio",
              })}
              error={errors.username?.message}
            />
          </div>

          <div>
            <FormInput
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
      </DialogContent>
    </Dialog>
  );
};

export default UsersForm;
