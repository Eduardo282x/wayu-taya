import { PiBuildings } from "react-icons/pi";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import AlmacenForm from "./storeforms"; // Asegúrate de que este path sea correcto
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { HeaderPages } from "@/pages/layout/Header";
import { TableComponents } from "@/components/table/TableComponents";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"; // Asegúrate de que esta es la ruta de tu pagination.tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Asegúrate de la ruta correcta para Select

import {
  GroupAlmacenes,
  IAlmacen,
  AlmacenBody,
} from "@/pages/health/store/store.interface"; // Asegúrate de que esta interfaz es correcta
import { FilterComponent } from "@/components/table/FilterComponent";
import { almacenColumns } from "@/pages/health/store/store.data"; // Asegúrate de que este path sea correcto
import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { IoIosAdd } from "react-icons/io";
// Necesario para `columns` estado si no lo tienes (ej. para DropdownColumnFilter)
// import { Column } from "@/components/table/table.interface"; // Descomentar si usas DropdownColumnFilter

// --- COMPONENTE PaginationTable (IDEALMENTE EN UN ARCHIVO SEPARADO: src/components/table/PaginationTable.tsx) ---
interface PaginationTableProps {
  page: number; // Página actual (0-indexed)
  setPage: (page: number) => void; // Para cambiar la página
  rowsPerPage: string; // Elementos por página (como string)
  setRowsPerPage: (rowsPerPage: string) => void; // Para cambiar elementos por página
  totalElements: number; // Total de elementos (sin paginar)
  totalPages: number; // Total de páginas (calculado en el padre)
}

