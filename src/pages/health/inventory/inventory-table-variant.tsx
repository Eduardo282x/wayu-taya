/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { TableComponents } from "@/components/table/TableComponents"
import { TableRow, TableCell } from "@/components/ui/table"
import type { Column } from "@/components/table/table.interface"
import type { Medicine } from "./inventory.data"
import { FaRegEdit, FaRegTrashAlt, FaChevronDown, FaChevronUp, FaRegSave } from "react-icons/fa"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import "./inventory-table-variant.css"

interface InventoryTableVariantProps {
  medicines: Medicine[]
  onEdit: (medicine: Medicine) => void
  onDelete: (medicineId: number) => void
}

interface AdditionalData {
  almacen: string
  lote: string
  proveedor: string
  ubicacion: string
  temperatura: string
  categoria: string
}


const getAdditionalMedicineData = (medicineId: number): AdditionalData => ({
  almacen: `Almacén ${Math.floor(Math.random() * 5) + 1}`,
  lote: `LT-${medicineId.toString().padStart(4, "0")}-${new Date().getFullYear()}`,
  proveedor: ["Farmacéutica ABC", "Laboratorios XYZ", "MediSupply Corp"][Math.floor(Math.random() * 3)],
  ubicacion: `Pasillo ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}, Estante ${Math.floor(Math.random() * 10) + 1}`,
  temperatura: `${Math.floor(Math.random() * 10) + 15}°C - ${Math.floor(Math.random() * 10) + 20}°C`,
  categoria: ["Analgésico", "Antibiótico", "Antiinflamatorio", "Vitamina"][Math.floor(Math.random() * 4)],
})

export const InventoryTableVariant = ({ medicines, onEdit, onDelete }: InventoryTableVariantProps) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [additionalData, setAdditionalData] = useState<{ [key: number]: AdditionalData }>({})
  const [editableData, setEditableData] = useState<AdditionalData | null>(null)

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

  const handleRowExpand = (medicine: Medicine) => {
    if (expandedRow === medicine.id) {
      setExpandedRow(null)
      setIsEditingDetails(false)
    } else {
      setExpandedRow(medicine.id)
      setIsEditingDetails(false)

      if (!additionalData[medicine.id]) {
        const data = getAdditionalMedicineData(medicine.id)
        setAdditionalData((prev) => ({
          ...prev,
          [medicine.id]: data,
        }))
        setEditableData(data)
      } else {
        setEditableData(additionalData[medicine.id])
      }
    }
  }

  const handleSaveAdditionalData = () => {
    if (editableData && expandedRow) {
      setAdditionalData((prev) => ({
        ...prev,
        [expandedRow]: editableData,
      }))
      setIsEditingDetails(false)
    }
  }

  const handleActionTable = (action: string, data: Medicine) => {
    switch (action) {
      case "edit":
        onEdit(data)
        break
      case "delete":
        onDelete(data.id)
        break
      case "expand":
        handleRowExpand(data)
        break
      default:
        break
    }
  }

  const getRowClassName = (medicine: Medicine) => {
    let className = ""
    if (isExpired(medicine.fechaExpiracion)) {
      className += " expired-row"
    } else if (isExpiringSoon(medicine.fechaExpiracion)) {
      className += " expiring-soon-row"
    }
    if (expandedRow === medicine.id) {
      className += " expanded-row"
    }
    return className
  }


  const medicineColumns: Column[] = [
    {
      label: "",
      column: "expand",
      visible: true,
      isIcon: true,
      element: () => "",
      icon: {
        label: "Expandir detalles",
        icon: expandedRow ? FaChevronUp : FaChevronDown,
        className: "text-gray-600",
        variant: "ghost",
      },
    },
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
      label: "Editar",
      column: "edit",
      visible: true,
      isIcon: true,
      element: () => "",
      icon: {
        label: "Editar medicina",
        icon: FaRegEdit,
        className: "text-blue-600",
        variant: "ghost",
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
  ]

  return (
    <div className="inventory-table-wrapper">
      <TableComponents
        data={medicines}
        column={medicineColumns}
        actionTable={handleActionTable}
        colSpanColumns={true}
        isExpansible={true}
        renderRow={(medicine: Medicine, index: number) => (
          <MedicineDetails medicine={medicine} isEditingDetails={isEditingDetails} setIsEditingDetails={setIsEditingDetails}  key={index}>
          </MedicineDetails>
        )}
      />
    </div>
  )
}

