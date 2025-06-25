import { MdOutlineProductionQuantityLimits } from "react-icons/md"
import { InventoryDetailsMedicine } from "./InventoryDetailsMedicine"
import { FilterComponent } from "@/components/table/FilterComponent"
import { inventoryColumns } from "./inventory.data"
import { useState, useEffect } from "react"
import ConfirmDeleteDialog from "./confirm-delete-dialog"
import AlertDialog from "./alert-dialog"
import { HeaderPages } from "@/pages/layout/Header"
import { getInventory } from "@/services/inventory/inventory.service"
import { GroupInventory, IInventory } from "@/services/inventory/inventory.interface"
import { TableComponents } from "@/components/table/TableComponents"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { FaHistory } from "react-icons/fa"
import { Button } from "@/components/ui/button"

const historyColumns = [
  {
    label: "Medicina",
    column: "medicine.name",
    visible: true,
    isIcon: false,
    element: (data: any) => `${data.medicine.name} ${data.medicine.amount}${data.medicine.unit}`,
  },
  {
    label: "Tipo",
    column: "type",
    visible: true,
    isIcon: false,
    element: (data: any) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        data.type === 'entrada'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
      </span>
    ),
  },
  {
    label: "Cantidad",
    column: "quantity",
    visible: true,
    isIcon: false,
    element: (data: any) => `${data.quantity} unidades`,
  },
  {
    label: "Fecha",
    column: "date",
    visible: true,
    isIcon: false,
    element: (data: any) => new Date(data.date).toLocaleDateString(),
  },
  {
    label: "Almacén",
    column: "store",
    visible: true,
    isIcon: false,
    element: (data: any) => data.store,
  },
  {
    label: "Lote",
    column: "lote",
    visible: true,
    isIcon: false,
    element: (data: any) => data.lote,
  },
  {
    label: "Motivo",
    column: "reason",
    visible: true,
    isIcon: false,
    element: (data: any) => data.reason,
  },
]

export const Inventory = () => {
  const [inventory, setInventory] = useState<GroupInventory>({ allInventory: [], inventory: [] })
  const [alertOpen, setAlertOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [inventorySelected, setInventorySelected] = useState<IInventory | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'inventory' | 'history'>('inventory')
  const [historyData, setHistoryData] = useState([
    {
      id: 1,
      medicine: { name: "Paracetamol", amount: "500", unit: "mg" },
      type: "entrada",
      quantity: 100,
      date: "2024-01-15",
      store: "Almacén Principal",
      lote: "LOT001",
      reason: "Compra mensual"
    },
    {
      id: 2,
      medicine: { name: "Ibuprofeno", amount: "400", unit: "mg" },
      type: "salida",
      quantity: 25,
      date: "2024-01-14",
      store: "Farmacia Norte",
      lote: "LOT002",
      reason: "Dispensación"
    },
    {
      id: 3,
      medicine: { name: "Amoxicilina", amount: "250", unit: "mg" },
      type: "entrada",
      quantity: 200,
      date: "2024-01-13",
      store: "Almacén Secundario",
      lote: "LOT003",
      reason: "Transferencia interna"
    }
  ])

  useEffect(() => {
    getInventoryApi();
  }, []);

  const getInventoryApi = async () => {
    setLoading(true)
    try {
      const response: IInventory[] = await getInventory();
      setInventory({ allInventory: response, inventory: response })
    } catch (err) {
      console.log(err);
    }
    setLoading(false)
  }

  const getActionTable = (action: string, data: IInventory) => {
    setInventorySelected(data);
    if (action == 'delete') {
      setIsDeleteDialogOpen(true)
    }
  }

  const handleConfirmDelete = () => {
    // if (medicineToDelete) {
    //   const updatedMedicines = medicines.allMedicine.filter((m) => m.id !== medicineToDelete.id)
    //   setMedicines(updatedMedicines)
    setInventorySelected(null)
    setIsDeleteDialogOpen(false)
    // }
  };

  return (
    <div className="min-h-[90vh] w-[79.5vw] pr-7 overflow-auto">
      {loading && <ScreenLoader />}
      <HeaderPages title="Inventario" Icon={MdOutlineProductionQuantityLimits} />

      {/* Barra de herramientas con filtros */}
      <div className="w-full h-fit border-b-2 border-gray-300 flex items-center pb-2 px-2 justify-end">
        <div className="flex items-center gap-4">
          <FilterComponent
            data={inventory.allInventory}
            setDataFilter={(data) => setInventory((prev) => { return { ...prev, inventory: data } })}
            columns={inventoryColumns}
            placeholder="Buscar medicina..."
          />
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant={currentView === 'inventory' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentView('inventory')}
            className="flex items-center gap-2"
          >
            <MdOutlineProductionQuantityLimits className="w-4 h-4" />
            Inventario
          </Button>
          <Button
            variant={currentView === 'history' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentView('history')}
            className="flex items-center gap-2"
          >
            <FaHistory className="w-4 h-4" />
            Historial
          </Button>
        </div>
      </div>

      <div className="mt-3">
        {currentView === 'inventory' ? (
          <TableComponents
            data={inventory.inventory}
            column={inventoryColumns}
            actionTable={getActionTable}
            colSpanColumns={true}
            isExpansible={true}
            renderRow={(inventory: IInventory, index: number) => (
              <InventoryDetailsMedicine inventory={inventory} key={index} />
            )}
          />
        ) : (
          <TableComponents
            data={historyData}
            column={historyColumns}
            actionTable={() => { }}
            colSpanColumns={false}
            isExpansible={false}
          />
        )}

        <ConfirmDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          medicineName={`${inventorySelected?.medicine.name} ${inventorySelected?.medicine.amount}${inventorySelected?.medicine.unit}`}
        />

        <AlertDialog
          open={alertOpen}
          onOpenChange={setAlertOpen}
          title="Error"
          description={'Mensaje'}
        />
      </div>
    </div>
  );
};