import { IStore, StoreBody } from "@/services/store/store.interface";
import { TableComponents } from "@/components/table/TableComponents";
import { FilterComponent } from "@/components/table/FilterComponent";
import { HeaderPages } from "@/layout/header/Header";
import { storeColumns } from "./store.data";
import { Button } from "@/components/ui/button";
import { FaWarehouse } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineStore } from "react-icons/md";
import ConfirmDeleteStoreDialog from "./ConfirmDeleteStoreDialog";
import { StoreForm } from "./StoreForm";
import {
  useStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} from "./store.hook";

export const Store = () => {
  const [filteredStores, setFilteredStores] = useState<IStore[]>([]);
  const [storeSelected, setStoreSelected] = useState<IStore | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: storesData, isFetching } = useStoresQuery();
  const createStore = useCreateStoreMutation();
  const updateStore = useUpdateStoreMutation();
  const deleteStore = useDeleteStoreMutation();

  const allStores = useMemo(() => storesData?.stores ?? [], [storesData]);

  useEffect(() => {
    setFilteredStores(allStores);
  }, [allStores]);

  const openAddForm = () => {
    setStoreSelected(null);
    setIsAddFormOpen(true);
  };

  const handleAddOrEditStoreSubmit = async (formData: StoreBody) => {
    try {
      if (storeSelected) {
        await updateStore.mutateAsync({ id: storeSelected.id, data: formData });
      } else {
        await createStore.mutateAsync(formData);
      }
      setIsAddFormOpen(false);
    } catch (error) {
      console.error("Error al guardar el almacén:", error);
    }
  };

  const handleConfirmDeleteStore = async () => {
    if (storeSelected) {
      try {
        await deleteStore.mutateAsync(storeSelected.id);
        setIsDeleteDialogOpen(false);
        setStoreSelected(null);
      } catch (error) {
        console.error("Error al eliminar el almacén:", error);
      }
    }
  };

  const setStoreFilter = (data: IStore[]) => {
    setFilteredStores(data);
  };

  const getActionTable = (action: string, data: IStore) => {
    setStoreSelected(data);
    if (action === "edit") {
      setIsAddFormOpen(true);
    }
    if (action === "delete") {
      setIsDeleteDialogOpen(true);
    }
  };

  return (
    <>
      <div>
        <HeaderPages title="Almacenes" Icon={FaWarehouse} />
      </div>

      <div className="flex justify-end items-center px-2 pb-2 pt-1 h-fit border-b-2 border-gray-300">
        <div className="flex items-center ">
          <FilterComponent
            data={allStores}
            columns={storeColumns}
            placeholder="Buscar almacenes..."
            setDataFilter={setStoreFilter}
          />
          <Button variant={"animated"} className="h-full" onClick={openAddForm}>
            <MdOutlineStore className="size-6" />
            <span className="hidden lg:block">Registrar Almacén</span>
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <TableComponents
          column={storeColumns}
          data={filteredStores}
          actionTable={getActionTable}
          loading={isFetching}
        />
      </div>

      <StoreForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSubmit={handleAddOrEditStoreSubmit}
        store={storeSelected}
      />

      <ConfirmDeleteStoreDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDeleteStore}
        storeName={storeSelected?.name}
      />
    </>
  );
};
