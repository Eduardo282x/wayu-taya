import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"
import { BiDonateHeart } from "react-icons/bi"

interface ReportMetricCardsProps {
    donationsCount: number
    totalInventory: number
    periodLabel?: string
}

/** Tarjetas KPI reales del resumen. Reutilizadas por Reportes y el dashboard. */
export const ReportMetricCards = ({ donationsCount, totalInventory, periodLabel }: ReportMetricCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">
                        Donaciones {periodLabel ? `(${periodLabel})` : "del periodo"}
                    </CardTitle>
                    <BiDonateHeart className="text-blue-800 h-4 w-4" />
                </CardHeader>
                <CardContent className="-mt-3">
                    <div className="text-2xl font-bold text-[#024dae]">{donationsCount}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">Items en Inventario</CardTitle>
                    <Package className="text-blue-800 h-4 w-4" />
                </CardHeader>
                <CardContent className="-mt-3">
                    <div className="text-2xl font-bold text-[#024dae]">{totalInventory}</div>
                </CardContent>
            </Card>
        </div>
    )
}
