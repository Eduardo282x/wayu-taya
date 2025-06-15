import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BiCartAdd } from "react-icons/bi";
import FormInput from "@/components/formInput/FormInputCustom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IMedicine,
  MedicineBody,
  Category,
  Form,
} from "@/services/medicine/medicine.interface";

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
  unidad: string;
  cantidad: number;
}

export interface ProductSpecificData {}

export type FormDataInternal = BaseItemData &
  Partial<MedicineSpecificData> &
  Partial<ProductSpecificData>;

interface MedicineFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  onSubmit: (data: MedicineBody) => void;
  medicine: IMedicine | null;
  categories: Category[];
  forms: Form[];
}

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

export const MedicineForm: React.FC<MedicineFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  medicine,
  categories,
  forms,
}) => {
  const [currentTab, setCurrentTab] = useState<"medicamento" | "producto">(
    "medicamento"
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormDataInternal>({
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
    if (open) {
      if (medicine) {
        reset({
          nombre: medicine.name,
          descripcion: medicine.description,
          categoria: medicine.category ? medicine.category.category : "",
          medicina: medicine.medicine,
          temperatura: medicine.temperate || "",
          manufactura: medicine.manufacturer || "",
          principio_activo: medicine.activeIngredient || "",
          forma: medicine.form ? medicine.form.forms : "",
          unidad: medicine.unit || "",
          cantidad: medicine.amount || 0,
        });

        setCurrentTab(medicine.medicine ? "medicamento" : "producto");
      } else {
        reset({
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
        });
        setCurrentTab("medicamento");
      }
    }
  }, [open, reset, medicine, setCurrentTab, categories, forms]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value as "medicamento" | "producto");
    setValue("medicina", value === "medicamento");

    if (value === "producto") {
      setValue("temperatura", "");
      setValue("manufactura", "");
      setValue("principio_activo", "");
      setValue("forma", "");
    }
  };

  const handleFormSubmit = (formData: FormDataInternal) => {
    if (formData.medicina) {
      if (
        !formData.temperatura ||
        !formData.manufactura ||
        !formData.principio_activo ||
        !formData.forma ||
        !formData.unidad ||
        formData.cantidad === undefined ||
        formData.cantidad === null
      ) {
        alert(
          "Por favor, complete todos los campos obligatorios para el medicamento."
        );
        return;
      }
    }

    const selectedCategory = categories.find(
      (cat) => cat.category === formData.categoria
    );
    const categoryIdToSend = selectedCategory ? selectedCategory.id : 0;

    let formIdToSend: number | undefined = undefined;
    if (formData.medicina && formData.forma) {
      const selectedForm = forms.find((f) => f.forms === formData.forma);
      formIdToSend = selectedForm ? selectedForm.id : 0;
    }

    const apiData: MedicineBody = {
      name: formData.nombre,
      description: formData.descripcion,
      categoryId: categoryIdToSend,
      medicine: formData.medicina,
      unit: formData.unidad || "",
      amount: formData.cantidad ?? 0,
      temperate: formData.temperatura || "",
      manufacturer: formData.manufactura || "",
      activeIngredient: formData.principio_activo || "",
      formId: formIdToSend || 0,
    };

    onSubmit(apiData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg manrope max-h-[95vh] overflow-y-auto bg-gray-300">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">
            {medicine ? "Editar Elemento" : "Agregar Nuevo Elemento"}{" "}
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
              placeholder="Ibuprofeno"
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
              })}
              error={errors.nombre?.message}
            />
            <FormInput
              label="Descripción"
              id="descripcion"
              placeholder="Analgésico para el dolor"
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
                        {categories.map((option) => (
                          <SelectItem key={option.id} value={option.category}>
                            {option.category}
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
                  placeholder="Ambiente"
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
                  placeholder="Bayer"
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
                  placeholder="Paracetamol"
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
                            {forms.map((option) => (
                              <SelectItem key={option.id} value={option.forms}>
                                {option.forms}
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

                <Controller
                  name="unidad"
                  control={control}
                  rules={{
                    required:
                      currentTab === "medicamento"
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
                  placeholder="500"
                  {...register("cantidad", {
                    required:
                      currentTab === "medicamento"
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

            {currentTab === "producto" && (
              <TabsContent value="producto" className="mt-0">
                <input type="hidden" {...register("medicina")} />
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
