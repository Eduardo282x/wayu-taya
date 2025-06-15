import { GroupStore, IStore } from "@/services/store/store.interface";
import { DropdownColumnFilter } from "@/components/table/DropdownColumnFilter";
import { TableComponents } from "@/components/table/TableComponents";
import { FilterComponent } from "@/components/table/FilterComponent";
import {
  getStore,
  postStore,
  putStore,
  deleteStore,
} from "@/services/store/store.service";
import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { Column } from "@/components/table/table.interface";
import { StoreForm, StoreData } from "./storeforms";
import { HeaderPages } from "@/pages/layout/Header";
import { storeColumns } from "./store.data";
import { Button } from "@/components/ui/button";
import { FaWarehouse } from "react-icons/fa";
import { useEffect, useState } from "react";
import { MdOutlineStore } from "react-icons/md";
import ConfirmDeleteStoreDialog from "./ConfirmDeleteStoreDialog";

export const Store = () => {
  const [stores, setStores] = useState<GroupStore>({
    allStores: [],
    stores: [],
  });
  const [storeSelected, setStoreSelected] = useState<IStore | null>(null);
  const [columns, setColumns] = useState<Column[]>(storeColumns);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    getStoreApi();
  }, []);

  const getStoreApi = async () => {
    setLoading(true);
    try {
      const response: IStore[] = await getStore();
      setStores({ allStores: response, stores: response });
    } catch (err) {
      console.error("Error al obtener almacenes:", err);
    }
    setLoading(false);
  };

  const openAddForm = () => {
    setStoreSelected(null);
    setIsAddFormOpen(true);
  };

  const handleAddOrEditStoreSubmit = async (formData: StoreData) => {
    setLoading(true);
    try {
      if (storeSelected) {
        await putStore(storeSelected.id, formData);
      } else {
        await postStore(formData);
      }
      setIsAddFormOpen(false);
      await getStoreApi();
    } catch (error) {
      console.error("Error al guardar el almacén:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeleteStore = async () => {
    if (storeSelected) {
      setLoading(true);
      try {
        await deleteStore(storeSelected.id);
        await getStoreApi();
        setIsDeleteDialogOpen(false);
        setStoreSelected(null);
      } catch (error) {
        console.error("Error al eliminar el almacén:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const setStoreFilter = (filteredStores: IStore[]) => {
    setStores((prev) => ({ ...prev, stores: filteredStores }));
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
      {loading && <ScreenLoader />}
      <div>
        <HeaderPages title="Almacenes" Icon={FaWarehouse} />
      </div>

      <div className="flex justify-between items-center px-2 pb-2 pt-1 h-fit border-b-2 border-gray-300">
        <DropdownColumnFilter columns={columns} setColumns={setColumns} />

        <div className="flex items-center ">
          <FilterComponent
            data={stores.allStores}
            columns={storeColumns}
            placeholder="Buscar almacenes..."
            setDataFilter={setStoreFilter}
          />
          <Button variant={"animated"} className="h-full" onClick={openAddForm}>
            <MdOutlineStore className="size-6" />
            Registrar Almacén
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <TableComponents
          column={columns.filter((item) => item.visible === true)}
          data={stores.stores}
          actionTable={getActionTable}
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
