import { Column } from "@/components/table/table.interface"
import { formatDate } from "@/utils/formatters"
import { FaRegTrashAlt } from "react-icons/fa"

export interface GroupMedicine {
  allMedicine: Medicine[];
  medicine: Medicine[];
}

export interface Medicine {
  id: number
  medicina: string
  cantidad: number
  fechaLlegada: string
  fechaExpiracion: string
}

export const medicineColumns: Column[] = [
  {
    label: "Medicina",
    column: "medicina",
    visible: true,
    isIcon: false,
    element: (data: Medicine) => data.medicina,
  },
  {
    label: "Cantidad",
    column: "cantidad",
    visible: true,
    isIcon: false,
    element: (data: Medicine) => `${data.cantidad} unidades`,
  },
  {
    label: "Fecha de Llegada",
    column: "fechaLlegada",
    visible: true,
    isIcon: false,
    element: (data: Medicine) => formatDate(data.fechaLlegada),
  },
  {
    label: "Fecha de Expiración",
    column: "fechaExpiracion",
    visible: true,
    isIcon: false,
    element: (data: Medicine) => formatDate(data.fechaExpiracion),
    className: (data: Medicine) => {
      if (isExpired(data.fechaExpiracion)) {
        return "expired-date"
      } else if (isExpiringSoon(data.fechaExpiracion)) {
        return "expiring-soon-date"
      }
      return ""
    },
  },
  {
    label: "Eliminar",
    column: "delete",
    visible: true,
    isIcon: true,
    element: () => "",
    icon: {
      label: "Eliminar medicina",
      icon: FaRegTrashAlt,
      className: "text-red-600",
      variant: "ghost",
    },
  },
];


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