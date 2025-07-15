import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { Download, TrendingUp, Package, Heart, Warehouse } from "lucide-react"
import { LuChartNoAxesCombined } from "react-icons/lu"
import { BiDonateHeart } from "react-icons/bi"
import { generateReportDonations, generateReportInventory, generateReportStore, getReport } from "@/services/reports/report.service"
import { BodyReport, GraphicStorage, IReports, ProductByStorage, ReportDonations } from "@/services/reports/report.interface"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { ReportDialogs, WareHouseDialog } from "./ReportDialogs"
import { IStore } from "@/services/store/store.interface"
import { getStore } from "@/services/store/store.service"

// Datos de ejemplo
const reportTypes = [
    {
        id: "donations",
        title: "Reporte de Donaciones",
        description: "Resumen completo de todas las donaciones recibidas",
        icon: Heart,
        color: "bg-blue-500",
        done: true
    },
    {
        id: "inventory",
        title: "Reporte de Inventario",
        description: "Estado actual del inventario y productos disponibles",
        icon: Package,
        color: "bg-green-500",
        done: true
    },
    {
        id: "warehouses",
        title: "Reporte de Almacenes",
        description: "Utilización y capacidad de almacenes",
        icon: Warehouse,
        color: "bg-orange-500",
        done: true
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

export const Reports = () => {
    const now = new Date();
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [openWarehouse, setOpenWareHouse] = useState<boolean>(false);
    const [stores, setStores] = useState<IStore[]>([])
    const [report, setReport] = useState<IReports>();
    const [warehouseData, setWarehouseData] = useState<GraphicStorage[]>([])
    const [filtersDate, setFiltersDate] = useState<BodyReport>({
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    });

    function getMonthsFrom2025() {
        const months = [];
        const now = new Date();
        const startYear = 2025;
        const startMonth = 0; // Enero
        const endYear = now.getFullYear();
        const endMonth = now.getMonth(); // 0-indexed

        for (let year = startYear; year <= endYear; year++) {
            const firstMonth = year === startYear ? startMonth : 0;
            const lastMonth = year === endYear ? endMonth : 11;
            for (let month = firstMonth; month <= lastMonth; month++) {
                months.push({
                    value: `${year}-${month + 1}`,
                    label: `${new Date(year, month).toLocaleString('es-ES', { month: 'long' })} ${year}`,
                    year,
                    month
                });
            }
        }
        return months;
    }

    const [month, setMonth] = useState(() => {
        const months = getMonthsFrom2025();
        return months[months.length - 1]?.value; // mes actual por defecto
    });
    const monthsList = getMonthsFrom2025();

    useEffect(() => {
        getReportApi()
    }, [filtersDate])

    useEffect(() => {
        getStoreApi()
    }, [])

    const getReportApi = async () => {
        setLoading(true)
        const response = await getReport(filtersDate) as IReports;
        console.log(response)
        if (response) {
            setReport(response);

            const warehouseData = response.productByStorage.map((item: ProductByStorage) => {
                return {
                    name: item.storage,
                    value: item.totalProducts,
                    fill: getRandomColorCode(), // O puedes asignar colores específicos si quieres consistencia
                }
            });

            setWarehouseData(warehouseData)
        }
        setLoading(false)
    }

    function getRandomColorCode(): string {
        const colorCodes = ["#024dae", "#1e5bb8", "#3a6bc2", "#5cdee5"];
        const randomIndex = Math.floor(Math.random() * colorCodes.length);
        return colorCodes[randomIndex];
    }

    const getStoreApi = async () => {
        setLoading(true);
        try {
            const response: IStore[] = await getStore();
            setStores(response);
        } catch (err) {
            console.error("Error al obtener almacenes:", err);
        }
        setLoading(false);
    };

    const handleDownloadReport = (report: string) => {
        // Aquí iría la lógica para descargar el reporte
        // generateReportApi();
        if (report == 'donations') {
            setOpen(true)
        }
        if (report == 'inventory') {
            generateReportInventoryApi()
        }
        if (report == 'warehouses') {
            setOpenWareHouse(true)
        }
    }

    const generateReportApi = async (data: ReportDonations) => {
        const response = await generateReportDonations(data);
        const url = URL.createObjectURL(response)
        const link = window.document.createElement("a")
        link.href = url
        link.download = `Reporte de donaciones`
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)
        URL.revokeObjectURL(url);
        setOpen(false);
    }
    const generateReportInventoryApi = async () => {
        const response = await generateReportInventory();
        const url = URL.createObjectURL(response)
        const link = window.document.createElement("a")
        link.href = url
        link.download = `Reporte de inventario`
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)
        URL.revokeObjectURL(url);
        setOpen(false);
    }
    const generateReportStoreApi = async (storeId: number) => {
        const response = await generateReportStore(storeId);
        const url = URL.createObjectURL(response)
        const link = window.document.createElement("a")
        link.href = url
        link.download = `Reporte de almacenes`
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)
        URL.revokeObjectURL(url);
        setOpenWareHouse(false);
    }

    return (
        <div className="h-full overflow-x-hidden">
            {loading && <ScreenLoader />}
            {/* Header */}
            <div className="mb-2 bg-linear-to-r from-[#024dae] to-[#5cdee5] rounded-xl w-full flex items-center justify-start px-4 py-2 gap-4 text-white manrope">
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

                        <Select value={month} onValueChange={(val) => {
                            setMonth(val);
                            const [year, m] = val.split('-').map(Number);
                            setFiltersDate({
                                from: new Date(year, m - 1, 1),
                                to: new Date(year, m, 0),
                            });
                            getReportApi(); // Si quieres recargar los datos al cambiar el mes
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Fecha" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthsList.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                        {m.label.charAt(0).toUpperCase() + m.label.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reportTypes.map((report) => {
                            const IconComponent = report.icon
                            return (
                                <Card key={report.id} className="hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
                                    {/* {!report.done && (
                                        <div className="absolute top-0 left-0 bg-black opacity-40 flex items-center justify-center w-full h-full">
                                            <p className="text-white">Próximamente...</p>
                                        </div>
                                    )} */}
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
                                    <CardContent className="pt-0 h-full flex items-end w-full">
                                        <div className="flex items-end w-full">
                                            <Button
                                                size="sm"
                                                variant="animated"
                                                className="flex-1 bg-transparent"
                                                onClick={() => handleDownloadReport(report.id)}
                                            >
                                                <Download className="h-4 w-4 mr-1" />
                                                Generar
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium">Donaciones Este Mes</CardTitle>
                                <BiDonateHeart className="text-blue-800 h-4 w-4" />
                            </CardHeader>
                            <CardContent className="-mt-3">
                                <div className="text-2xl font-bold text-[#024dae]">{report?.donations.length}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium">Items en Inventario</CardTitle>
                                <Package className="text-blue-800 h-4 w-4" />
                            </CardHeader>
                            <CardContent className="-mt-3">
                                <div className="text-2xl font-bold text-[#024dae]">{report?.totalInventory}</div>
                            </CardContent>
                        </Card>
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
                                {report && report.productMostDonated.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800">{item.product}</h4>
                                            <p className="text-sm text-gray-600">{item.amount} donaciones</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-[#024dae]">{item.percentage}%</div>
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


            <ReportDialogs
                open={open}
                setOpen={setOpen}
                lotes={report ? report.lotes : []}
                provider={report ? report.providers : []}
                onSubmitData={generateReportApi}
            />

            <WareHouseDialog
                open={openWarehouse}
                setOpen={setOpenWareHouse}
                stores={stores}
                onSubmitData={generateReportStoreApi}
            />
        </div>
    )
}
