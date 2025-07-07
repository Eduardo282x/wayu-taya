import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { Download, Eye, TrendingUp, Package, Heart, Warehouse, Users } from "lucide-react"
import { LuChartNoAxesCombined } from "react-icons/lu"
import { BiDonateHeart } from "react-icons/bi"

// Datos de ejemplo
const reportTypes = [
    {
        id: "donations",
        title: "Reporte de Donaciones",
        description: "Resumen completo de todas las donaciones recibidas",
        icon: Heart,
        color: "bg-blue-500",
    },
    {
        id: "inventory",
        title: "Reporte de Inventario",
        description: "Estado actual del inventario y productos disponibles",
        icon: Package,
        color: "bg-green-500",
    },
    {
        id: "impact",
        title: "Reporte de Impacto",
        description: "Análisis del impacto social y beneficiarios alcanzados",
        icon: Users,
        color: "bg-purple-500",
    },
    {
        id: "warehouses",
        title: "Reporte de Almacenes",
        description: "Utilización y capacidad de almacenes",
        icon: Warehouse,
        color: "bg-orange-500",
    },
]

const monthlyDonations = [
    { month: "Ene", amount: 12500 },
    { month: "Feb", amount: 15800 },
    { month: "Mar", amount: 18200 },
    { month: "Abr", amount: 14600 },
    { month: "May", amount: 22100 },
    { month: "Jun", amount: 19800 },
]

const warehouseData = [
    { name: "Almacén Central", value: 45, fill: "#024dae" },
    { name: "Almacén Norte", value: 25, fill: "#1e5bb8" },
    { name: "Almacén Sur", value: 20, fill: "#3a6bc2" },
    { name: "Almacén Este", value: 10, fill: "#5cdee5" },
]

const topImpactItems = [
    { item: "Alimentos básicos", impact: 85, donations: 245 },
    { item: "Medicamentos", impact: 78, donations: 156 },
    { item: "Ropa de abrigo", impact: 72, donations: 189 },
    { item: "Material escolar", impact: 65, donations: 134 },
]

export const Reports = () => {
    // const [selectedReport, setSelectedReport] = useState("")
    const [timeRange, setTimeRange] = useState("month")

    const handleViewReport = (reportId: string) => {
        // setSelectedReport(reportId)
        // Aquí iría la lógica para mostrar el reporte
        console.log(`Visualizando reporte: ${reportId}`)
    }

    const handleDownloadReport = (reportId: string) => {
        // Aquí iría la lógica para descargar el reporte
        console.log(`Descargando reporte: ${reportId}`)
    }

    return (
        <div className="h-full overflow-x-hidden">
            {/* Header */}
            <div className="mb-2 bg-linear-to-r from-[#024dae] to-[#5cdee5] rounded-xl w-full flex items-center justify-start px-4 py-2 text-2xl gap-4 text-white manrope">
                <LuChartNoAxesCombined size={60} />
                <div className="">
                    <h1 className="text-2xl font-bold">Centro de Reportes</h1>
                    <p className="text-blue-100 text-sm">Fundación Wayu Tayaa - Gestión y Análisis de Datos</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Selección de Reportes */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Generar Reportes</h2>
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Período de tiempo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="week">Esta semana</SelectItem>
                                <SelectItem value="month">Este mes</SelectItem>
                                <SelectItem value="quarter">Este trimestre</SelectItem>
                                <SelectItem value="year">Este año</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {reportTypes.map((report) => {
                            const IconComponent = report.icon
                            return (
                                <Card key={report.id} className="hover:shadow-lg transition-shadow duration-200">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg ${report.color}`}>
                                                <IconComponent className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{report.title}</CardTitle>
                                            </div>
                                        </div>
                                        <CardDescription className="text-sm">{report.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-gradient-to-r from-[#024dae] to-[#5cdee5] hover:from-[#023a8a] hover:to-[#4bc5cc]"
                                                onClick={() => handleViewReport(report.id)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                Ver
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 bg-transparent"
                                                onClick={() => handleDownloadReport(report.id)}
                                            >
                                                <Download className="h-4 w-4 mr-1" />
                                                Descargar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </section>

                {/* Dashboard de Métricas */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard de Métricas</h2>

                    {/* Métricas Principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Donaciones Este Mes</CardTitle>
                                <BiDonateHeart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#024dae]">$19,800</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">+12.5%</span> vs mes anterior
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Items en Inventario</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#024dae]">1,247</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-blue-600">+8.2%</span> nuevos ingresos
                                </p>
                            </CardContent>
                        </Card>

                        {/* <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Beneficiarios Activos</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#024dae]">342</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">+15.3%</span> este mes
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tasa de Impacto</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#024dae]">94.2%</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">+2.1%</span> efectividad
                                </p>
                            </CardContent>
                        </Card> */}
                    </div>

                    {/* Gráficas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Gráfica de Donaciones Mensuales */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <TrendingUp className="h-5 w-5 text-[#024dae]" />
                                    <span>Donaciones por Mes</span>
                                </CardTitle>
                                <CardDescription>Evolución de donaciones en los últimos 6 meses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        amount: {
                                            label: "Monto",
                                            color: "#024dae",
                                        },
                                    }}
                                    className="h-[300px]"
                                >
                                    <LineChart data={monthlyDonations}>
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#024dae"
                                            strokeWidth={3}
                                            dot={{ fill: "#5cdee5", strokeWidth: 2, r: 4 }}
                                        />
                                    </LineChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Gráfica de Utilización de Almacenes */}
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
                                            data={warehouseData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {warehouseData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ChartContainer>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {warehouseData.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                                            <span className="text-sm text-gray-600">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Items de Mayor Impacto */}
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
                                {topImpactItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800">{item.item}</h4>
                                            <p className="text-sm text-gray-600">{item.donations} donaciones</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-[#024dae]">{item.impact}%</div>
                                                <div className="text-xs text-gray-500">Impacto</div>
                                            </div>
                                            <Badge variant="secondary" className="bg-gradient-to-r from-[#024dae] to-[#5cdee5] text-white">
                                                #{index + 1}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}
