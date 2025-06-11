import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BiCartAdd } from "react-icons/bi";
import FormInput from "@/components/formInput/FormInputCustom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { IMedicine } from "@/services/medicine/medicine.interface";

export interface BaseItemData {
  nombre: string;
  descripcion: string;
  categoria: string;
  medicina: boolean;
}

export interface MedicineSpecificData {
  temperatura: string;
  manufactura: string;
  principio_activo: string;
  forma: string;
}

export interface ProductSpecificData {
  unidad: string;
  cantidad: number;
}

export type MedicineData = BaseItemData &
  Partial<MedicineSpecificData> &
  Partial<ProductSpecificData>;

interface MedicineFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MedicineData) => void;
  medicine: IMedicine | null
}

const categoryOptions = [
  "Analgésicos",
  "Antibióticos",
  "Antiinflamatorios",
  "Vitaminas",
  "Higiene Personal",
  "Cuidado de la Piel",
  "Cuidado Dental",
  "Suplementos Nutricionales",
  "Accesorios Médicos",
  "Material de Curación",
  "Otros",
];

const unitOptions = [
  "Unidad(es)",
  "Caja(s)",
  "Paquete(s)",
  "Litro(s)",
  "Mililitro(s)",
  "Gramo(s)",
  "Kilogramo(s)",
  "Metro(s)",
  "Centímetro(s)",
  "Galón(es)",
  "Otros",
];

const formaOptions = [
  "Tableta",
  "Cápsula",
  "Jarabe",
  "Inyección",
  "Crema",
  "Gotas",
  "Polvo",
  "Supositorio",
  "Spray",
  "Gel",
  "Parche",
  "Solución",
  "Ampolla",
  "Inhalador",
  "Otro",
];

