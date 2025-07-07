import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BiCartAdd } from "react-icons/bi";
import FormInput from "@/components/formInput/FormInputCustom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { IMedicine, MedicineBody, ICategory, IForm } from "@/services/medicine/medicine.interface";
import { baseMedicine } from "./medicine.data";
import { FormAutocompleteV2 } from "@/components/formInput/FormAutoCompleteCustomV2";


interface MedicineFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MedicineBody) => void;
  medicineData: IMedicine | null;
  categories: ICategory[];
  forms: IForm[];
}

const unitOptions = [
  "Unidad(es) (ud)",
  "Caja(s) (caja)",
  "Blíster(s) (bl)",
  "Dosis (dosis)",
  "Vial(es) (vial)",
  "Ampolla(s) (amp)",
  "Miligramos (mg)",
  "Gramos (g)",
  "Microgramos (μg)",
  "Mililitros (mL)",
  "Litros (L)",
  "Tabletas (tab)",
  "Cápsulas (cap)",
  "Supositorios (sup)",
  "Óvulos (óv)",
  "Parches (pch)",
  "Inhaladores (inh)",
  "Frascos (frasco)",
  "Tubos (tubo)",
  "Jeringas (jer)",
  "Gotas (gtt)",
  "Sprays (spr)",
  "Sobres (sobre)",
  "Otros",
];

export const MedicineForm: React.FC<MedicineFormProps> = ({ open, onOpenChange, onSubmit, medicineData, categories, forms }) => {
  const [currentTab, setCurrentTab] = useState<"medicamento" | "producto">("medicamento");

  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm<MedicineBody>({
    defaultValues: baseMedicine,
  });

  useEffect(() => {
    if (medicineData) {
      reset({
        name: medicineData.name,
        description: medicineData.description,
        categoryId: medicineData.categoryId,
        medicine: medicineData.medicine,
        unit: medicineData.unit,
        amount: medicineData.amount,
        temperate: medicineData.temperate,
        manufacturer: medicineData.manufacturer,
        activeIngredient: medicineData.activeIngredient,
        formId: medicineData.formId || 0,
        benefited: medicineData.benefited || 0,
      });

      setCurrentTab(medicineData.medicine ? "medicamento" : "producto");
    } else {
      reset(baseMedicine)
    }
  }, [open, reset, medicineData, categories, forms]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value as "medicamento" | "producto");
    setValue("medicine", value === "medicamento");

    if (value === "producto") {
      setValue("temperate", "");
      setValue("manufacturer", "");
      setValue("activeIngredient", "");
      setValue("formId", 14)
    }
  };

  const handleFormSubmit = (formData: MedicineBody) => {
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg manrope max-h-[95vh] overflow-y-auto bg-gray-300">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">
            {medicineData ? "Editar Elemento" : "Agregar Nuevo Elemento"}{" "}
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
            className="grid gap-2 pt-2"
          >
            <FormInput
              label="Nombre"
              id="nombre"
              autoFocus
              placeholder="Ibuprofeno"
              {...register("name", {
                required: "El nombre es obligatorio",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
              })}
              error={errors.name?.message}
            />
            <FormInput
              label="Descripción"
              id="descripcion"
              placeholder="Analgésico para el dolor"
              {...register("description", {
                required: "La descripción es obligatoria",
              })}
              error={errors.description?.message}
            />

            <FormAutocompleteV2
              data={categories.map(ca => ({ label: ca.category, value: ca.id.toString() }))}
              label={"Categorías"}
              valueDefault={watch('categoryId')}
              placeholder={"Seleccionar una categoría"}
              onChange={(value) => setValue('categoryId', Number(value))}
            />

            {currentTab === "medicamento" && (
              <TabsContent value="medicamento" className="mt-0 flex flex-col gap-2">
                <input type="hidden" {...register("medicine")} />

                <FormInput
                  label="Temperatura de Almacenamiento"
                  id="temperatura"
                  placeholder="Ambiente"
                  {...register("temperate", {
                    required:
                      currentTab === "medicamento"
                        ? "La temperatura es obligatoria"
                        : false,
                  })}
                  error={errors.temperate?.message}
                />
                <FormInput
                  label="Manufactura"
                  id="manufactura"
                  placeholder="Bayer"
                  {...register("manufacturer", {
                    required:
                      currentTab === "medicamento"
                        ? "La manufactura es obligatoria"
                        : false,
                  })}
                  error={errors.manufacturer?.message}
                />
                <FormInput
                  label="Principio Activo"
                  id="principio_activo"
                  placeholder="Paracetamol"
                  {...register("activeIngredient", {
                    required:
                      currentTab === "medicamento"
                        ? "El principio activo es obligatorio"
                        : false,
                  })}
                  error={errors.activeIngredient?.message}
                />

                <Controller
                  name="formId"
                  control={control}
                  rules={{
                    required:
                      currentTab === "medicamento"
                        ? "La forma es obligatoria"
                        : false,
                  }}
                  render={({ field }) => (
                    <FormAutocompleteV2
                      data={forms.map(ca => ({ label: ca.forms, value: ca.id.toString() }))}
                      label={"Forma"}
                      valueDefault={field.value}
                      placeholder={"Seleccionar una Forma"}
                      onChange={(value) => setValue('formId', Number(value))}
                    />
                  )}
                />

                <div className="flex items-start gap-2">
                  <FormInput
                    label="Cantidad"
                    id="cantidad"
                    type="number"
                    min="0"
                    placeholder="500"
                    {...register("amount", {
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
                    error={errors.amount?.message}
                  />

                  <Controller
                    name="unit"
                    control={control}
                    rules={{
                      required:
                        currentTab === "medicamento"
                          ? "La unidad es obligatoria"
                          : false,
                    }}
                    render={({ field }) => (
                      <div className="space-y-1 w-1/2">
                        <label
                          htmlFor="unidad-select"
                          className="text-sm font-medium leading-none text-blue-800"
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
                        {errors.unit && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.unit.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>


              </TabsContent>
            )}

            <FormInput
              label="Beneficiados"
              id="benefited"
              type="number"
              min="0"
              placeholder="1"
              {...register("benefited", {
                required:
                  currentTab === "medicamento"
                    ? "La cantidad es obligatoria"
                    : false,
                min: {
                  value: 1,
                  message: "La cantidad no puede ser negativa",
                },
                valueAsNumber: true,
              })}
              error={errors.benefited?.message}
            />

            {currentTab === "producto" && (
              <TabsContent value="producto" className="mt-0">
                <input type="hidden" {...register("medicine")} />
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