interface MedicineDetailsProps {
  medicine: Medicine;
  setIsEditingDetails: (active: boolean) => void;
  isEditingDetails: boolean;
}

const MedicineDetails = ({ medicine, setIsEditingDetails, isEditingDetails }: MedicineDetailsProps) => {
  console.log(medicine);

  return (
    <div>
      hola
      {/* <div className="bg-gray-50 p-6 border-t border-gray-200 animate-in">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Información Adicional - {medicine.medicina}
          </h4>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="animated"
              onClick={() => setIsEditingDetails(!isEditingDetails)}
              className="text-white"
            >
              {isEditingDetails ? "Cancelar" : "Editar"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="almacen">Almacén:</Label>
            {isEditingDetails ? (
              <Input
                id="almacen"
                value={editableData?.almacen || ""}
                onChange={(e) =>
                  setEditableData((prev) => (prev ? { ...prev, almacen: e.target.value } : null))
                }
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-700">{additionalData[medicine.id].almacen}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lote">Lote:</Label>
            {isEditingDetails ? (
              <Input
                id="lote"
                value={editableData?.lote || ""}
                onChange={(e) =>
                  setEditableData((prev) => (prev ? { ...prev, lote: e.target.value } : null))
                }
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-700">{additionalData[medicine.id].lote}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <Label htmlFor="proveedor">Proveedor:</Label>
            {isEditingDetails ? (
              <Input
                id="proveedor"
                value={editableData?.proveedor || ""}
                onChange={(e) =>
                  setEditableData((prev) => (prev ? { ...prev, proveedor: e.target.value } : null))
                }
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-700">{additionalData[medicine.id].proveedor}</p>
            )}
          </div>
          <div>
            <Label htmlFor="categoria">Categoría:</Label>
            {isEditingDetails ? (
              <Input
                id="categoria"
                value={editableData?.categoria || ""}
                onChange={(e) =>
                  setEditableData((prev) => (prev ? { ...prev, categoria: e.target.value } : null))
                }
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-700">{additionalData[medicine.id].categoria}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <Label htmlFor="ubicacion">Ubicación:</Label>
            {isEditingDetails ? (
              <Input
                id="ubicacion"
                value={editableData?.ubicacion || ""}
                onChange={(e) =>
                  setEditableData((prev) => (prev ? { ...prev, ubicacion: e.target.value } : null))
                }
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-700">{additionalData[medicine.id].ubicacion}</p>
            )}
          </div>
          <div>
            <Label htmlFor="temperatura">Temperatura:</Label>
            {isEditingDetails ? (
              <Input
                id="temperatura"
                value={editableData?.temperatura || ""}
                onChange={(e) =>
                  setEditableData((prev) => (prev ? { ...prev, temperatura: e.target.value } : null))
                }
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-700">{additionalData[medicine.id].temperatura}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <strong>Estado:</strong>
          <div className="mt-2">
            {isExpired(medicine.fechaExpiracion) && <span className="status-badge expired">Expirado</span>}
            {isExpiringSoon(medicine.fechaExpiracion) && (
              <span className="status-badge expiring">Por expirar (menos de 30 días)</span>
            )}
            {!isExpired(medicine.fechaExpiracion) && !isExpiringSoon(medicine.fechaExpiracion) && (
              <span className="status-badge" style={{ backgroundColor: "#10b981", color: "white" }}>
                En buen estado
              </span>
            )}
          </div>
        </div>

        {isEditingDetails && (
          <div className="flex justify-end mt-6">
            <Button
              variant="default"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
              onClick={handleSaveAdditionalData}
            >
              <FaRegSave className="mr-2 size-4" />
              Guardar
            </Button>
          </div>
        )}
      </div> */}
    </div>
  )
}
