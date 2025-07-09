import { IDocument } from "@/services/document/document.interface"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
// import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { BsFiletypeDocx, BsFiletypePdf, BsFiletypePng } from "react-icons/bs"
import { formatDate } from "@/utils/formatters"
import { Download, Eye, FileIcon, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button";
import { ContentType } from "./documents.data"

interface DialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    file: IDocument | null | File;
}

const getFileType = (fileName: string): "png" | "docx" | "pdf" => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    if (extension === "png" || extension === "jpg" || extension === "jpeg") return "png"
    if (extension === "docx" || extension === "doc") return "docx"
    if (extension === "pdf") return "pdf"
    return "pdf"
}
// const formatFileSize = (bytes: number): string => {
//     if (bytes === 0) return "0 Bytes"
//     const k = 1024
//     const sizes = ["Bytes", "KB", "MB", "GB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
// }


interface DialogUploadFileProps extends DialogProps {
    dragActive: boolean
    handleDrag: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;

    selectedDescription: string;
    setSelectedDescription: (description: string) => void;
    selectedContent: ContentType;
    setSelectedContent: (description: ContentType) => void;
    removeUploadedFile: () => void;
    handleSaveFile: () => void;
}

export const DialogUploadFile = ({
    open,
    setOpen,
    file,
    handleDrag,
    handleDrop,
    handleFileInput,
    selectedDescription,
    setSelectedDescription,
    selectedContent,
    setSelectedContent,
    dragActive,
    removeUploadedFile,
    handleSaveFile,
}: DialogUploadFileProps) => {

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Subir nuevo documento</DialogTitle>
                    <DialogDescription>Arrastra y suelta un archivo o haz clic para seleccionar</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"
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
                                <SelectItem value="documentos">Documento</SelectItem>
                                <SelectItem value="personas">Personas</SelectItem>
                                <SelectItem value="comida">Comida</SelectItem>
                                <SelectItem value="medicina">Medicina</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Descripción del documento</Label>
                        <textarea
                            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            rows={3}
                            value={selectedDescription}
                            onChange={(e) => setSelectedDescription(e.target.value)}
                            placeholder="Escribe una breve descripción del documento..."
                        />
                    </div>

                    {file && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        {getFileType(file.name) === "pdf" && (
                                            <BsFiletypePdf size={24} className="text-red-500" />
                                        )}
                                        {getFileType(file.name) === "png" && (
                                            <BsFiletypePng size={24} className="text-green-500" />
                                        )}
                                        {getFileType(file.name) === "docx" && (
                                            <BsFiletypeDocx size={24} className="text-blue-500" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{file.name}</p>
                                        {/* <p className="text-xs text-gray-500">{formatFileSize(file)}</p> */}
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={removeUploadedFile} className="h-8 w-8 p-0">
                                    <X size={16} />
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveFile} disabled={!file} className="bg-blue-600 hover:bg-blue-700">
                            Guardar archivo
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// export const DialogEditFile = ({ open, setOpen, file }: DialogProps) => {

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                     <DialogTitle>Editar documento</DialogTitle>
//                     <DialogDescription>Modifica el nombre y tipo de contenido del documento</DialogDescription>
//                 </DialogHeader>

//                 <div className="space-y-4">
//                     {file && (
//                         <div className="border rounded-lg p-4 bg-gray-50">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 flex items-center justify-center">
//                                     {file.type === "pdf" && <BsFiletypePdf size={24} className="text-red-500" />}
//                                     {file.type === "png" && (
//                                         <BsFiletypePng size={24} className="text-green-500" />
//                                     )}
//                                     {file.type === "docx" && (
//                                         <BsFiletypeDocx size={24} className="text-blue-500" />
//                                     )}
//                                 </div>
//                                 <div>
//                                     <p className="font-medium text-sm">
//                                         {file.name}.{file.type}
//                                     </p>
//                                     {/* <p className="text-xs text-gray-500">{currentEditingDocument.tamano}</p> */}
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     <div className="space-y-2">
//                         <Label className="text-sm font-medium text-gray-700">Nombre del archivo</Label>
//                         <Input
//                             type="text"
//                             value={editName}
//                             onChange={(e) => setEditName(e.target.value)}
//                             placeholder="Ingresa el nombre del archivo"
//                         />
//                     </div>

//                     <div className="space-y-2">
//                         <Label className="text-sm font-medium text-gray-700">Tipo de contenido</Label>
//                         <Select value={editContent} onValueChange={(value) => setEditContent(value as ContentType)}>
//                             <SelectTrigger>
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="personas">Personas</SelectItem>
//                                 <SelectItem value="comida">Comida</SelectItem>
//                                 <SelectItem value="medicina">Medicina</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="flex justify-end gap-2">
//                         <Button variant="outline" onClick={closeModal}>
//                             Cancelar
//                         </Button>
//                         <Button onClick={saveEdit} disabled={!editName.trim()} className="bg-blue-600 hover:bg-blue-700">
//                             Guardar cambios
//                         </Button>
//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     )
// }


interface DialogViewFileProps extends DialogProps {
    handleDownloadDocument: (document: IDocument) => void
}

export const DialogViewFile = ({ open, setOpen, file, handleDownloadDocument }: DialogViewFileProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye size={20} />
                        Ver documento: {file?.name}
                    </DialogTitle>
                    <DialogDescription>
                        Visualización del contenido del archivo {file?.type?.toUpperCase()}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">{file && renderDocumentContent(file as IDocument)}</div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cerrar
                    </Button>
                    <Button
                        onClick={() => file && handleDownloadDocument(file as IDocument)}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Download size={16} className="mr-2" />
                        Descargar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const renderDocumentContent = (document: IDocument) => {
    const description = document.description || "Sin descripción disponible"

    switch (document.type) {
        case "pdf":
            return (
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center max-w-2xl">
                        <BsFiletypePdf size={64} className="text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Documento PDF</h3>
                        <p className="text-gray-600 mb-4">{document.name}.pdf</p>
                        <div className="bg-white p-6 rounded border text-left">
                            <h4 className="font-bold mb-3">Descripción del documento:</h4>
                            <p className="text-gray-700 leading-relaxed">{description}</p>
                            <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                                <p>
                                    <strong>Tipo de contenido:</strong> {document.content}
                                </p>
                                {/* <p>
                    <strong>Tamaño:</strong> {document.tamano}
                  </p> */}
                                <p>
                                    <strong>Fecha:</strong> {formatDate(document.date)}
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
                            <p className="text-gray-600 mb-4">{document.name}.png</p>
                            <div className="bg-gradient-to-br from-blue-100 to-green-100 w-48 h-32 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-2xl mb-2">🖼️</div>
                                    <p className="text-sm text-gray-600">Vista previa de imagen</p>
                                </div>
                            </div>
                            <div className="text-left bg-gray-50 p-4 rounded">
                                <h4 className="font-bold mb-2">Descripción:</h4>
                                <p className="text-gray-700 leading-relaxed">{description}</p>
                                {/* <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                    <p>
                      <strong>Tamaño:</strong> {document.tamano}
                    </p>
                  </div> */}
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
                                <h3 className="text-lg font-semibold">{document.name}.docx</h3>
                                <p className="text-sm text-gray-500">Documento de Word</p>
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            <h4 className="text-base font-semibold mb-3">Descripción del documento:</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 leading-relaxed">{description}</p>
                            </div>

                            <div className="mt-4 pt-4 border-t">
                                <h5 className="font-medium mb-2">Información del archivo:</h5>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>
                                        <strong>Tipo de contenido:</strong> {document.content}
                                    </p>
                                    <p>
                                        <strong>Fecha de modificación:</strong> {formatDate(document.date)}
                                    </p>
                                    {/* <p>
                      <strong>Tamaño:</strong> {document.tamano}
                    </p> */}
                                    {/* <p>
                      <strong>Propietario:</strong> {document.propietario}
                    </p> */}
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
