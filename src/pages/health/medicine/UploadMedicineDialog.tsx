import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import { FaPills } from "react-icons/fa";

interface UploadMedicineDialogProps {
    isUploadOpen: boolean;
    setIsUploadOpen: (open: boolean) => void;
    dragActive: boolean;
    handleDrag: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    formatFileSize: (bytes: number) => string;
    uploadedFile: File | null;
    handleSaveMedicineFile: () => void;
    removeUploadedFile: () => void;
}

export const UploadMedicineDialog = ({
    isUploadOpen,
    setIsUploadOpen,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileInput,
    formatFileSize,
    uploadedFile,
    handleSaveMedicineFile,
    removeUploadedFile,
}: UploadMedicineDialogProps) => {
    return (
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Cargar datos de medicinas</DialogTitle>
                    <DialogDescription>Sube un archivo Excel con los datos de las medicinas</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-blue-800 bg-blue-50" : "border-gray-300 border-gray-400"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">Arrastra tu archivo aquí</p>
                        <p className="text-sm text-gray-500 mb-4">o haz clic para seleccionar un archivo Excel</p>
                        <input
                            type="file"
                            className="hidden"
                            id="medicine-file-upload"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileInput}
                        />
                        <Label
                            htmlFor="medicine-file-upload"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 cursor-pointer"
                        >
                            Seleccionar archivo
                        </Label>
                    </div>

                    {uploadedFile && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        <FaPills className="text-blue-800" size={24} />
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
                        <Button
                            onClick={handleSaveMedicineFile}
                            disabled={!uploadedFile}
                            className="bg-blue-800 hover:bg-blue-900"
                        >
                            Cargar medicinas
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
