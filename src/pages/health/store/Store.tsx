import { PiBuildings } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { TiUserAddOutline } from "react-icons/ti";
import { useEffect, useState } from "react";
import AlmacenForm from "./storeForms";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { HeaderPages } from "@/pages/layout/Header";
import { TableComponents } from "@/components/table/TableComponents";
import {
  GroupAlmacenes,
  IAlmacen,
  AlmacenBody,
} from "@/pages/health/store/store.interface";
import { FilterComponent } from "@/components/table/FilterComponent";
import { almacenColumns } from "@/pages/health/store/store.data";
import { ScreenLoader } from "@/components/loaders/ScreenLoader";

const EXAMPLE_ALMACENES: IAlmacen[] = [
  {
    id: 1,
    nombre: "Almacén Principal Caracas",
    direccion: "Av. Libertador, Edif. Central, Caracas",
  },
  {
    id: 2,
    nombre: "Almacén Regional Valencia",
    direccion: "Calle 100, Sector Industrial, Valencia",
  },
  {
    id: 3,
    nombre: "Almacén Maracaibo Oeste",
    direccion: "Zona Industrial Nº 1, Maracaibo",
  },
  {
    id: 4,
    nombre: "Almacén Puerto La Cruz",
    direccion: "Blvd. 5 de Julio, Puerto La Cruz",
  },
];

export const Store = () => {
  const [almacenes, setAlmacenes] = useState<GroupAlmacenes>({
    allAlmacenes: [],
    almacenes: [],
  });
  const [almacenSelected, setAlmacenSelected] = useState<IAlmacen | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getAlmacenesApi = () => {
    setLoading(true);
    setTimeout(() => {
      setAlmacenes({
        allAlmacenes: EXAMPLE_ALMACENES,
        almacenes: EXAMPLE_ALMACENES,
      });
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getAlmacenesApi();
  }, []);

  const setAlmacenFilter = (filteredAlmacenes: IAlmacen[]) => {
    setAlmacenes((prev) => ({ ...prev, almacenes: filteredAlmacenes }));
  };

  const newAlmacen = () => {
    setAlmacenSelected(null);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (almacenSelected) {
      setLoading(true);
      console.log(
        `Simulando eliminación de almacén con ID: ${almacenSelected.id}`
      );
      setTimeout(() => {
        const updatedAlmacenes = almacenes.allAlmacenes.filter(
          (almacen) => almacen.id !== almacenSelected.id
        );
        setAlmacenes({
          allAlmacenes: updatedAlmacenes,
          almacenes: updatedAlmacenes,
        });
        setAlmacenSelected(null);
        setIsDeleteDialogOpen(false);
        setLoading(false);
      }, 500);
    }
  };

  const getActionTable = (action: string, data: IAlmacen) => {
    setAlmacenSelected(data);
    if (action === "edit") {
      setOpen(true);
    }
    if (action === "delete") {
      setIsDeleteDialogOpen(true);
    }
  };

  const getActionForm = async (almacen: AlmacenBody) => {
    setLoading(true);
    console.log(`Simulando guardado de almacén:`, almacen);
    setTimeout(() => {
      const newId =
        almacenes.allAlmacenes.length > 0
          ? Math.max(...almacenes.allAlmacenes.map((a) => a.id)) + 1
          : 1;
      const savedAlmacen: IAlmacen = {
        ...almacen,
        id: almacenSelected ? almacenSelected.id : newId,
      };

      let updatedAllAlmacenes;
      if (almacenSelected) {
        updatedAllAlmacenes = almacenes.allAlmacenes.map((a) =>
          a.id === savedAlmacen.id ? savedAlmacen : a
        );
      } else {
        updatedAllAlmacenes = [...almacenes.allAlmacenes, savedAlmacen];
      }

      setAlmacenes({
        allAlmacenes: updatedAllAlmacenes,
        almacenes: updatedAllAlmacenes,
      });
      setOpen(false);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="">
      {loading && <ScreenLoader />}
      <HeaderPages title="Almacenes" Icon={PiBuildings} />

      <div className="flex justify-end items-center px-2 pb-2 pt-1 h-fit border-b-2 border-gray-300">
        <div className="flex items-center ">
          <FilterComponent
            data={almacenes.allAlmacenes}
            columns={almacenColumns}
            setDataFilter={setAlmacenFilter}
            placeholder="Buscar almacén..."
          />
          <Button variant={"animated"} className="h-full" onClick={newAlmacen}>
            <TiUserAddOutline className="size-6 " />
            Añadir Almacén
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <TableComponents
          data={almacenes.almacenes}
          column={almacenColumns}
          actionTable={getActionTable}
        />

        <AlmacenForm
          open={open}
          onOpenChange={setOpen}
          almacen={almacenSelected}
          onSubmit={getActionForm}
        />

        <ConfirmDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          itemName={almacenSelected?.nombre}
        />
      </div>
    </div>
  );
};