const PaginationTable = ({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  totalElements,
  totalPages,
}: PaginationTableProps) => {
  const getPagesToShow = () => {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    if (startPage > 0) {
      pages.push(
        <PaginationItem key={0}>
          <PaginationLink onClick={() => setPage(0)} isActive={0 === page}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 1) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            className={`${
              page === i ? "border bg-[#193db9] text-white" : ""
            } hover:bg-[#193db9] hover:text-white cursor-pointer`}
            onClick={() => setPage(i)}
            isActive={i === page}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink
            onClick={() => setPage(totalPages - 1)}
            isActive={totalPages - 1 === page}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between w-full mt-4">
      <p>
        <span className="font-semibold">Total de elementos:</span>{" "}
        {totalElements}
      </p>

      <div className="flex items-center justify-center gap-2">
        <div className="flex justify-start items-center gap-2">
          <span className="font-semibold text-gray-700">
            Elementos por página:
          </span>
          <Select value={rowsPerPage.toString()} onValueChange={setRowsPerPage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[10, 20, 50, 100].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Pagination className="flex justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage(page - 1)} />
            </PaginationItem>

            {getPagesToShow()}

            <PaginationItem>
              <PaginationNext onClick={() => setPage(page + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
// --- FIN DEL COMPONENTE PaginationTable ---

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
  {
    id: 5,
    nombre: "Almacén Barquisimeto Centro",
    direccion: "Av. Vargas, Barquisimeto",
  },
  {
    id: 6,
    nombre: "Almacén San Cristóbal",
    direccion: "Carrera 9, San Cristóbal",
  },
  {
    id: 7,
    nombre: "Almacén Maturín Este",
    direccion: "Calle 15, Maturín",
  },
  {
    id: 8,
    nombre: "Almacén Ciudad Guayana",
    direccion: "Av. Las Américas, Ciudad Guayana",
  },
  {
    id: 9,
    nombre: "Almacén Punto Fijo",
    direccion: "Sector Industrial La Esmeralda, Punto Fijo",
  },
  {
    id: 10,
    nombre: "Almacén Mérida Sur",
    direccion: "Av. Urdaneta, Mérida",
  },
  {
    id: 11,
    nombre: "Almacén Barinas Central",
    direccion: "Av. 23 de Enero, Barinas",
  },
  {
    id: 12,
    nombre: "Almacén Coro Histórico",
    direccion: "Calle Zamora, Coro",
  },
  {
    id: 13,
    nombre: "Almacén Barcelona",
    direccion: "Av. Cajigal, Barcelona",
  },
  {
    id: 14,
    nombre: "Almacén Cumaná Este",
    direccion: "Prolongación Av. Perimetral, Cumaná",
  },
  {
    id: 15,
    nombre: "Almacén Guanare Norte",
    direccion: "Carrera 5, Guanare",
  },
  {
    id: 16,
    nombre: "Almacén La Guaira",
    direccion: "Av. Soublette, La Guaira",
  },
  {
    id: 17,
    nombre: "Almacén Acarigua",
    direccion: "Av. Las Lágrimas, Acarigua",
  },
  {
    id: 18,
    nombre: "Almacén Ejido",
    direccion: "Av. Bolívar, Ejido",
  },
  {
    id: 19,
    nombre: "Almacén Guatire Oeste",
    direccion: "Calle El Sol, Guatire",
  },
  {
    id: 20,
    nombre: "Almacén Cagua",
    direccion: "Calle Miranda, Cagua",
  },
];

export const Store = () => {
  const [almacenes, setAlmacenes] = useState<GroupAlmacenes>({
    allAlmacenes: [], // Mantendrá todos los datos originales/filtrados por búsqueda (para el FilterComponent)
    almacenes: [], // Contendrá la data que se mostrará en la tabla, después del filtro de búsqueda
  });
  const [almacenSelected, setAlmacenSelected] = useState<IAlmacen | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // Si usas DropdownColumnFilter, descomenta la siguiente línea y su importación:
  // const [columns, setColumns] = useState<Column[]>(almacenColumns);

  // --- ESTADOS Y LÓGICA DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(0); // Página actual, 0-indexed para lógica de array.
  const [itemsPerPage, setItemsPerPage] = useState("10"); // Elementos por página, como string para el Select.
  // Este estado contendrá SÓLO los elementos de la página actual y después de aplicar el filtro de búsqueda
  const [paginatedAndFilteredAlmacenes, setPaginatedAndFilteredAlmacenes] =
    useState<IAlmacen[]>([]);
  // --- FIN ESTADOS Y LÓGICA DE PAGINACIÓN ---

  const getAlmacenesApi = () => {
    setLoading(true);
    setTimeout(() => {
      setAlmacenes({
        allAlmacenes: EXAMPLE_ALMACENES, // Todos los datos completos, la fuente original.
        almacenes: EXAMPLE_ALMACENES, // Copia inicial que será modificada por el FilterComponent.
      });
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getAlmacenesApi();
  }, []);

  // --- useEffect para aplicar la paginación a la data filtrada ---
  useEffect(() => {
    // Calculamos los índices de inicio y fin para la paginación
    const startIndex = currentPage * Number(itemsPerPage);
    const endIndex = startIndex + Number(itemsPerPage);
    // Tomamos la porción de datos de `almacenes.almacenes` (que ya está filtrada por búsqueda)
    const dataToDisplay = almacenes.almacenes.slice(startIndex, endIndex);
    setPaginatedAndFilteredAlmacenes(dataToDisplay);

    // Asegurarse de que si el usuario está en una página que ya no existe después de filtrar,
    // se le redirija a la última página válida o a la primera.
    const newTotalPages = Math.ceil(
      almacenes.almacenes.length / Number(itemsPerPage)
    );
    if (currentPage >= newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages - 1);
    } else if (newTotalPages === 0 && currentPage !== 0) {
      // Si no hay elementos, asegurar que la página sea 0
      setCurrentPage(0);
    }
  }, [almacenes.almacenes, currentPage, itemsPerPage]); // Dependencias: data filtrada, página actual, items por página

  const setAlmacenFilter = (filteredAlmacenes: IAlmacen[]) => {
    setAlmacenes((prev) => ({ ...prev, almacenes: filteredAlmacenes })); // Actualiza los datos que la paginación usará.
    setCurrentPage(0); // **IMPORTANTE**: Reinicia la paginación a la primera página al aplicar un nuevo filtro.
  };

  const newAlmacen = () => {
    setAlmacenSelected(null); // Esto asegura que `AlmacenForm` reciba `null` y, si está bien implementado, vacíe los inputs.
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (almacenSelected) {
      setLoading(true);
      console.log(
        `Simulando eliminación de almacén con ID: ${almacenSelected.id}`
      );
      setTimeout(() => {
        // Filtramos de la lista completa (allAlmacenes)
        const updatedAllAlmacenes = almacenes.allAlmacenes.filter(
          (almacen) => almacen.id !== almacenSelected.id
        );

        // También necesitamos filtrar la lista `almacenes` para que el `useEffect` de paginación
        // recalcule correctamente la data mostrada después de la eliminación.
        const updatedFilteredAlmacenes = almacenes.almacenes.filter(
          (almacen) => almacen.id !== almacenSelected.id
        );

        setAlmacenes({
          allAlmacenes: updatedAllAlmacenes,
          almacenes: updatedFilteredAlmacenes, // Actualizamos los almacenes filtrados para recalcular la paginación
        });
        setAlmacenSelected(null);
        setIsDeleteDialogOpen(false);
        setLoading(false);
        // Opcional: Reiniciar la página a 0 o ajustar a la página anterior si la actual queda vacía.
        // El `useEffect` de paginación ya maneja esto, pero puedes forzar un setCurrentPage(0) si lo prefieres.
        setCurrentPage(0);
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
      const isEditing = almacenSelected !== null;
      let updatedAllAlmacenes;
      let savedAlmacen: IAlmacen;

      if (isEditing) {
        // En modo edición
        savedAlmacen = {
          ...almacen,
          id: almacenSelected!.id, // Usamos el ID del seleccionado para edición
        };
        updatedAllAlmacenes = almacenes.allAlmacenes.map((a) =>
          a.id === savedAlmacen.id ? savedAlmacen : a
        );
      } else {
        // En modo añadir nuevo
        const newId =
          almacenes.allAlmacenes.length > 0
            ? Math.max(...almacenes.allAlmacenes.map((a) => a.id)) + 1
            : 1;
        savedAlmacen = {
          ...almacen,
          id: newId,
        };
        updatedAllAlmacenes = [...almacenes.allAlmacenes, savedAlmacen];
      }

      setAlmacenes({
        allAlmacenes: updatedAllAlmacenes,
        // Al guardar/editar, los `almacenes` (filtrados para la tabla) deben reflejar `allAlmacenes`
        // para que la paginación y filtros se apliquen sobre la data más reciente.
        almacenes: updatedAllAlmacenes,
      });
      setOpen(false);
      setLoading(false);
      setCurrentPage(0); // Reiniciar a la primera página después de añadir/editar
    }, 500);
  };

  // --- Lógica de paginación (calculados cada vez que las dependencias cambian) ---
  const totalElementsFiltered = almacenes.almacenes.length; // Total de elementos DESPUÉS DEL FILTRO DE BÚSQUEDA
  const totalPages = Math.ceil(totalElementsFiltered / Number(itemsPerPage));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value);
    setCurrentPage(0); // Reiniciar a la primera página cuando cambian los elementos por página
  };
  // --- FIN Lógica de paginación ---

  return (
    <div className="">
      {loading && <ScreenLoader />}
      <HeaderPages title="Almacenes" Icon={PiBuildings} />

      {/* CONTENEDOR PARA FILTRO Y BOTÓN (MODIFICADO PARA ALINEAR A LA DERECHA) */}
      <div className="flex justify-end items-center px-2 pb-2 pt-1 h-fit border-b-2 border-gray-300">
        {/*
          Si usas DropdownColumnFilter, descomenta y asegúrate de que esté correctamente importado
          y que la prop `columns` se pase también a TableComponents (posiblemente filtrada).
          Si lo quieres a la izquierda y el filtro/botón a la derecha, necesitarías dos divs separados
          dentro de este contenedor padre con `justify-between`.
        */}
        {/* <DropdownColumnFilter columns={columns} setColumns={setColumns} /> */}

        {/* Contenedor que agrupa el FilterComponent y el Button "Añadir Almacén" a la derecha */}
        <div className="flex items-center gap-2">
          {" "}
          {/* `gap-2` para espacio entre el input y el botón */}
          <FilterComponent
            data={almacenes.allAlmacenes} // El filtro opera sobre TODOS los datos sin paginar.
            columns={almacenColumns}
            setDataFilter={setAlmacenFilter} // Esta función actualizará `almacenes.almacenes` para la paginación.
            placeholder="Buscar almacén..."
          />
          <Button variant={"animated"} className="h-full" onClick={newAlmacen}>
            <IoIosAdd className="size-6 " />
            Añadir Almacén
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <TableComponents
          data={paginatedAndFilteredAlmacenes} // Pasa SOLAMENTE la data ya paginada y filtrada.
          column={almacenColumns} // Usa `almacenColumns` o `columns` si lo manejas con DropdownColumnFilter.
          actionTable={getActionTable}
        />

        {/* --- CONTROLES DE PAGINACIÓN --- */}
        {/* Solo muestra la paginación si hay elementos filtrados y más de una página */}
        {totalElementsFiltered > 0 && totalPages > 1 && (
          <PaginationTable
            page={currentPage}
            setPage={handlePageChange}
            rowsPerPage={itemsPerPage}
            setRowsPerPage={handleItemsPerPageChange}
            totalElements={totalElementsFiltered}
            totalPages={totalPages}
          />
        )}
        {/* --- FIN CONTROLES DE PAGINACIÓN --- */}

        <AlmacenForm
          open={open}
          onOpenChange={setOpen}
          almacen={almacenSelected} // `almacenSelected` será `null` cuando se abre para añadir.
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
