import { useEffect, useMemo, useState } from "react"
import { HeaderPages } from "@/layout/header/Header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaHeartbeat } from "react-icons/fa"
import { useSummaryReportQuery } from "./reports/report.hook"
import { buildDonationsByDay, buildWarehouseData } from "./reports/components/report.helpers"
import { ReportsSkeleton } from "./reports/components/ReportsSkeleton"
import { ReportMetricCards } from "./reports/components/ReportMetricCards"
import { StoragePieChart } from "./reports/components/StoragePieChart"
import { DonationsTrendChart } from "./reports/components/DonationsTrendChart"
import { MostDonatedList } from "./reports/components/MostDonatedList"
import { InventoryAlertsPanel } from "./inventory/InventoryAlertsPanel"
import { useInventoryAlertsQuery } from "./inventory/inventory.hook"
import type { BodyReport } from "@/services/reports/report.interface"
import toast from "react-hot-toast"

const buildMonths = () => {
    const months: { value: string; label: string }[] = []
    const now = new Date()
    const startYear = 2025

    for (let year = startYear; year <= now.getFullYear(); year++) {
        const lastMonth = year === now.getFullYear() ? now.getMonth() : 11
        for (let month = 0; month <= lastMonth; month++) {
            months.push({
                value: `${year}-${month + 1}`,
                label: `${new Date(year, month).toLocaleString('es-ES', { month: 'long' })} ${year}`,
            })
        }
    }
    return months
}

const rangeForMonth = (value: string): BodyReport => {
    const [year, month] = value.split('-').map(Number)
    return {
        from: new Date(year, month - 1, 1),
        to: new Date(year, month, 0),
    }
}

export const Health = () => {
    const monthsList = useMemo(() => buildMonths(), [])
    const [month, setMonth] = useState(() => monthsList[monthsList.length - 1]?.value ?? '')
    const [range, setRange] = useState<BodyReport>(() =>
        rangeForMonth(monthsList[monthsList.length - 1]?.value ?? ''),
    )

    const { data: report, isPending, isError } = useSummaryReportQuery(range)
    const { data: alerts, isPending: alertsPending } = useInventoryAlertsQuery({ days: 30 })

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

    const handleMonthChange = (value: string) => {
        setMonth(value)
        setRange(rangeForMonth(value))
    }

    return (
        <div className="px-2 lg:p-0 h-full flex flex-col min-h-0">
            <div className="flex items-center justify-between gap-4">
                <HeaderPages title="Salud" Icon={FaHeartbeat} />
                <Select value={month} onValueChange={handleMonthChange}>
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="Periodo" />
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

            {isPending ? <ReportsSkeleton /> : (
                <div className="max-w-7xl mx-auto w-full p-4 space-y-8 overflow-y-auto">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Resumen del Periodo</h2>
                        <ReportMetricCards
                            donationsCount={report?.donations.length ?? 0}
                            totalInventory={report?.totalInventory ?? 0}
                        />
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DonationsTrendChart data={donationsByDay} />
                        <StoragePieChart data={warehouseData} productByStorage={report?.productByStorage} />
                    </section>

                    <section>
                        <InventoryAlertsPanel
                            expiring={alerts?.expiringLotes ?? []}
                            lowStock={alerts?.lowStock ?? []}
                            loading={alertsPending}
                        />
                    </section>

                    <section>
                        <MostDonatedList items={report?.productMostDonated ?? []} />
                    </section>
                </div>
            )}
        </div>
    )
}
