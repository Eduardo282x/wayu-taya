import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart } from "recharts"
import { Warehouse } from "lucide-react"
import type { GraphicStorage, ProductByStorage } from "@/services/reports/report.interface"

interface StoragePieChartProps {
    data: GraphicStorage[]
    productByStorage?: ProductByStorage[]
}

export const StoragePieChart = ({ data, productByStorage = [] }: StoragePieChartProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Warehouse className="h-5 w-5 text-[#024dae]" />
                    <span>Utilización de Almacenes</span>
                </CardTitle>
                <CardDescription>Distribución de productos por almacén</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        value: {
                            label: "Cantidad en almacén",
                        },
                    }}
                    className="h-[300px]"
                >
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry) => (
                                <Cell key={entry.name} fill={entry.fill} />
                            ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                </ChartContainer>
                <div className="flex flex-wrap gap-2 mt-4">
                    {data.map((item) => {
                        const capacityInfo = productByStorage.find((p) => p.storage === item.name)
                        return (
                            <div key={item.name} className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                                <span className="text-sm text-gray-600">
                                    {item.name}
                                    {capacityInfo ? ` (${capacityInfo.usedCapacity}/${capacityInfo.capacity})` : ''}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
