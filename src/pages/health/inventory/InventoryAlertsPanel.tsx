import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/utils/formatters"
import type { ExpiringLote, LowStockItem } from "@/services/inventory/inventory.interface"
import { AlertTriangle, CalendarClock, PackageX } from "lucide-react"

interface InventoryAlertsPanelProps {
    expiring: ExpiringLote[]
    lowStock: LowStockItem[]
    loading?: boolean
}

export const InventoryAlertsPanel = ({ expiring, lowStock, loading = false }: InventoryAlertsPanelProps) => {
    const hasAlerts = expiring.length > 0 || lowStock.length > 0

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-[#ff8800]" />
                    <span>Alertas de Inventario</span>
                </CardTitle>
                <CardDescription>Lotes próximos a vencer y medicinas con stock bajo</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                    </div>
                ) : !hasAlerts ? (
                    <p className="text-sm text-gray-500 text-center py-4">Sin alertas para el periodo.</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-orange-700 mb-3">
                                <CalendarClock className="h-4 w-4" /> Próximos vencimientos
                            </h4>
                            <div className="space-y-2">
                                {expiring.length === 0 && (
                                    <p className="text-sm text-gray-500">Sin lotes por vencer.</p>
                                )}
                                {expiring.map((item) => (
                                    <div
                                        key={`${item.medicineId}-${item.lote}-${item.storeId}`}
                                        className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-lg"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 truncate">
                                                {item.medicineName} {item.presentation}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                Lote {item.lote} · {item.storeName} · Vence {formatDate(item.expirationDate)}
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="bg-orange-200 text-orange-800 shrink-0">
                                            {item.daysUntilExpiration != null ? `${item.daysUntilExpiration} días` : `${item.amount} u.`}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-3">
                                <PackageX className="h-4 w-4" /> Stock bajo
                            </h4>
                            <div className="space-y-2">
                                {lowStock.length === 0 && (
                                    <p className="text-sm text-gray-500">Sin medicinas con stock bajo.</p>
                                )}
                                {lowStock.map((item) => (
                                    <div
                                        key={`${item.medicineId}-${item.storeId}`}
                                        className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 truncate">
                                                {item.medicineName} {item.presentation}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{item.storeName}</p>
                                        </div>
                                        <Badge variant="secondary" className="bg-red-200 text-red-800 shrink-0">
                                            {item.stock} u.
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
