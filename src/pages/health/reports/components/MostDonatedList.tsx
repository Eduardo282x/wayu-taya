import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"
import type { ProductsMostDonated } from "@/services/reports/report.interface"

interface MostDonatedListProps {
    items: ProductsMostDonated[]
}

export const MostDonatedList = ({ items }: MostDonatedListProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-[#024dae]" />
                    <span>Items con Mayor Impacto</span>
                </CardTitle>
                <CardDescription>Productos que generan mayor beneficio social</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={item.product} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{item.product}</h4>
                                <p className="text-sm text-gray-600">{item.amount} donaciones</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <div className="text-lg font-bold text-[#024dae]">{item.percentage}%</div>
                                    <div className="text-xs text-gray-500">Impacto</div>
                                </div>
                                <Badge variant="secondary" className="bg-linear-to-r from-[#024dae] to-[#3089FD] text-white">
                                    #{index + 1}
                                </Badge>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">Sin datos para el periodo.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
