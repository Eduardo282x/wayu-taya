import { IStore, StoreBody } from "@/services/store/store.interface";
import { TableComponents } from "@/components/table/TableComponents";
import { FilterComponent } from "@/components/table/FilterComponent";
import { HeaderPages } from "@/layout/header/Header";
import { storeColumns } from "./store.data.tsx";
import { Button } from "@/components/ui/button";
import { FaWarehouse } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineStore } from "react-icons/md";
import ConfirmDeleteStoreDialog from "./ConfirmDeleteStoreDialog";
import { StoreForm } from "./StoreForm";
import { apiMessage } from "@/services/api-error";
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
  /** Mensaje real de la API cuando la escritura o el borrado fallan. */
  const [actionError, setActionError] = useState("");

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
    let response;

    if (storeSelected) {
      response = await updateStore.mutateAsync({ id: storeSelected.id, data: formData });
    } else {
      response = await createStore.mutateAsync(formData);
    }

    // El servicio devuelve el sobre en vez de lanzar, asi que un fallo NUNCA
    // llega al catch: sin esta comprobacion el formulario se cerraba y el
    // usuario creia que habia guardado cuando la API lo habia rechazado.
    if (!response.success) {
      setActionError(apiMessage(response, "No se pudo guardar el almacén"));
      return;
    }

    setActionError("");
    setIsAddFormOpen(false);
  };

  const handleConfirmDeleteStore = async () => {
    if (storeSelected) {
      const response = await deleteStore.mutateAsync(storeSelected.id);

      if (!response.success) {
        setActionError(apiMessage(response, "No se pudo eliminar el almacén"));
        return;
      }

      setActionError("");
      setIsDeleteDialogOpen(false);
      setStoreSelected(null);
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

      <div className="mx-2 mt-4">
        {actionError && (
          <p className="mb-2 text-sm text-red-600 manrope" role="alert">
            {actionError}
          </p>
        )}

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