export const MedicineForm: React.FC<MedicineFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  medicine,
}) => {
  const [currentTab, setCurrentTab] = useState<"medicamento" | "producto">(
    "medicamento"
  );

  const {register,handleSubmit,reset,control,setValue,formState: { errors },} = useForm<MedicineData>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      categoria: "",
      medicina: true,
      unidad: "",
      cantidad: 0,
      temperatura: "",
      manufactura: "",
      principio_activo: "",
      forma: "",
    },
  });

  useEffect(() => {
    if (medicine) {
      reset({
        nombre: "",
        descripcion: "",
        categoria: "",
        medicina: currentTab === "medicamento",
        cantidad: 0,
        temperatura: "",
        manufactura: "",
        principio_activo: "",
        forma: "",
      });

      setValue("medicina", currentTab === "medicamento");
    }
  }, [open, reset, currentTab, setValue]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value as "medicamento" | "producto");
    setValue("medicina", value === "medicamento");
  };

  const handleFormSubmit = (data: MedicineData) => {
    if (data.medicina) {
      if (
        !data.temperatura ||
        !data.manufactura ||
        !data.principio_activo ||
        !data.forma
      ) {
        alert(
          "Por favor, complete todos los campos obligatorios para el medicamento."
        );
        return;
      }
    } else {
      if (
        !data.unidad ||
        data.cantidad === undefined ||
        data.cantidad === null
      ) {
        alert(
          "Por favor, complete todos los campos obligatorios para el producto."
        );
        return;
      }
    }
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg manrope max-h-[95vh] overflow-y-auto bg-gray-300">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">
            Agregar Nuevo Elemento
          </DialogTitle>
          <DialogDescription className="manrope">
            Selecciona si deseas agregar un medicamento o un producto.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="medicamento"
          className="w-full gap-2"
          onValueChange={handleTabChange}
          value={currentTab}
        >
          <TabsList className="w-full flex gap-1 bg-gray-200 rounded-lg p-1">
            <TabsTrigger
              value="medicamento"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-800 data-[state=active]:to-[#58c0e9] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:transition-all data-[state=active]:duration-300 data-[state=active]:ease-in-out text-gray-700 hover:bg-gray-300 hover:text-gray-900"
            >
              Medicamento
            </TabsTrigger>
            <TabsTrigger
              value="producto"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-800 data-[state=active]:to-[#58c0e9] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:transition-all data-[state=active]:duration-300 data-[state=active]:ease-in-out text-gray-700 hover:bg-gray-300 hover:text-gray-900"
            >
              Producto
            </TabsTrigger>
          </TabsList>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid gap-4 py-4"
          >
            <FormInput
              label="Nombre"
              id="nombre"
              autoFocus
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
              })}
              error={errors.nombre?.message}
            />
            <FormInput
              label="Descripción"
              id="descripcion"
              {...register("descripcion", {
                required: "La descripción es obligatoria",
              })}
              error={errors.descripcion?.message}
            />

            <Controller
              name="categoria"
              control={control}
              rules={{ required: "La categoría es obligatoria" }}
              render={({ field }) => (
                <div className="space-y-1">
                  <label
                    htmlFor="categoria-select"
                    className="text-sm font-medium leading-none"
                  >
                    Categoría
                  </label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full" id="categoria-select">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categorías</SelectLabel>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.categoria && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.categoria.message}
                    </p>
                  )}
                </div>
              )}
            />

            {currentTab === "medicamento" && (
              <TabsContent value="medicamento" className="mt-0">
                <input type="hidden" {...register("medicina")} />

                <FormInput
                  label="Temperatura de Almacenamiento"
                  id="temperatura"
                  {...register("temperatura", {
                    required:
                      currentTab === "medicamento"
                        ? "La temperatura es obligatoria"
                        : false,
                  })}
                  error={errors.temperatura?.message}
                />
                <FormInput
                  label="Manufactura"
                  id="manufactura"
                  {...register("manufactura", {
                    required:
                      currentTab === "medicamento"
                        ? "La manufactura es obligatoria"
                        : false,
                  })}
                  error={errors.manufactura?.message}
                />
                <FormInput
                  label="Principio Activo"
                  id="principio_activo"
                  {...register("principio_activo", {
                    required:
                      currentTab === "medicamento"
                        ? "El principio activo es obligatorio"
                        : false,
                  })}
                  error={errors.principio_activo?.message}
                />

                <Controller
                  name="forma"
                  control={control}
                  rules={{
                    required:
                      currentTab === "medicamento"
                        ? "La forma es obligatoria"
                        : false,
                  }}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <label
                        htmlFor="forma-select"
                        className="text-sm font-medium leading-none"
                      >
                        Forma
                      </label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full" id="forma-select">
                          <SelectValue placeholder="Selecciona una forma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Formas de Medicamentos</SelectLabel>
                            {formaOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.forma && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.forma.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </TabsContent>
            )}

            {currentTab === "producto" && (
              <TabsContent value="producto" className="mt-0">
                <input type="hidden" {...register("medicina")} />

                <Controller
                  name="unidad"
                  control={control}
                  rules={{
                    required:
                      currentTab === "producto"
                        ? "La unidad es obligatoria"
                        : false,
                  }}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <label
                        htmlFor="unidad-select"
                        className="text-sm font-medium leading-none"
                      >
                        Unidad
                      </label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full" id="unidad-select">
                          <SelectValue placeholder="Selecciona una unidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Unidades</SelectLabel>
                            {unitOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.unidad && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.unidad.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <FormInput
                  label="Cantidad"
                  id="cantidad"
                  type="number"
                  min="0"
                  {...register("cantidad", {
                    required:
                      currentTab === "producto"
                        ? "La cantidad es obligatoria"
                        : false,
                    min: {
                      value: 0,
                      message: "La cantidad no puede ser negativa",
                    },
                    valueAsNumber: true,
                  })}
                  error={errors.cantidad?.message}
                />
              </TabsContent>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="animated"
                className="p-3 w-[25%] h-[90%] bg-gradient-to-r from-blue-800 to-[#58c0e9]"
                type="submit"
              >
                <BiCartAdd className="self-center size-5" /> Agregar
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
