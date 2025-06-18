/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"

import { useState, useMemo } from "react"
import { TableComponents } from "./table-components"
import { GridView } from "./grid-view"
import { Button } from "../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import {
  ChevronDown,
  FileIcon,
  Grid,
  List,
  Upload,
  X,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  ArrowUpDown,
  Eye,
} from "lucide-react"
import type { DocumentData, ColumnDefinition } from "./types/document"
import { BsFiletypePdf } from "react-icons/bs"
import { BsFiletypePng } from "react-icons/bs"
import { BsFiletypeDocx } from "react-icons/bs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"

type ViewMode = "list" | "grid"
type FilterType = "png" | "docx" | "pdf" | null
type ContentType = "personas" | "comida" | "medicina"
type SortField = "nombre" | "fecha" | "tamano" | null
type SortOrder = "asc" | "desc"

const documentosData: DocumentData[] = [
  {
    id: 1,
    nombre: "1",
    tipo: "png",
    contenido: "personas",
    propietario: "Texto",
    fecha: "8 mar 2022",
    tamano: "17 KB",
    descripcion: "Fotografía de identificación personal para documentos oficiales",
  },
  {
    id: 2,
    nombre: "documento",
    tipo: "docx",
    contenido: "medicina",
    propietario: "Texto",
    fecha: "10 mar 2022",
    tamano: "45 KB",
    descripcion: "Informe médico detallado con diagnóstico y tratamiento recomendado",
  },
  {
    id: 3,
    nombre: "reporte",
    tipo: "pdf",
    contenido: "comida",
    propietario: "Texto",
    fecha: "12 mar 2022",
    tamano: "120 KB",
    descripcion: "Manual de recetas tradicionales con ingredientes y preparación paso a paso",
  },
  {
    id: 4,
    nombre: "imagen",
    tipo: "png",
    contenido: "personas",
    propietario: "Texto",
    fecha: "15 mar 2022",
    tamano: "32 KB",
    descripcion: "Foto grupal del equipo de trabajo en evento corporativo",
  },
  {
    id: 5,
    nombre: "receta",
    tipo: "docx",
    contenido: "comida",
    propietario: "Texto",
    fecha: "18 mar 2022",
    tamano: "28 KB",
    descripcion: "Receta familiar secreta de paella valenciana con trucos de cocina",
  },
  {
    id: 6,
    nombre: "manual",
    tipo: "pdf",
    contenido: "medicina",
    propietario: "Texto",
    fecha: "20 mar 2022",
    tamano: "250 KB",
    descripcion: "Guía completa de primeros auxilios y procedimientos de emergencia",
  },
  {
    id: 7,
    nombre: "foto",
    tipo: "png",
    contenido: "personas",
    propietario: "Texto",
    fecha: "22 mar 2022",
    tamano: "64 KB",
    descripcion: "Retrato profesional para perfil de LinkedIn y redes sociales",
  },
  {
    id: 8,
    nombre: "prescripcion",
    tipo: "docx",
    contenido: "medicina",
    propietario: "Texto",
    fecha: "25 mar 2022",
    tamano: "35 KB",
    descripcion: "Prescripción médica con medicamentos y dosis específicas para tratamiento",
  }
]

