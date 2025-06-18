import { IInventory } from "@/services/inventory/inventory.interface";

interface InventoryDetailsMedicine {
  inventory: IInventory;
}

export const InventoryDetailsMedicine = ({ inventory }: InventoryDetailsMedicine) => {
  console.log(inventory);

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
