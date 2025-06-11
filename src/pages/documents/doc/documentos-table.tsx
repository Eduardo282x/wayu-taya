import { useState } from "react"
import { FilterComponent } from "./filter-component"
import { TableComponents } from "./table-components"
import { GridView } from "./grid-view"
import { Button } from "../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { ChevronDown, FileIcon, Grid, Info, List } from "lucide-react"
import type { DocumentData, ColumnDefinition } from "../doc/types/document"
import { BsFiletypePdf } from "react-icons/bs";
import { BsFiletypePng } from "react-icons/bs";
import { BsFiletypeDocx } from "react-icons/bs";
// import defaultImage from './public/placeholder-user.jpg';

type ViewMode = "list" | "grid"
type FilterType = "png" | "docx" | "pdf" | null
type ContentType = "personas" | "comida" | "medicina" | null

const documentosData: DocumentData[] = [
  {
    id: 1,
    nombre: "1",
    tipo: "png",
    contenido: "personas",
    propietario: "Texto",
    fecha: "8 mar 2022",
    tamano: "17 KB",
  },
  {
    id: 2,
    nombre: "documento",
    tipo: "docx",
    contenido: "medicina",
    propietario: "Texto",
    fecha: "10 mar 2022",
    tamano: "45 KB",
  },
  {
    id: 3,
    nombre: "reporte",
    tipo: "pdf",
    contenido: "comida",
    propietario: "Texto",
    fecha: "12 mar 2022",
    tamano: "120 KB",
  },
  {
    id: 4,
    nombre: "imagen",
    tipo: "png",
    contenido: "personas",
    propietario: "Texto",
    fecha: "15 mar 2022",
    tamano: "32 KB",
  },
  {
    id: 5,
    nombre: "receta",
    tipo: "docx",
    contenido: "comida",
    propietario: "Texto",
    fecha: "18 mar 2022",
    tamano: "28 KB",
  },
  {
    id: 6,
    nombre: "manual",
    tipo: "pdf",
    contenido: "medicina",
    propietario: "Texto",
    fecha: "20 mar 2022",
    tamano: "250 KB",
  },
  {
    id: 7,
    nombre: "foto",
    tipo: "png",
    contenido: "personas",
    propietario: "Texto",
    fecha: "22 mar 2022",
    tamano: "64 KB",
  },
  {
    id: 8,
    nombre: "prescripcion",
    tipo: "docx",
    contenido: "medicina",
    propietario: "Texto",
    fecha: "25 mar 2022",
    tamano: "35 KB",
  },
]

export function DocumentosTable() {
  const [data, setData] = useState<DocumentData[]>(documentosData)
  const [filteredData, setFilteredData] = useState<DocumentData[]>(documentosData)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [tipoFilter, setTipoFilter] = useState<FilterType>(null)
  const [contenidoFilter, setContenidoFilter] = useState<ContentType>(null)

  const columns: ColumnDefinition[] = [
    {
      column: "nombre",
      label: "Nombre",
      element: (item: DocumentData) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center rounded">
            {item.tipo=='pdf' && (
              <BsFiletypePdf size={30} className="text-red-500"/>
            )}
            {item.tipo=='png' && (
              <BsFiletypePng size={30} className="text-green-500"/>
            )}
            {item.tipo=='docx' && (
              <BsFiletypeDocx size={30} className="text-blue-500"/>
            )}
            {/* <img src={defaultImage} alt="Thumbnail" width={20} height={20} className="object-cover"/> */}
          </div>
          <span>{item.nombre}</span>
        </div>
      ),
    },
    {
      column: "fecha",
      label: "Última modificación",
      element: (item: DocumentData) => <span>{item.fecha}</span>,
    },
    {
      column: "tamano",
      label: "Tamaño del archivo",
      element: (item: DocumentData) => <span>{item.tamano}</span>,
    },
    {
      column: "actions",
      label: "",
      element: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Info size={16} />
        </Button>
      ),
    },
  ]

  const applyFilters = (newTipoFilter: FilterType, newContenidoFilter: ContentType) => {
    let result = [...documentosData]

    if (newTipoFilter) {
      result = result.filter((item) => item.tipo === newTipoFilter)
    }
    if (newContenidoFilter) {
      result = result.filter((item) => item.contenido === newContenidoFilter)
    }

    setData(result)
    setFilteredData(result)
  }

  const resetFilters = () => {
    setTipoFilter(null)
    setContenidoFilter(null)
    setData(documentosData)
    setFilteredData(documentosData)
  }

  const handleTipoFilter = (tipo: FilterType) => {
    setTipoFilter(tipo)
    applyFilters(tipo, contenidoFilter)
  }

  const handleContenidoFilter = (contenido: ContentType) => {
    setContenidoFilter(contenido)
    applyFilters(tipoFilter, contenido)
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg h-auto">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="flex items-center gap-2">
          <FileIcon size={24} />
          <h1 className="text-xl font-medium">Documentos</h1>
        </div>
      </div>

      <div className="bg-blue-500 p-4 text-white">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <FilterComponent data={data} setDataFilter={setFilteredData} columns={columns} />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-full overflow-hidden bg-white">
              <Button
                variant={viewMode === "list" ? "noDefault" : "ghost"}
                size="sm"
                className={`h-9 px-2 ${viewMode === "list" ? "bg-blue-500" : "bg-white text-blue-500"}`}
                onClick={() => setViewMode("list")}
              >
                <List size={18} />
              </Button>
              <Button
                variant={viewMode === "grid" ? "noDefault" : "ghost"}
                size="sm"
                className={`h-9 px-2 ${viewMode === "grid" ? "bg-blue-500" : "bg-white text-blue-500"}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid size={18} />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-blue-600">
                {tipoFilter ? tipoFilter.toUpperCase() : "Tipo"} <ChevronDown size={16} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleTipoFilter("png")}>PNG</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTipoFilter("docx")}>DOCX</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTipoFilter("pdf")}>PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-blue-600">
                {contenidoFilter ? contenidoFilter.charAt(0).toUpperCase() + contenidoFilter.slice(1) : "Contenido"}{" "}
                <ChevronDown size={16} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleContenidoFilter("personas")}>Personas</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleContenidoFilter("comida")}>Comida</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleContenidoFilter("medicina")}>Medicina</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {(tipoFilter || contenidoFilter) && (
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-blue-600"
              onClick={resetFilters}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        {viewMode === "list" ? (
          <TableComponents column={columns} data={filteredData} />
        ) : (
          <GridView data={filteredData} />
        )}
      </div>
    </div>
  )
}
