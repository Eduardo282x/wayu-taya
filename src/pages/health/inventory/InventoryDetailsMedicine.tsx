import { IInventory } from "@/services/inventory/inventory.interface";
import { FaCalendarAlt, FaFlask, FaLayerGroup, FaWarehouse } from "react-icons/fa";

interface InventoryDetailsMedicine {
  inventory: IInventory;
}

export const InventoryDetailsMedicine = ({ inventory }: InventoryDetailsMedicine) => {
  const { medicine, totalStock, stores, datesMedicine, lotes } = inventory;

  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm space-y-4">
      {/* Información general del producto/medicina */}
      <div>
        <h3 className="font-semibold text-lg text-blue-700">{medicine.name}</h3>
        <p className="text-gray-700">{medicine.description}</p>
        <div className="flex flex-wrap gap-4 mt-2 text-sm">
          <div><strong>Unidad:</strong> {medicine.unit}</div>
          <div><strong>Cantidad por unidad:</strong> {medicine.amount}</div>
          <div><strong>Temperatura:</strong> {medicine.temperate}</div>
          <div><strong>Fabricante:</strong> {medicine.manufacturer}</div>
          <div><strong>Principio Activo:</strong> {medicine.activeIngredient}</div>
          <div><strong>Origen:</strong> {medicine.countryOfOrigin}</div>
        </div>
      </div>

      {/* Lotes */}
      <div>
        <h4 className="font-medium flex items-center gap-2 text-blue-600"><FaLayerGroup /> Lotes</h4>
        <ul className="list-disc list-inside ml-2 text-gray-800">
          {lotes.map((lote, index) => (
            <li key={index}>{lote}</li>
          ))}
        </ul>
      </div>

      {/* Almacenes */}
      <div>
        <h4 className="font-medium flex items-center gap-2 text-blue-600"><FaWarehouse /> Almacenes</h4>
        <ul className="list-disc list-inside ml-2 text-gray-800">
          {stores.map((store) => (
            <li key={store.id}>
              {store.name} - <span className="text-gray-500">{store.address} - Cantidad: {store.amount}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fechas de ingreso y vencimiento */}
      <div>
        <h4 className="font-medium flex items-center gap-2 text-blue-600"><FaCalendarAlt /> Fechas de ingreso y vencimiento</h4>
        <ul className="list-disc list-inside ml-2 text-gray-800">
          {datesMedicine.map((date, index) => (
            <li key={index}>
              <strong>Ingreso:</strong> {new Date(date.admissionDate).toLocaleDateString()} | <strong>Vence:</strong> {new Date(date.expirationDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>

      {/* Stock total */}
      <div>
        <h4 className="font-medium flex items-center gap-2 text-blue-600"><FaFlask /> Stock total</h4>
        <p className="text-gray-700">{totalStock} unidades disponibles</p>
      </div>
    </div>
  );
}
