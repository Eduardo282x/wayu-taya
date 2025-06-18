import { Button } from "../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Download, Eye } from "lucide-react"
import type { DocumentData } from "./types/document"
import { BsFiletypePdf } from "react-icons/bs"
import { BsFiletypePng } from "react-icons/bs"
import { BsFiletypeDocx } from "react-icons/bs"

interface GridViewProps {
  data: DocumentData[]
  onViewDocument: (document: DocumentData) => void
  onEditDocument: (document: DocumentData) => void
  onDownloadDocument: (document: DocumentData) => void
  onDeleteDocument: (id: number) => void
}

export function GridView({
  data,
  onViewDocument,
  onEditDocument,
  onDownloadDocument,
  onDeleteDocument,
}: GridViewProps) {
  const getFileIcon = (tipo: string) => {
    switch (tipo) {
      case "pdf":
        return <BsFiletypePdf size={48} className="text-red-500" />
      case "png":
        return <BsFiletypePng size={48} className="text-green-500" />
      case "docx":
        return <BsFiletypeDocx size={48} className="text-blue-500" />
      default:
        return <BsFiletypePdf size={48} className="text-gray-500" />
    }
  }

  const getContentBadgeColor = (contenido: string) => {
    switch (contenido) {
      case "personas":
        return "bg-blue-100 text-blue-800"
      case "comida":
        return "bg-green-100 text-green-800"
      case "medicina":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">No se encontraron documentos</p>
      </div>
    )
  }

  return (
    <div className="h-[28rem] overflow-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {data.map((document) => (
        <div
          key={document.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 relative group"
        >
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white shadow-sm border">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDocument(document)}>
                  <Eye size={16} className="mr-2" />
                  Ver
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditDocument(document)}>
                  <Edit size={16} className="mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownloadDocument(document)}>
                  <Download size={16} className="mr-2" />
                  Descargar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteDocument(document.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 size={16} className="mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex-shrink-0">{getFileIcon(document.tipo)}</div>

            <div className="w-full">
              <h3 className="font-medium text-gray-900 truncate" title={document.nombre}>
                {document.nombre}
              </h3>
              <p className="text-sm text-gray-500 uppercase">{document.tipo}</p>
            </div>

            <div className="w-full">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContentBadgeColor(document.contenido)}`}
              >
                {document.contenido.charAt(0).toUpperCase() + document.contenido.slice(1)}
              </span>
            </div>

            {document.descripcion && (
              <div className="w-full">
                <p className="text-xs text-gray-600 line-clamp-2" title={document.descripcion}>
                  {document.descripcion}
                </p>
              </div>
            )}

            <div className="w-full pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{document.tamano}</span>
                <span>{document.fecha}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
