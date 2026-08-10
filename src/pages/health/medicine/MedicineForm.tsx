import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BiCartAdd } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import FormInput from "@/components/formInput/FormInputCustom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IMedicine, MedicineBody, Category, Form } from "@/services/medicine/medicine.interface";
import { baseMedicine } from "./medicine.data";
import { FormAutocompleteV2 } from "@/components/formInput/FormAutoCompleteCustomV2";


interface MedicineFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MedicineBody) => void;
  medicineData: IMedicine | null;
  categories: Category[];
  forms: Form[];
}

export const MedicineForm: React.FC<MedicineFormProps> = ({ open, onOpenChange, onSubmit, medicineData, categories, forms }) => {
  const [currentTab, setCurrentTab] = useState<"medicamento" | "producto">("medicamento");

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<MedicineBody>({
    defaultValues: baseMedicine,
  });

  useEffect(() => {
    if (medicineData) {
      reset({
        name: medicineData.name,
        description: medicineData.description,
        code: medicineData.code ?? "",
        category: medicineData.category?.category ?? "",
        medicine: medicineData.medicine,
        presentation: medicineData.presentation ?? "",
        temperate: medicineData.temperate ?? "",
        manufacturer: medicineData.manufacturer ?? "",
        activeIngredient: medicineData.activeIngredient ?? "",
        countryOfOrigin: medicineData.countryOfOrigin ?? "",
        form: medicineData.form?.forms ?? "",
      });

      setCurrentTab(medicineData.medicine ? "medicamento" : "producto");
    } else {
      reset(baseMedicine)
    }
  }, [open, reset, medicineData]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value as "medicamento" | "producto");
    setValue("medicine", value === "medicamento");

    if (value === "producto") {
      setValue("temperate", "");
      setValue("manufacturer", "");
      setValue("activeIngredient", "");
      setValue("presentation", "");
      setValue("form", "");
    }
  };

  const handleFormSubmit = (formData: MedicineBody) => {
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 px-2 pb-4 pt-1 border-b-2 border-gray-300">
        <div>
          <h2 className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">
            {medicineData ? "Editar Elemento" : "Agregar Nuevo Elemento"}
          </h2>
          <p className="manrope text-sm text-gray-600">
            {medicineData
              ? "Modifica los datos del elemento y guarda los cambios."
              : "Completa los datos para registrar un nuevo elemento."}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="flex items-center gap-2"
        >
          <FaArrowLeft /> Volver
        </Button>
      </div>

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
          className="grid grid-cols-3 gap-2 p-4 overflow-y-auto"
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
            data={categories.map(ca => ({ label: ca.category, value: ca.category }))}
            label="Categoría"
            freeText
            appendTo='body'
            valueDefault={watch('category')}
            placeholder="Seleccionar o escribir una categoría"
            onChange={(value) => setValue('category', value)}
          />

          <input type="hidden" {...register("medicine")} />

          {currentTab === "medicamento" && (
            <TabsContent value="medicamento" className="col-span-3 grid grid-cols-3 mt-0 gap-2 ">
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

              <FormAutocompleteV2
                data={forms.map(f => ({ label: f.forms, value: f.forms }))}
                label="Forma"
                freeText
                appendTo='body'
                valueDefault={watch('form')}
                placeholder="Seleccionar o escribir una forma"
                onChange={(value) => setValue('form', value)}
              />

              <FormInput
                label="Presentación"
                id="presentacion"
                placeholder="500 mg"
                {...register("presentation", {
                  required:
                    currentTab === "medicamento"
                      ? "La presentación es obligatoria"
                      : false,
                })}
                error={errors.presentation?.message}
              />

              <FormInput
                label="País de Origen"
                id="pais_origen"
                placeholder="Venezuela"
                {...register("countryOfOrigin")}
              />
            </TabsContent>
          )}

          {currentTab === "producto" && (
            <TabsContent value="producto" className="mt-0">
              <input type="hidden" {...register("medicine")} />
            </TabsContent>
          )}

          <div className="col-span-3 flex items-center justify-center pt-4">
            <Button
              variant="animated"
              className="p-3 w-[25%] h-[90%] bg-gradient-to-r from-blue-800 to-[#58c0e9]"
              type="submit"
            >
              <BiCartAdd className="self-center size-5" /> {medicineData ? "Guardar" : "Agregar"}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
};