export function DocumentosTable() {
  const [data, setData] = useState<DocumentData[]>(documentosData)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [tipoFilter, setTipoFilter] = useState<FilterType>(null)
  const [contenidoFilter, setContenidoFilter] = useState<ContentType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedContent, setSelectedContent] = useState<ContentType>("personas")
  const [selectedDescription, setSelectedDescription] = useState("")

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [editContent, setEditContent] = useState<ContentType>("personas")

  const [isViewOpen, setIsViewOpen] = useState(false)
  const [viewingDocument, setViewingDocument] = useState<DocumentData | null>(null)

  const parseFileSize = (sizeStr: string): number => {
    const size = Number.parseFloat(sizeStr)
    if (sizeStr.includes("KB")) return size * 1024
    if (sizeStr.includes("MB")) return size * 1024 * 1024
    if (sizeStr.includes("GB")) return size * 1024 * 1024 * 1024
    return size
  }

  const parseDate = (dateStr: string): number => {
    const [day, month, year] = dateStr.split(" ")
    const monthMap: { [key: string]: number } = {
      ene: 0,
      feb: 1,
      mar: 2,
      abr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      ago: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dic: 11,
    }
    return new Date(Number.parseInt(year), monthMap[month] || 0, Number.parseInt(day)).getTime()
  }

  const processedData = useMemo(() => {
    let result = [...data]

    if (tipoFilter) {
      result = result.filter((item) => item.tipo === tipoFilter)
    }
    if (contenidoFilter) {
      result = result.filter((item) => item.contenido === contenidoFilter)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (item) =>
          item.nombre.toLowerCase().includes(term) ||
          item.tipo.toLowerCase().includes(term) ||
          item.contenido.toLowerCase().includes(term),
      )
    }

    if (sortField) {
      result.sort((a, b) => {
        let aValue: any, bValue: any

        switch (sortField) {
          case "nombre":
            aValue = a.nombre.toLowerCase()
            bValue = b.nombre.toLowerCase()
            break
          case "fecha":
            aValue = parseDate(a.fecha)
            bValue = parseDate(b.fecha)
            break
          case "tamano":
            aValue = parseFileSize(a.tamano)
            bValue = parseFileSize(b.tamano)
            break
          default:
            return 0
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, tipoFilter, contenidoFilter, searchTerm, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleViewDocument = (documentItem: DocumentData) => {
    setViewingDocument(documentItem)
    setIsViewOpen(true)
  }

  const closeViewModal = () => {
    setIsViewOpen(false)
    setViewingDocument(null)
  }

  const renderDocumentContent = (document: DocumentData) => {
    const descripcion = document.descripcion || "Sin descripción disponible"

    switch (document.tipo) {
      case "pdf":
        return (
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center max-w-2xl">
              <BsFiletypePdf size={64} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Documento PDF</h3>
              <p className="text-gray-600 mb-4">{document.nombre}.pdf</p>
              <div className="bg-white p-6 rounded border text-left">
                <h4 className="font-bold mb-3">Descripción del documento:</h4>
                <p className="text-gray-700 leading-relaxed">{descripcion}</p>
                <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                  <p>
                    <strong>Tipo de contenido:</strong> {document.contenido}
                  </p>
                  <p>
                    <strong>Tamaño:</strong> {document.tamano}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {document.fecha}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case "png":
        return (
          <div className="w-full max-h-96 bg-gray-100 rounded-lg flex items-center justify-center p-4">
            <div className="text-center max-w-2xl">
              <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-dashed border-gray-300">
                <BsFiletypePng size={64} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Imagen PNG</h3>
                <p className="text-gray-600 mb-4">{document.nombre}.png</p>
                <div className="bg-gradient-to-br from-blue-100 to-green-100 w-48 h-32 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🖼️</div>
                    <p className="text-sm text-gray-600">Vista previa de imagen</p>
                  </div>
                </div>
                <div className="text-left bg-gray-50 p-4 rounded">
                  <h4 className="font-bold mb-2">Descripción:</h4>
                  <p className="text-gray-700 leading-relaxed">{descripcion}</p>
                  <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                    <p>
                      <strong>Tamaño:</strong> {document.tamano}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "docx":
        return (
          <div className="w-full h-96 bg-gray-100 rounded-lg p-4">
            <div className="bg-white rounded-lg p-6 h-full overflow-y-auto">
              <div className="flex items-center mb-4">
                <BsFiletypeDocx size={32} className="text-blue-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold">{document.nombre}.docx</h3>
                  <p className="text-sm text-gray-500">Documento de Word</p>
                </div>
              </div>

              <div className="prose max-w-none">
                <h4 className="text-base font-semibold mb-3">Descripción del documento:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{descripcion}</p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h5 className="font-medium mb-2">Información del archivo:</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Tipo de contenido:</strong> {document.contenido}
                    </p>
                    <p>
                      <strong>Fecha de modificación:</strong> {document.fecha}
                    </p>
                    <p>
                      <strong>Tamaño:</strong> {document.tamano}
                    </p>
                    <p>
                      <strong>Propietario:</strong> {document.propietario}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FileIcon size={64} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Tipo de archivo no soportado</p>
            </div>
          </div>
        )
    }
  }

  const columns: ColumnDefinition[] = [
    {
      column: "nombre",
      label: "Nombre",
      element: (item: DocumentData) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center rounded">
            {item.tipo === "pdf" && <BsFiletypePdf size={30} className="text-red-500" />}
            {item.tipo === "png" && <BsFiletypePng size={30} className="text-green-500" />}
            {item.tipo === "docx" && <BsFiletypeDocx size={30} className="text-blue-500" />}
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
      element: (item: DocumentData) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewDocument(item)}>
              <Eye size={16} className="mr-2" />
              Ver
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditModal(item)}>
              <Edit size={16} className="mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownloadDocument(item)}>
              <Download size={16} className="mr-2" />
              Descargar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteDocument(item.id)} className="text-red-600 focus:text-red-600">
              <Trash2 size={16} className="mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const resetFilters = () => {
    setTipoFilter(null)
    setContenidoFilter(null)
    setSearchTerm("")
    setSortField(null)
    setSortOrder("asc")
  }

  const handleTipoFilter = (tipo: FilterType) => {
    setTipoFilter(tipo)
  }

  const handleContenidoFilter = (contenido: ContentType) => {
    setContenidoFilter(contenido)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setUploadedFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFile(file)
    }
  }

  const getFileType = (fileName: string): "png" | "docx" | "pdf" => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    if (extension === "png" || extension === "jpg" || extension === "jpeg") return "png"
    if (extension === "docx" || extension === "doc") return "docx"
    if (extension === "pdf") return "pdf"
    return "pdf"
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const openEditModal = (document: DocumentData) => {
    setEditingId(document.id)
    setEditName(document.nombre)
    setEditContent(document.contenido as ContentType)
    setIsEditOpen(true)
  }

  const closeEditModal = () => {
    setIsEditOpen(false)
    setEditingId(null)
    setEditName("")
    setEditContent("personas")
  }

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return

    setData((prevData) =>
      prevData.map((doc) => {
        if (doc.id === editingId) {
          return {
            ...doc,
            nombre: editName.trim(),
            contenido: editContent,
          }
        }
        return doc
      }),
    )

    closeEditModal()
  }

  const handleDownloadDocument = (documentItem: DocumentData) => {
    try {
      const fileContent = `Documento: ${documentItem.nombre}\nTipo: ${documentItem.tipo}\nContenido: ${documentItem.contenido}\nFecha: ${documentItem.fecha}\nTamaño: ${documentItem.tamano}\nDescripción: ${documentItem.descripcion || "Sin descripción"}`
      const blob = new Blob([fileContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = window.document.createElement("a")
      link.href = url
      link.download = `${documentItem.nombre}.${documentItem.tipo}`
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al descargar el archivo:", error)
    }
  }

  const handleDeleteDocument = (id: number) => {
    setData((prevData) => prevData.filter((doc) => doc.id !== id))
  }

  const handleSaveFile = () => {
    if (!uploadedFile) return

    const newDocument: DocumentData = {
      id: Math.max(...data.map((d) => d.id), 0) + 1,
      nombre: uploadedFile.name.split(".")[0],
      tipo: getFileType(uploadedFile.name),
      contenido: selectedContent,
      propietario: "Texto",
      fecha: new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      tamano: formatFileSize(uploadedFile.size),
      descripcion: selectedDescription.trim() || "Sin descripción disponible",
    }

    setData((prevData) => [...prevData, newDocument])
    setUploadedFile(null)
    setSelectedContent("personas")
    setSelectedDescription("")
    setIsUploadOpen(false)
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
  }

  const currentEditingDocument = editingId ? data.find((doc) => doc.id === editingId) : null

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
            <div className="flex items-center justify-between w-60 border rounded-lg px-3 h-9 bg-white">
              <input
                className="outline-none text-gray-600 text-sm flex-1 mx-2"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && <X size={12} className="text-gray-400 cursor-pointer" onClick={() => setSearchTerm("")} />}
            </div>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-blue-600">
                Nombre <ArrowUpDown size={16} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleSort("nombre")}>
                A - Z {sortField === "nombre" && sortOrder === "asc" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortField("nombre")
                  setSortOrder("desc")
                }}
              >
                Z - A {sortField === "nombre" && sortOrder === "desc" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-blue-600">
                Fecha <ArrowUpDown size={16} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setSortField("fecha")
                  setSortOrder("asc")
                }}
              >
                Más antigua primero {sortField === "fecha" && sortOrder === "asc" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortField("fecha")
                  setSortOrder("desc")
                }}
              >
                Más nueva primero {sortField === "fecha" && sortOrder === "desc" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-blue-600">
                Tamaño <ArrowUpDown size={16} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setSortField("tamano")
                  setSortOrder("asc")
                }}
              >
                Más liviano primero {sortField === "tamano" && sortOrder === "asc" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortField("tamano")
                  setSortOrder("desc")
                }}
              >
                Más pesado primero {sortField === "tamano" && sortOrder === "desc" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isUploadOpen && (
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-blue-600">
                  <Upload size={16} className="mr-1" />
                  Subir archivo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Subir nuevo documento</DialogTitle>
                  <DialogDescription>Arrastra y suelta un archivo o haz clic para seleccionar</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Arrastra archivos aquí</p>
                    <p className="text-sm text-gray-500 mb-4">o haz clic para seleccionar archivos</p>
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.png,.jpg,.jpeg,.docx,.doc"
                      onChange={handleFileInput}
                    />
                    <Label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      Seleccionar archivo
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Tipo de contenido</Label>
                    <Select value={selectedContent} onValueChange={(value) => setSelectedContent(value as ContentType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de contenido" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personas">Personas</SelectItem>
                        <SelectItem value="comida">Comida</SelectItem>
                        <SelectItem value="medicina">Medicina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Descripción del documento</Label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      rows={3}
                      value={selectedDescription}
                      onChange={(e) => setSelectedDescription(e.target.value)}
                      placeholder="Escribe una breve descripción del documento..."
                    />
                  </div>

                  {uploadedFile && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center">
                            {getFileType(uploadedFile.name) === "pdf" && (
                              <BsFiletypePdf size={24} className="text-red-500" />
                            )}
                            {getFileType(uploadedFile.name) === "png" && (
                              <BsFiletypePng size={24} className="text-green-500" />
                            )}
                            {getFileType(uploadedFile.name) === "docx" && (
                              <BsFiletypeDocx size={24} className="text-blue-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{uploadedFile.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={removeUploadedFile} className="h-8 w-8 p-0">
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveFile} disabled={!uploadedFile} className="bg-blue-600 hover:bg-blue-700">
                      Guardar archivo
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {isEditOpen && (
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen} modal>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Editar documento</DialogTitle>
                  <DialogDescription>Modifica el nombre y tipo de contenido del documento</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {currentEditingDocument && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center">
                          {currentEditingDocument.tipo === "pdf" && <BsFiletypePdf size={24} className="text-red-500" />}
                          {currentEditingDocument.tipo === "png" && (
                            <BsFiletypePng size={24} className="text-green-500" />
                          )}
                          {currentEditingDocument.tipo === "docx" && (
                            <BsFiletypeDocx size={24} className="text-blue-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {currentEditingDocument.nombre}.{currentEditingDocument.tipo}
                          </p>
                          <p className="text-xs text-gray-500">{currentEditingDocument.tamano}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Nombre del archivo</Label>
                    <Input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Ingresa el nombre del archivo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Tipo de contenido</Label>
                    <Select value={editContent} onValueChange={(value) => setEditContent(value as ContentType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personas">Personas</SelectItem>
                        <SelectItem value="comida">Comida</SelectItem>
                        <SelectItem value="medicina">Medicina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={closeEditModal}>
                      Cancelar
                    </Button>
                    <Button onClick={saveEdit} disabled={!editName.trim()} className="bg-blue-600 hover:bg-blue-700">
                      Guardar cambios
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {isViewOpen && (
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen} modal>
              <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Eye size={20} />
                    Ver documento: {viewingDocument?.nombre}
                  </DialogTitle>
                  <DialogDescription>
                    Visualización del contenido del archivo {viewingDocument?.tipo?.toUpperCase()}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4">{viewingDocument && renderDocumentContent(viewingDocument)}</div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={closeViewModal}>
                    Cerrar
                  </Button>
                  <Button
                    onClick={() => viewingDocument && handleDownloadDocument(viewingDocument)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download size={16} className="mr-2" />
                    Descargar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {(tipoFilter || contenidoFilter || searchTerm || sortField) && (
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
          <TableComponents column={columns} data={processedData} />
        ) : (
          <GridView
            data={processedData}
            onViewDocument={handleViewDocument}
            onEditDocument={openEditModal}
            onDownloadDocument={handleDownloadDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        )}
      </div>
    </div>
  )
}
