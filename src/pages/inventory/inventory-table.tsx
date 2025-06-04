import type React from "react"
import type { Medicine } from "./types"
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { CustomTable, CustomTableRow, CustomTableCell } from "././custom-table"

interface InventoryTableProps {
  medicines: Medicine[]
  onEdit: (medicine: Medicine) => void
  onDelete: (medicineId: number) => void
}

const InventoryTable: React.FC<InventoryTableProps> = ({ medicines, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES")
  }

  const isExpiringSoon = (expirationDate: string) => {
    const today = new Date()
    const expDate = new Date(expirationDate)
    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isExpired = (expirationDate: string) => {
    const today = new Date()
    const expDate = new Date(expirationDate)
    return expDate < today
  }

  const getRowClassName = (expirationDate: string) => {
    if (isExpired(expirationDate)) {
      return "expired-row"
    }
    if (isExpiringSoon(expirationDate)) {
      return "expiring-soon-row"
    }
    return ""
  }

  const getDateClassName = (expirationDate: string) => {
    if (isExpired(expirationDate)) {
      return "expired-date"
    }
    if (isExpiringSoon(expirationDate)) {
      return "expiring-soon-date"
    }
    return ""
  }

  const columns = [
    { header: "Medicina", key: "medicina" },
    { header: "Cantidad", key: "cantidad" },
    { header: "Fecha de Llegada", key: "fechaLlegada" },
    { header: "Fecha de Expiración", key: "fechaExpiracion" },
    { header: "Editar", key: "edit" },
    { header: "Eliminar", key: "delete" },
  ]

  return (
    <CustomTable columns={columns}>
      {medicines.length === 0 ? (
        <CustomTableRow>
          <CustomTableCell colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
            No hay medicinas en el inventario
          </CustomTableCell>
        </CustomTableRow>
      ) : (
        medicines.map(({ id, medicina, cantidad, fechaLlegada, fechaExpiracion }) => (
          <CustomTableRow key={id} className={getRowClassName(fechaExpiracion)}>
            <CustomTableCell className="font-medium">{medicina}</CustomTableCell>
            <CustomTableCell>{cantidad}</CustomTableCell>
            <CustomTableCell>{formatDate(fechaLlegada)}</CustomTableCell>
            <CustomTableCell className={getDateClassName(fechaExpiracion)}>
              {formatDate(fechaExpiracion)}
              {isExpired(fechaExpiracion) && <span className="status-badge expired">Expirado</span>}
              {isExpiringSoon(fechaExpiracion) && <span className="status-badge expiring">Por expirar</span>}
            </CustomTableCell>
            <CustomTableCell className="actions-cell">
              <Button
                size={"icon"}
                className="py-[0.4rem] pl-[0.2rem]"
                variant={"edit"}
                onClick={() => onEdit({ id, medicina, cantidad, fechaLlegada, fechaExpiracion })}
                aria-label={`Editar medicina ${medicina}`}
              >
                <FaRegEdit className="size-4.5" />
              </Button>
            </CustomTableCell>
            <CustomTableCell>
              <Button
                className="rounded-xl py-[0.4rem] px-[0.2rem]"
                size={"icon"}
                variant={"delete"}
                onClick={() => onDelete(id)}
                aria-label={`Eliminar medicina ${medicina}`}
              >
                <FaRegTrashAlt className="size-5" />
              </Button>
            </CustomTableCell>
          </CustomTableRow>
        ))
      )}
    </CustomTable>
  )
}

export default InventoryTable
