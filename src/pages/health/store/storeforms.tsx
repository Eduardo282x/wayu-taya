import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogHeader,
  StyledDialogTitle,
  StyledDialogDescription,
} from "@/components/StyledDialog/StyledDialog";
import { Button } from "@/components/ui/button";
import { FaRegSave } from "react-icons/fa";
import { TiUserAddOutline } from "react-icons/ti";
import FormInputCustom from "@/components/formInput/FormInputCustom";
import { IAlmacen, AlmacenBody } from "@/pages/health/store/store.interface";

interface AlmacenFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (almacen: AlmacenBody) => void;
  almacen?: IAlmacen | null;
}

const AlmacenForm: React.FC<AlmacenFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  almacen,
}) => {
  const isEdit = !!almacen;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AlmacenBody>({
    defaultValues: {
      nombre: "",
      direccion: "",
    },
  });

  useEffect(() => {
    if (almacen) {
      const almacenData = {
        nombre: almacen.nombre,
        direccion: almacen.direccion,
      };
      reset(almacenData);
    }
  }, [open, almacen, reset]);

  return (
    <StyledDialog open={open} onOpenChange={onOpenChange}>
      <StyledDialogContent>
        <StyledDialogHeader>
          <StyledDialogTitle>
            {isEdit ? "Editar Almacén" : "Añadir Almacén"}
          </StyledDialogTitle>
          <StyledDialogDescription>
            {isEdit
              ? "Modifica los datos del almacén y guarda los cambios."
              : "Completa los datos para añadir un nuevo almacén."}
          </StyledDialogDescription>
        </StyledDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <FormInputCustom
              label="Nombre del Almacén"
              id="nombre"
              autoFocus
              {...register("nombre", {
                required: "El nombre del almacén es obligatorio",
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                  message:
                    "El nombre no puede contener números ni caracteres especiales",
                },
              })}
              error={errors.nombre?.message}
            />
          </div>

          <div>
            <FormInputCustom
              label="Dirección"
              id="direccion"
              {...register("direccion", {
                required: "La dirección es obligatoria",
              })}
              error={errors.direccion?.message}
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
                  <TiUserAddOutline className="self-center size-5" /> Añadir
                </>
              )}
            </Button>
          </div>
        </form>
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default AlmacenForm;
