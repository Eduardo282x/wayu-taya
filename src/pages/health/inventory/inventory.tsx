import { MdOutlineProductionQuantityLimits } from "react-icons/md"
import { InventoryDetailsMedicine } from "./InventoryDetailsMedicine"
import { historyColumns, inventoryColumns } from "./inventory.data"
import { useState, useMemo } from "react"
import ConfirmDeleteDialog from "./confirm-delete-dialog"
import AlertDialog from "./alert-dialog"
import { HeaderPages } from "@/layout/header/Header"
import type { IInventory } from "@/services/inventory/inventory.interface"
import { TableComponents } from "@/components/table/TableComponents"
import { FaHistory, FaExchangeAlt } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { MoveMedicineDialog, MoveMedicineFormData } from "./move-medicine-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IStore } from "@/services/store/store.interface"
import { useInventoryQuery, useInventoryHistoryQuery, useAllInventoryQuery, useMoveInventoryMutation } from "./inventory.hook"
import { useInventoryStore } from "./inventoryStore"
import { useStoresQuery } from "@/pages/health/store/store.hook"
import { debounce } from "@/lib/debounce"
// import { SuccessDialog } from "./success-dialog"

export const Inventory = () => {
  const [alertOpen, setAlertOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [inventorySelected, setInventorySelected] = useState<IInventory | null>(null)
  const [currentView, setCurrentView] = useState<"inventory" | "history">("inventory")
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false)
  // const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)

  const { page, size, name, storeId, setPage, setSize, setName, setStoreId } = useInventoryStore()
  const { data: inventoryData, isFetching } = useInventoryQuery()
  const { data: historyData, isFetching: historyIsFetching } = useInventoryHistoryQuery()
  const { data: allInventoryData } = useAllInventoryQuery()
  const { data: storesData } = useStoresQuery()
  const moveInventory = useMoveInventoryMutation()

  const currentInventory = inventoryData?.inventory ?? []
  const totalInventory = inventoryData?.total ?? 0
  const stores: IStore[] = storesData?.stores ?? []

  const [searchInventory, setSearchInventory] = useState<string>(name)

  const debouncedName = useMemo(
    () => debounce((value: string) => setName(value), 300),
    []
  )

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

  const filterInventoryByStore = (storeValue: string) => {
    setStoreId(storeValue === 'all' ? null : Number(storeValue))
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

    await moveInventory.mutateAsync({ movements: parseData })

    // Cerrar el diálogo de movimiento y abrir el de éxito
    setIsMoveDialogOpen(false);
  }

  return (
    <div className="lg:min-h-[90vh] max-h-[77vh] w-[79.5vw] pl-2 lg:pl-0 overflow-auto ">
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
          <Select value={storeId == null ? 'all' : storeId.toString()} onValueChange={filterInventoryByStore}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar por almacén..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>
                Todos
              </SelectItem>
              {stores.map(item => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input
            type="search"
            placeholder="Buscar medicina..."
            className="w-40 lg:w-60 focus:outline-0 shadow-2xl border-1 border-gray-400 bg-white rounded-lg h-9 placeholder:opacity-60 p-2 manrope focus:ring-1 focus:ring-[#3449D5] transition-all 100s"
            value={searchInventory}
            onChange={(e) => {
              setSearchInventory(e.target.value)
              debouncedName(e.target.value)
            }}
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
            key="inventory"
            data={currentInventory}
            column={inventoryColumns}
            actionTable={getActionTable}
            colSpanColumns={true}
            isExpansible={true}
            totalItems={totalInventory}
            page={page}
            onPageChange={setPage}
            rowsPerPage={size}
            onRowsPerPageChange={setSize}
            loading={isFetching}
            renderRow={(inventory: IInventory, index: number) => (
              <InventoryDetailsMedicine inventory={inventory} key={index} />
            )}
          />
        ) : (
          <TableComponents
            key="history"
            data={historyData?.history ?? []}
            column={historyColumns}
            actionTable={() => { }}
            colSpanColumns={false}
            isExpansible={false}
            loading={historyIsFetching}
          />
        )}

        <ConfirmDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          medicineName={`${inventorySelected?.medicine.name} ${inventorySelected?.medicine.presentation}`}
        />

        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen} title="Error" description={"Mensaje"} />

        <MoveMedicineDialog
          open={isMoveDialogOpen}
          onOpenChange={setIsMoveDialogOpen}
          inventory={allInventoryData?.inventory ?? []}
          stores={stores}
          onSubmit={onSubmitMovedInventory}
        />

        {/* <SuccessDialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen} movementData={movementData} /> */}
      </div>
    </div>
  )
}
