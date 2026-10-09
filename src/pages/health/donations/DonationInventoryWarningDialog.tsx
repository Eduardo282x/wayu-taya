import { AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogDescription,
  StyledDialogFooter,
  StyledDialogHeader,
  StyledDialogTitle,
} from "@/components/StyledDialog/StyledDialog"
import { IDonations } from "@/services/donations/donations.interface"
import { IStore } from "@/services/store/store.interface"
import { formatNumberWithDots } from "@/hooks/formaters"

interface DonationInventoryWarningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "edit" | "delete"
  donation: IDonations | null
  stores?: IStore[]
  loading?: boolean
  onConfirm: () => void
}

export const DonationInventoryWarningDialog = ({
  open,
  onOpenChange,
  mode,
  donation,
  stores = [],
  loading = false,
  onConfirm,
}: DonationInventoryWarningDialogProps) => {
  const isDelete = mode === "delete"

  const title = isDelete
    ? "Confirmar eliminación de donación"
    : "Confirmar modificación de donación"

  const description = isDelete
    ? "Al eliminar la donación se revertirán sus movimientos de inventario. Las unidades que ya se usaron en salidas o transferencias no podrán recuperarse por completo."
    : "Se detectaron cambios en los elementos de esta donación. Al guardar se volverá a procesar el inventario: se revertirán los lotes originales y se cargarán las nuevas cantidades."

  const medicineNames = new Map<number, string>()
  donation?.detDonation?.forEach((det) => {
    if (det.medicine) {
      medicineNames.set(
        det.medicineId,
        `${det.medicine.name} ${det.medicine.presentation ?? ""}`.trim(),
      )
    }
  })

  const storeNames = new Map<number, string>()
  stores.forEach((store) => storeNames.set(store.id, store.name))

  const outflows = donation?.outflows ?? []
  const showOutflows = Boolean(donation?.hasOutflows) && outflows.length > 0

  return (
    <StyledDialog open={open} onOpenChange={onOpenChange}>
      <StyledDialogContent className="sm:max-w-2xl max-w-[95vw] w-full mx-4 max-h-[90vh] overflow-y-auto">
        <StyledDialogHeader>
          <StyledDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-amber-500" />
            {title}
          </StyledDialogTitle>
          <StyledDialogDescription className="text-gray-800">
            {description}
          </StyledDialogDescription>
        </StyledDialogHeader>

        {showOutflows && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3">
            <p className="manrope text-sm font-semibold text-amber-800 mb-2">
              Salidas y transferencias detectadas sobre estos lotes:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm manrope">
                <thead>
                  <tr className="text-left text-gray-700 border-b border-amber-200">
                    <th className="py-1 pr-3">Medicina</th>
                    <th className="py-1 pr-3">Lote</th>
                    <th className="py-1 pr-3">Almacén</th>
                    <th className="py-1 pr-3 text-right">Salidas</th>
                    <th className="py-1 pr-3 text-right">Transferencias</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {outflows.map((outflow, index) => (
                    <tr
                      key={`${outflow.medicineId}-${outflow.lote}-${outflow.storeId}-${index}`}
                      className="border-b border-amber-100 last:border-0"
                    >
                      <td className="py-1 pr-3">
                        {medicineNames.get(outflow.medicineId) ?? `Medicina #${outflow.medicineId}`}
                      </td>
                      <td className="py-1 pr-3">{outflow.lote || "-"}</td>
                      <td className="py-1 pr-3">
                        {storeNames.get(outflow.storeId) ?? `Almacén #${outflow.storeId}`}
                      </td>
                      <td className="py-1 pr-3 text-right">{formatNumberWithDots(outflow.salidas)}</td>
                      <td className="py-1 pr-3 text-right">{formatNumberWithDots(outflow.transferencias)}</td>
                      <td className="py-1 text-right font-semibold">{formatNumberWithDots(outflow.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <StyledDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant={isDelete ? "destructive" : "animated"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Procesando...
              </>
            ) : isDelete ? (
              "Eliminar donación"
            ) : (
              "Continuar y guardar"
            )}
          </Button>
        </StyledDialogFooter>
      </StyledDialogContent>
    </StyledDialog>
  )
}

export default DonationInventoryWarningDialog
