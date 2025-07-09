/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useMemo, useEffect } from "react"
import { GridView } from "./grid-view"
import { Button } from "../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { ChevronDown, FileIcon, Grid, List, Upload, X, MoreVertical, Edit, Trash2, Download, ArrowUpDown, Eye, } from "lucide-react"
import { BsFiletypePdf } from "react-icons/bs"
import { BsFiletypePng } from "react-icons/bs"
import { BsFiletypeDocx } from "react-icons/bs"
import { deleteDocument, downloadFile, getDocument, getDocumentAdult, getDocumentLegalRepresentative, uploadFileDocument } from "@/services/document/document.service"
import { DocumentUploadFileBody, IDocument } from "@/services/document/document.interface"
import { formatDate } from "@/utils/formatters"
import { TableComponents } from "@/components/table/TableComponents"
import { Column } from "@/components/table/table.interface"
import { DialogUploadFile, DialogViewFile } from "./documentDialogs"
import { ContentType } from "./documents.data"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"

type ViewMode = "list" | "grid"
type FilterType = "png" | "doc" | "pdf" | null
type SortField = "nombre" | "fecha" | "tamano" | null
type SortOrder = "asc" | "desc"

export const Documents = () => {
  const [data, setData] = useState<IDocument[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [tipoFilter, setTipoFilter] = useState<FilterType>(null)
  const [contenidoFilter, setContenidoFilter] = useState<ContentType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  const [loading, setLoading] = useState(false)

  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedContent, setSelectedContent] = useState<ContentType>("personas")
  const [selectedDescription, setSelectedDescription] = useState("")

  const [isViewOpen, setIsViewOpen] = useState(false)
  // const [isEditOpen, setIsEditOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [documentSelected, setDocumentSelected] = useState<IDocument | null>(null)

  useEffect(() => {
    getDocumentApi();
  }, [])

  const getDocumentApi = async () => {
    try {
      setLoading(true)
      const response = await getDocument();
      setData(response)
    } catch (err) {
      console.log(err);
    }
    setLoading(false)
  }

  const processedData = useMemo(() => {
    let result = [...data]

    if (tipoFilter) {
      result = result.filter((item) => item.type === tipoFilter)
    }
    if (contenidoFilter) {
      result = result.filter((item) => item.content === contenidoFilter)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.type.toLowerCase().includes(term) ||
          item.content.toLowerCase().includes(term),
      )
    }

    if (sortField) {
      result.sort((a, b) => {
        let aValue: any, bValue: any

        switch (sortField) {
          case "nombre":
            aValue = a.name.toLowerCase()
            bValue = b.name.toLowerCase()
            break
          case "fecha":
            aValue = formatDate(a.date)
            bValue = formatDate(b.date)
            break
          // case "tamano":
          //   aValue = parseFileSize(a.tamano)
          //   bValue = parseFileSize(b.tamano)
          //   break
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

  const handleViewDocument = (document: IDocument) => {
    setDocumentSelected(document)
    setIsViewOpen(true)
  }

  const columns: Column[] = [
    {
      column: "nombre",
      label: "Nombre",
      visible: true,
      className: () => 'text-white',
      element: (item: IDocument) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center rounded">
            {item.type === "pdf" && <BsFiletypePdf size={30} className="text-red-500" />}
            {(item.type === "png" || item.type === "jpg") && <BsFiletypePng size={30} className="text-green-500" />}
            {(item.type === "doc" || item.type === "docx") && <BsFiletypeDocx size={30} className="text-blue-500" />}
          </div>
          <span>{item.name}</span>
        </div>
      ),
    },
    {
      column: "type",
      label: "Tipo",
      visible: true,
      className: () => 'text-white uppercase',
      element: (item: IDocument) => <span>{item.type ? item.type : '-'}</span>,
    },
    {
      column: "content",
      label: "Contenido",
      visible: true,
      className: () => 'text-white capitalize',
      element: (item: IDocument) => <span>{item.content ? item.content : '-'}</span>,
    },
    {
      column: "description",
      label: "Descripción",
      visible: true,
      className: () => 'text-white',
      element: (item: IDocument) => <span>{item.description ? item.description : '-'}</span>,
    },
    {
      column: "date",
      label: "Última modificación",
      visible: true,
      className: () => 'text-white',
      element: (item: IDocument) => <span>{formatDate(item.date)}</span>,
    },
    // {
    //     column: "tamano",
    //     label: "Tamaño del archivo",
    //     className: () => 'text-white',
    //     element: (item: IDocument) => <span>{item.tamano}</span>,
    // },
    {
      column: "actions",
      label: "Accion",
      visible: true,
      className: () => 'text-white',
      element: (item: IDocument) => (
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

  const openEditModal = (document: IDocument) => {
    setDocumentSelected(document)
    // setIsEditOpen(true)
  }

  // const saveEdit = () => {
  //   if (!editingId || !editName.trim()) return

  //   setData((prevData) =>
  //     prevData.map((doc) => {
  //       if (doc.id === editingId) {
  //         return {
  //           ...doc,
  //           nombre: editName.trim(),
  //           contenido: editContent,
  //         }
  //       }
  //       return doc
  //     }),
  //   )

  //   closeEditModal()
  // }

  const handleDownloadDocument = async (documentItem: IDocument) => {
    try {
      const response = await downloadFile(documentItem.id)
      const url = URL.createObjectURL(response)
      const link = window.document.createElement("a")
      link.href = url
      link.download = documentItem.name;
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al descargar el archivo:", error)
    }
  }

  const handleDeleteDocument = async (id: number) => {
    await deleteDocument(id);
    await getDocumentApi();
  }

  const getActionTable = (action: string, data: IDocument) => {
    console.log(action);
    console.log(data);
  }

  const getFileExtension = (fileName: string): string => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };


  const handleSaveFile = async () => {
    if (!uploadedFile) return;
    setLoading(true);

    const extension = getFileExtension(uploadedFile.name);

    const newDocument: DocumentUploadFileBody = {
      name: uploadedFile.name,
      date: new Date(),
      type: extension,
      description: selectedDescription,
      content: selectedContent,
    };

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('name', newDocument.name);
    formData.append('date', newDocument.date.toISOString());
    formData.append('type', newDocument.type);
    formData.append('description', newDocument.description);
    formData.append('content', newDocument.content);

    await uploadFileDocument(formData);

    setUploadedFile(null)
    setSelectedContent("personas")
    setSelectedDescription("")
    setIsUploadOpen(false);
    await getDocumentApi();
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg h-auto">
      {loading && <ScreenLoader />}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="flex items-center gap-2">
          <FileIcon size={24} />
          <h1 className="text-xl font-medium">Documentos</h1>
        </div>

        <DropdownMenuDownload />
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

        <div className="flex items-center justify-between w-full">
          <div className="flex flex-wrap gap-2 mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-blue-600">
                  {tipoFilter ? tipoFilter.toUpperCase() : "Tipo"} <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleTipoFilter("png")}>PNG</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTipoFilter("doc")}>DOCX</DropdownMenuItem>
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

          <Button onClick={() => setIsUploadOpen(true)} variant="outline" className="bg-transparent border-white mt-4 text-[1rem] hover:text-white text-white hover:bg-blue-600">
            <Upload size={16} className="mr-1" />
            Subir archivo
          </Button>
        </div>
      </div>

      <div className="p-4">
        {viewMode === "list" ? (
          <TableComponents column={columns} data={processedData} actionTable={getActionTable} />
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

      <DialogViewFile
        open={isViewOpen}
        setOpen={setIsViewOpen}
        file={documentSelected}
        handleDownloadDocument={handleDownloadDocument}
      />

      {/* <DialogEditFile
        open={isEditOpen}
        setOpen={setIsEditOpen}
        file={documentSelected}
      /> */}

      <DialogUploadFile
        open={isUploadOpen}
        setOpen={setIsUploadOpen}
        file={uploadedFile}
        dragActive={dragActive}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
        handleFileInput={handleFileInput}
        selectedDescription={selectedDescription}
        setSelectedDescription={setSelectedDescription}
        selectedContent={selectedContent}
        setSelectedContent={setSelectedContent}
        removeUploadedFile={removeUploadedFile}
        handleSaveFile={handleSaveFile}
      />

    </div>
  )
}

type DocumentDownload = 'adult' | 'legalRepresentative';

const DropdownMenuDownload = () => {

  const downloadFilePDF = async (type: DocumentDownload) => {
    let response;
    if (type == 'adult') {
      response = await getDocumentAdult();
    }

    if (type == 'legalRepresentative') {
      response = await getDocumentLegalRepresentative();
    }

    const parseName = type === 'adult' ? 'Formato Adulto' : 'Formato Representante Legal';

    const url = URL.createObjectURL(response)
    const link = window.document.createElement("a")
    link.href = url
    link.download = `Documento de uso de imagen ${parseName}.pdf`;
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="border">
          <Download size={16} />
          Descargar formato
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => downloadFilePDF('adult')}>
          Formato Adulto
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadFilePDF('legalRepresentative')}>
          Formato Representante Legal
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


