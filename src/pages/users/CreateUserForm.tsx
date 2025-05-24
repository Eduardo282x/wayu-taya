import React, { useEffect } from "react";
import { TiUserAddOutline } from "react-icons/ti";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";


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
            <label className="block text-sm font-medium mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              {...register("nombre", { required: "El nombre es obligatorio" })}
              className="w-full rounded focus:outline-1 focus:outline-blue-800 px-3 py-2 bg-white shadow-xl border-1 border-gray-400"
              autoFocus
            />
            {errors.nombre && (
              <p className="text-sm text-red-600 mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent" htmlFor="usuario">
              Usuario
            </label>
            <input
              id="usuario"
              {...register("usuario", { required: "El usuario es obligatorio" })}
              className="w-full rounded focus:outline-1 focus:outline-blue-800 px-3 py-2 bg-white shadow-xl border-1 border-gray-400"
            />
            {errors.usuario && (
              <p className="text-sm text-red-600 mt-1">{errors.usuario.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent" htmlFor="correo">
              Correo
            </label>
            <input
              id="correo"
              type="email"
              {...register("correo", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Correo inválido",
                },
              })}
              className="w-full rounded focus:outline-1 focus:outline-blue-800 px-3 py-2 bg-white shadow-xl border-1 border-gray-400"
            />
            {errors.correo && (
              <p className="text-sm text-red-600 mt-1">{errors.correo.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button className='bg-[#1d31b1] p-3 w-[25%] text-white rounded-2xl hover:bg-gradient-to-r from-blue-800 to-[#34A8D5] cursor-pointer flex justify-evenly' type="submit"><TiUserAddOutline className="self-center size-5"/>Crear</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserForm;
