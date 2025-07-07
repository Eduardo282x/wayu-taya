import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogHeader,
  StyledDialogTitle,
  StyledDialogDescription,
} from "@/components/StyledDialog/StyledDialog"
import { Button } from "@/components/ui/button"
import { FaCheckCircle, FaExchangeAlt } from "react-icons/fa"

interface MovementSummary {
  medicineName: string
  quantity: number
  sourceStore: string
  targetStore: string
}

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movementData?: MovementSummary[] | null
}

export const SuccessDialog = ({ open, onOpenChange, movementData }: SuccessDialogProps) => {
  const totalMovements = movementData?.length || 0

  return (
    <StyledDialog open={open} onOpenChange={onOpenChange}>
      <StyledDialogContent className="sm:max-w-2xl max-w-[95vw] w-full mx-4">
        <StyledDialogHeader>
          <StyledDialogTitle className="flex items-center gap-2 justify-center">
            <FaCheckCircle className="text-green-600" />
            Movimientos Completados
          </StyledDialogTitle>
          <StyledDialogDescription className="text-center">
            {totalMovements === 1
              ? "El movimiento de medicina se ha realizado satisfactoriamente."
              : `Se han realizado ${totalMovements} movimientos de medicinas satisfactoriamente.`}
          </StyledDialogDescription>
        </StyledDialogHeader>

        {movementData && movementData.length > 0 && (
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {/* Icono de éxito central */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
              <h4 className="font-semibold text-blue-800 mb-2">Resumen General</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700">Total de Movimientos:</span>
                  <p className="text-blue-800 text-lg font-bold">{totalMovements}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Medicinas Movidas:</span>
                  <p className="text-blue-800 text-lg font-bold">
                    {new Set(movementData.map((m) => m.medicineName)).size}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Unidades Totales:</span>
                  <p className="text-blue-800 text-lg font-bold">
                    {movementData.reduce((sum, m) => sum + m.quantity, 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles de cada movimiento */}
            <div className="space-y-3">
              <h4 className="font-semibold text-green-800 flex items-center gap-2">
                <FaExchangeAlt className="text-green-600" />
                Detalles de los Movimientos
              </h4>

              {movementData.map((movement, index) => (
                <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-green-800">Movimiento {index + 1}</h5>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Completado</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-green-700">Medicina:</span>
                      <p className="text-green-800">{movement.medicineName}</p>
                    </div>

                    <div>
                      <span className="font-medium text-green-700">Cantidad:</span>
                      <p className="text-green-800">{movement.quantity} unidades</p>
                    </div>

                    <div>
                      <span className="font-medium text-green-700">Desde:</span>
                      <p className="text-green-800">{movement.sourceStore}</p>
                    </div>

                    <div>
                      <span className="font-medium text-green-700">Hacia:</span>
                      <p className="text-green-800">{movement.targetStore}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mensaje adicional */}
            <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p>El inventario ha sido actualizado automáticamente.</p>
              <p>Puedes verificar los cambios en la tabla de inventario.</p>
            </div>
          </div>
        )}

        {/* Botón de cerrar */}
        <div className="flex justify-center pt-4">
          <Button variant="animated" onClick={() => onOpenChange(false)} className="px-8">
            <FaCheckCircle className="mr-2" />
            Entendido
          </Button>
        </div>
      </StyledDialogContent>
    </StyledDialog>
  )
}
