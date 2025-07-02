import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaRegSave } from "react-icons/fa";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import FormInputCustom from "@/components/formInput/FormInputCustom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICategory, IForm, TabOptionCategoryForm } from "@/services/medicine/medicine.interface";

interface CategoryAndFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ICategory | IForm) => void;
  itemData: ICategory | IForm | null;
  initialTab: TabOptionCategoryForm;
}

export const CategoryAndFormDialog: React.FC<CategoryAndFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  itemData,
  initialTab = "category",
}) => {
  const isEdit = !!itemData;
  const [currentTab, setCurrentTab] = useState<TabOptionCategoryForm>(initialTab);

  const { register, handleSubmit, reset, } = useForm<ICategory | IForm>({
    defaultValues: {
      category: "",
      forms: "",
    },
  });

  useEffect(() => {
    setCurrentTab(initialTab);
    if (itemData && initialTab == 'category') {
      const parseData: ICategory = itemData as ICategory;
      reset({ category: parseData.category })
    }
    if (itemData && initialTab == 'form') {
      const parseData: IForm = itemData as IForm;
      reset({ forms: parseData.forms })
    }
  }, [open, itemData, reset, initialTab]);

  const handleTabChange = (value: string) => {
    const newType = value as TabOptionCategoryForm;
    setCurrentTab(newType);
  };

  const handleSubmitCategoryForm = (data: ICategory | IForm) => {
    const sendData = {
      ...data,
      initialTab
    }
    onSubmit(sendData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg manrope max-h-[95vh] overflow-y-auto bg-gray-300">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">
            {isEdit
              ? `Editar ${currentTab === "category" ? "Categoría" : "Forma"}`
              : `Agregar ${currentTab === "category" ? "Nueva Categoría" : "Nueva Forma"
              }`}
          </DialogTitle>
          <DialogDescription className="manrope">
            {isEdit
              ? `Modifica los datos de ${currentTab === "category" ? "la categoría" : "la forma"
              } y guarda los cambios.`
              : `Ingresa los datos para agregar ${currentTab === "category"
                ? "una nueva categoría"
                : "una nueva forma"
              }.`}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue={currentTab}
          className="w-full gap-2"
          onValueChange={handleTabChange}
          value={currentTab}
        >
          <TabsList className="w-full flex gap-1 bg-gray-200 rounded-lg p-1">
            <TabsTrigger
              value="category"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-800 data-[state=active]:to-[#58c0e9] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:transition-all data-[state=active]:duration-300 data-[state=active]:ease-in-out text-gray-700 hover:bg-gray-300 hover:text-gray-900"
            >
              Categoría
            </TabsTrigger>
            <TabsTrigger
              value="form"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-800 data-[state=active]:to-[#58c0e9] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:transition-all data-[state=active]:duration-300 data-[state=active]:ease-in-out text-gray-700 hover:bg-gray-300 hover:text-gray-900"
            >
              Forma
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(handleSubmitCategoryForm)} className="pt-2">
            <TabsContent value="category" className="mt-0 flex flex-col gap-2">
              <FormInputCustom
                label={`Nombre de la ${currentTab === "category" ? "Categoría" : "Forma"}`}
                id="name"
                autoFocus
                placeholder={`E.g., ${currentTab === "category" ? "Analgésicos" : "Tableta"}`}
                {...register("category", {
                  required: `El nombre de la ${currentTab === "category" ? "categoría" : "forma"} es obligatorio`,
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                })}
              />
            </TabsContent>

            <TabsContent value="form" className="mt-0 flex flex-col gap-2">
              <FormInputCustom
                label={`Nombre de la ${currentTab === "category" ? "Categoría" : "Forma"}`}
                id="name-form"
                autoFocus
                placeholder={`E.g., ${currentTab === "category" ? "Analgésicos" : "Jarabe"}`}
                {...register("forms", {
                  required: `El nombre de la ${currentTab === "category" ? "categoría" : "forma"} es obligatorio`,
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                })}
              />
            </TabsContent>

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
                    <MdOutlineAddShoppingCart className="self-center size-5" />{" "}
                    Agregar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
