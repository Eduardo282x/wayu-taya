import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Heart, Package, Warehouse } from "lucide-react"
import { LuChartNoAxesCombined } from "react-icons/lu"
import { generateReportDonations, generateReportInventory, generateReportStore } from "@/services/reports/report.service"
import { BodyReport, ReportDonations } from "@/services/reports/report.interface"
import { ReportDialogs, WareHouseDialog } from "./ReportDialogs"
import { useStoresQuery } from "@/pages/health/store/store.hook"
import { useSummaryReportQuery } from "./report.hook"
import { buildDonationsByDay, buildWarehouseData } from "./components/report.helpers"
import { ReportsSkeleton } from "./components/ReportsSkeleton"
import { ReportMetricCards } from "./components/ReportMetricCards"
import { StoragePieChart } from "./components/StoragePieChart"
import { DonationsTrendChart } from "./components/DonationsTrendChart"
import { MostDonatedList } from "./components/MostDonatedList"
import toast from "react-hot-toast"

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
        id: "warehouses",
        title: "Reporte de Almacenes",
        description: "Utilización y capacidad de almacenes",
        icon: Warehouse,
        color: "bg-orange-500",
    },
]

export const Reports = () => {
    const now = new Date();
    const [open, setOpen] = useState<boolean>(false);
    const [openWarehouse, setOpenWareHouse] = useState<boolean>(false);
    const { data: storesData } = useStoresQuery();
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

    // Un solo camino de fetch: el cambio de `filtersDate` reacciona via queryKey.
    const { data: report, isPending, isError } = useSummaryReportQuery(filtersDate)

    useEffect(() => {
        if (isError) {
            toast.error('No se pudieron cargar las métricas.')
        }
    }, [isError])

    const warehouseData = useMemo(
        () => buildWarehouseData(report?.productByStorage),
        [report],
    )

    const donationsByDay = useMemo(
        () => buildDonationsByDay(report?.donations),
        [report],
    )

    const handleDownloadReport = (reportId: string) => {
        if (reportId === 'donations') {
            setOpen(true)
        }
        if (reportId === 'inventory') {
            generateReportInventoryApi()
        }
        if (reportId === 'warehouses') {
            setOpenWareHouse(true)
        }
    }

    const downloadBlob = (response: Blob, filename: string) => {
        const url = URL.createObjectURL(response)
        const link = window.document.createElement("a")
        link.href = url
        link.download = filename
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)
        URL.revokeObjectURL(url);
    }

    const generateReportApi = async (data: ReportDonations) => {
        try {
            const response = await generateReportDonations(data, filtersDate);
            downloadBlob(response, `Reporte de donaciones`)
            setOpen(false);
        } catch {
            toast.error('No se pudo generar el reporte de donaciones.')
        }
    }

    const generateReportInventoryApi = async () => {
        try {
            const response = await generateReportInventory(filtersDate);
            downloadBlob(response, `Reporte de inventario`)
        } catch {
            toast.error('No se pudo generar el reporte de inventario.')
        }
    }

    const generateReportStoreApi = async (storeId: number) => {
        try {
            const response = await generateReportStore(storeId, filtersDate);
            downloadBlob(response, `Reporte de almacenes`)
            setOpenWareHouse(false);
        } catch {
            toast.error('No se pudo generar el reporte de almacenes.')
        }
    }

    return (
        <div className="h-full overflow-x-hidden">
            {/* Header */}
            <div className="mb-2 w-[98%] mx-auto bg-linear-to-r from-[#024dae] to-[#3089FD] rounded-xl flex items-center justify-start px-4 py-2 gap-4 text-white manrope">
                <LuChartNoAxesCombined size={60} />
                <div className="">
                    <h1 className="text-2xl font-bold">Centro de Reportes</h1>
                    <p className="text-blue-100 text-sm">Fundación Wayu Tayaa - Gestión y Análisis de Datos</p>
                </div>
            </div>

            {isPending ? <ReportsSkeleton /> : (
                <div className="max-w-7xl mx-auto p-4 space-y-8">
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
                            {reportTypes.map((reportType) => {
                                const IconComponent = reportType.icon
                                return (
                                    <Card key={reportType.id} className="hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-lg ${reportType.color}`}>
                                                    <IconComponent className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{reportType.title}</CardTitle>
                                                </div>
                                            </div>
                                            <CardDescription className="text-sm">{reportType.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0 h-full flex items-end w-full">
                                            <div className="flex items-end w-full">
                                                <Button
                                                    size="sm"
                                                    variant="animated"
                                                    className="flex-1 bg-transparent"
                                                    onClick={() => handleDownloadReport(reportType.id)}
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

                        <div className="mb-6">
                            <ReportMetricCards
                                donationsCount={report?.donations.length ?? 0}
                                totalInventory={report?.totalInventory ?? 0}
                            />
                        </div>

                        {/* Gráficas */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <DonationsTrendChart data={donationsByDay} />
                            <StoragePieChart data={warehouseData} productByStorage={report?.productByStorage} />
                        </div>

                        <MostDonatedList items={report?.productMostDonated ?? []} />
                    </section>
                </div>
            )}


            <ReportDialogs
                open={open}
                setOpen={setOpen}
                lotes={report ? report.lotes : { lotes: [] }}
                provider={report ? report.providers : []}
                onSubmitData={generateReportApi}
            />

            <WareHouseDialog
                open={openWarehouse}
                setOpen={setOpenWareHouse}
                stores={storesData?.stores ?? []}
                onSubmitData={generateReportStoreApi}
            />
        </div>
    )
}
