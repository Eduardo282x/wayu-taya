import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"

interface DonationsTrendChartProps {
    data: { date: string; amount: number }[]
}

/** Tendencia real de donaciones del periodo (antes eran datos ficticios). */
export const DonationsTrendChart = ({ data }: DonationsTrendChartProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-[#024dae]" />
                    <span>Donaciones del Periodo</span>
                </CardTitle>
                <CardDescription>Registros por día en el rango seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        amount: {
                            label: "Donaciones",
                            color: "#024dae",
                        },
                    }}
                    className="h-[300px]"
                >
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#024dae"
                            strokeWidth={3}
                            dot={{ fill: "#3089FD", strokeWidth: 2, r: 4 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
