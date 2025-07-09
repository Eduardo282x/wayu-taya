import { MdOutlineProductionQuantityLimits } from "react-icons/md"
import { InventoryDetailsMedicine } from "./InventoryDetailsMedicine"
import { FilterComponent } from "@/components/table/FilterComponent"
import { historyColumns, inventoryColumns } from "./inventory.data"
import { useState, useEffect } from "react"
import ConfirmDeleteDialog from "./confirm-delete-dialog"
import AlertDialog from "./alert-dialog"
import { HeaderPages } from "@/pages/layout/Header"
import { getInventory, getInventoryHistorial, moveInventoryStorage } from "@/services/inventory/inventory.service"
import type { GroupInventory, IInventory, IInventoryHistory } from "@/services/inventory/inventory.interface"
import { TableComponents } from "@/components/table/TableComponents"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { FaHistory, FaExchangeAlt } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { MoveMedicineDialog, MoveMedicineFormData } from "./move-medicine-dialog"
// import { SuccessDialog } from "./success-dialog"

export const Inventory = () => {
  const [inventory, setInventory] = useState<GroupInventory>({ allInventory: [], inventory: [] })
  const [alertOpen, setAlertOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [inventorySelected, setInventorySelected] = useState<IInventory | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [currentView, setCurrentView] = useState<"inventory" | "history">("inventory")
  const [historyData, setHistoryData] = useState<IInventoryHistory[]>([])
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false)
  // const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)

  useEffect(() => {
    getInventoryApi()
    getInventoryHistorialApi()
  }, [])

  const getInventoryApi = async () => {
    setLoading(true)
    try {
      const response: IInventory[] = await getInventory()
      setInventory({ allInventory: response, inventory: response })
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const getInventoryHistorialApi = async () => {
    try {
      const response: IInventoryHistory[] = await getInventoryHistorial()
      setHistoryData(response)
    } catch (err) {
      console.log(err)
    }
  }

  const getActionTable = (action: string, data: IInventory) => {
    setInventorySelected(data)
    if (action == "delete") {
      setIsDeleteDialogOpen(true)
    }
  }

  const handleConfirmDelete = () => {
    setInventorySelected(null)
    setIsDeleteDialogOpen(false)
  }

  const onSubmitMovedInventory = async (data: MoveMedicineFormData) => {
    const parseData = data.movements.map(item => {
      return {
      medicineId: Number(item.medicineId),
        sourceStoreId: Number(item.sourceStoreId),
        quantity: Number(item.quantity),
        targetStoreId: Number(item.targetStoreId),
      }
    });

    await moveInventoryStorage({ movements: parseData })

    // Cerrar el diálogo de movimiento y abrir el de éxito
    setIsMoveDialogOpen(false);
    await getInventoryApi();
  }

  return (
    <div className="lg:min-h-[90vh] max-h-[77vh] w-[79.5vw] pl-2 lg:pl-0 overflow-auto ">
      {loading && <ScreenLoader />}
      <HeaderPages title="Inventario" Icon={MdOutlineProductionQuantityLimits} />

      {/* Barra de herramientas con filtros */}
      <div className="w-full h-fit border-b-2 border-gray-300 flex items-center pb-2 px-2 lg:justify-between flex-col lg:flex-row gap-2 lg:gap-0">
        <Button
          onClick={() => setIsMoveDialogOpen(true)}
          className="flex items-center gap-2"
          size="sm"
          variant={'animated'}
        >
          <FaExchangeAlt className="w-4 h-4" />
          Mover Medicinas
        </Button>

        <div className="flex items-center gap-2">
          <FilterComponent
            data={inventory.allInventory}
            setDataFilter={(data) =>
              setInventory((prev) => {
                return { ...prev, inventory: data }
              })
            }
            columns={inventoryColumns}
            placeholder="Buscar medicina..."
          />
          <Button
            variant={currentView === "inventory" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentView("inventory")}
            className="flex items-center gap-2"
          >
            <MdOutlineProductionQuantityLimits className="w-4 h-4" />
            Inventario
          </Button>
          <Button
            variant={currentView === "history" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentView("history")}
            className="flex items-center gap-2"
          >
            <FaHistory className="w-4 h-4" />
            Historial
          </Button>
        </div>
      </div>

      <div className="mt-3">
        {currentView === "inventory" ? (
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

        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen} title="Error" description={"Mensaje"} />

        <MoveMedicineDialog
          open={isMoveDialogOpen}
          onOpenChange={setIsMoveDialogOpen}
          inventory={inventory.inventory}
          onSubmit={onSubmitMovedInventory}
        />

        {/* <SuccessDialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen} movementData={movementData} /> */}
      </div>
    </div>
  )
}
