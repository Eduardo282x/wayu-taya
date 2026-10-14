import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatNumberWithDots } from "@/hooks/formaters"
import { InventorySummary, InventorySummaryStore } from "@/services/inventory/inventory.interface"
import { ChartColumn, Loader2, Warehouse } from "lucide-react"

interface IInventorySummaryPopoverProps {
    data?: InventorySummary | null
    isLoading?: boolean
}

const StatCard = ({ value, label }: { value: number; label: string }) => (
    <div className="rounded-lg bg-blue-50 p-2 text-center">
        <span className="block text-base font-bold text-blue-800">{formatNumberWithDots(value)}</span>
        <span className="text-[10px] text-gray-500">{label}</span>
    </div>
)

const GroupRow = ({ label, items, count }: { label: string; items: number; count: number }) => (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-2 w-1/2">
        <div className="flex items-center gap-2 text-sm font-semibold ">
            {label}
        </div>
        <div className="flex items-center gap-3 text-center">
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">{formatNumberWithDots(items)}</span>
                <span className="text-[10px] text-gray-500">Ítems</span>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">{formatNumberWithDots(count)}</span>
                <span className="text-[10px] text-gray-500">Registros</span>
            </div>
        </div>
    </div>
)

const StoreRow = ({ store }: { store: InventorySummaryStore }) => {
    const percentage = Math.min(Math.max(store.capacityPercentage, 0), 100)

    return (
        <div className="rounded-lg border border-gray-200 p-2">
            <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <Warehouse className="w-3.5 h-3.5 shrink-0 text-[#3449D5]" />
                    <div className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{store.storeName}</span>
                        <span className="block truncate text-[10px] text-gray-500">{store.address}</span>
                    </div>
                </div>
                <span className="shrink-0 text-sm font-semibold">{formatNumberWithDots(store.items)}</span>
            </div>

            <div className="mt-1.5 grid grid-cols-3 gap-1 text-center text-[10px] text-gray-500">
                <span><strong className="text-gray-700">{formatNumberWithDots(store.records)}</strong> Registros</span>
                <span><strong className="text-gray-700">{formatNumberWithDots(store.medicines)}</strong> Medicinas</span>
                <span><strong className="text-gray-700">{formatNumberWithDots(store.availableCapacity)}</strong> Disp.</span>
            </div>

            <div className="mt-1.5">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-linear-to-r from-blue-800 to-[#3089FD]"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="mt-0.5 flex justify-between text-[10px] text-gray-500">
                    <span>{formatNumberWithDots(store.usedCapacity)} / {formatNumberWithDots(store.capacity)}</span>
                    <span>{percentage}%</span>
                </div>
            </div>
        </div>
    )
}

export const InventorySummaryPopover = ({ data, isLoading }: IInventorySummaryPopoverProps) => {
    const hasData = data != null

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="h-9">
                    <ChartColumn className="w-4 h-4" />
                    Resumen
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-140">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <ChartColumn className="w-4 h-4 text-[#3449D5]" />
                        <h3 className="font-semibold text-gray-800">Resumen de inventario</h3>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Cargando resumen...
                        </div>
                    ) : !hasData ? (
                        <p className="py-6 text-center text-sm text-gray-500">Sin datos para los filtros aplicados.</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-2">
                                <StatCard value={data.totalItems} label="Ítems totales" />
                                <StatCard value={data.totalRecords} label="Registros" />
                                <StatCard value={data.totalMedicines} label="Medicinas" />
                            </div>

                            <div className="flex items-center justify-between w-full gap-2">
                                <GroupRow
                                    label="Medicamentos"
                                    items={data.medicamentos.items}
                                    count={data.medicamentos.count}
                                />
                                <GroupRow
                                    label="Productos"
                                    items={data.productos.items}
                                    count={data.productos.count}
                                />
                            </div>

                            {data.byStore.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-semibold text-gray-900">Por almacén</span>
                                    <div className="grid grid-cols-2 max-h-56 gap-2 overflow-y-auto pr-1">
                                        {data.byStore.map((store) => (
                                            <StoreRow key={store.storeId} store={store} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
