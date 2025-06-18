import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdDomainAdd } from "react-icons/md";
import FormInput from "@/components/formInput/FormInputCustom";
import { IStore } from "@/services/store/store.interface";
import { StoreData } from "./store.data";


interface StoreFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StoreData) => void;
  store: IStore | null;
}

export const StoreForm: React.FC<StoreFormProps> = ({ open, onOpenChange, onSubmit, store, }) => {
  const { register, handleSubmit, reset, formState: { errors }, } = useForm<StoreData>({
    defaultValues: {
      name: "",
      address: "",
    },
  });

  useEffect(() => {
    if (store) {
      reset({
        name: store.name,
        address: store.address,
      });
    }
  }, [open, reset, store]);

  const handleFormSubmit = (data: StoreData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg manrope max-h-[95vh] overflow-y-auto bg-gray-300">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">
            {store ? "Editar Almacén" : "Registrar Nuevo Almacén"}{" "}
          </DialogTitle>
          <DialogDescription className="manrope">
            Completa los datos del almacén.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid gap-4 py-4"
        >
          <FormInput
            label="Nombre del Almacén"
            id="name"
            autoFocus
            placeholder="Almacén Principal"
            {...register("name", {
              required: "El nombre del almacén es obligatorio",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
            })}
            error={errors.name?.message}
          />

          <FormInput
            label="Dirección"
            id="address"
            placeholder="Av. 15 Delicias, C.C. Galerías"
            {...register("address", {
              required: "La dirección es obligatoria",
              minLength: { value: 5, message: "Mínimo 5 caracteres" },
            })}
            error={errors.address?.message}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="animated"
              className="p-3 min-w-[150px] w-auto h-[90%] bg-gradient-to-r from-blue-800 to-[#58c0e9]"
              type="submit"
            >
              <MdDomainAdd className="self-center size-5" />{" "}
              {store ? "Guardar Cambios" : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
