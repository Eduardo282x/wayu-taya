import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatNumberWithDots, formatOnlyNumberWithDots } from "@/hooks/formaters"
import { DonationSummary, DonationSummaryGroup } from "@/services/donations/donations.interface"
import { formatDate } from "@/utils/formatters"
import { ChartColumn, Loader2 } from "lucide-react"

interface IDonationSummaryPopoverProps {
    data?: DonationSummary | null
    isLoading?: boolean
}

const SummaryRow = ({ label, group, accent }: { label: string; group: DonationSummaryGroup; accent: string }) => (
    <div className="rounded-lg border border-gray-200 p-2">
        <span className={`text-xs font-semibold ${accent}`}>{label}</span>
        <div className="mt-1 grid grid-cols-3 gap-1 text-center">
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">{formatNumberWithDots(group.donations)}</span>
                <span className="text-[10px] text-gray-500">Donaciones</span>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">{formatNumberWithDots(group.items)}</span>
                <span className="text-[10px] text-gray-500">Ítems</span>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">{formatNumberWithDots(group.benefited)}</span>
                <span className="text-[10px] text-gray-500">Beneficiados</span>
            </div>
        </div>
    </div>
)

export const DonationSummaryPopover = ({ data, isLoading }: IDonationSummaryPopoverProps) => {
    const hasData = data != null

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-1/2 lg:w-auto h-9">
                    <ChartColumn className="w-4 h-4" />
                    Resumen
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <ChartColumn className="w-4 h-4 text-[#3449D5]" />
                        <h3 className="font-semibold text-gray-800">Resumen de donaciones</h3>
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
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="rounded-lg bg-blue-50 p-2">
                                    <span className="block text-base font-bold text-blue-800">{formatNumberWithDots(data.totalDonations)}</span>
                                    <span className="text-[10px] text-gray-500">Donaciones</span>
                                </div>
                                <div className="rounded-lg bg-blue-50 p-2">
                                    <span className="block text-base font-bold text-blue-800">{formatNumberWithDots(data.totalItems)}</span>
                                    <span className="text-[10px] text-gray-500">Ítems totales</span>
                                </div>
                                <div className="rounded-lg bg-blue-50 p-2">
                                    <span className="block text-base font-bold text-blue-800">{formatNumberWithDots(data.totalBenefited)}</span>
                                    <span className="text-[10px] text-gray-500">Beneficiados</span>
                                </div>
                            </div>

                            <SummaryRow label="Entrada" group={data.entrada} accent="text-green-700" />
                            <SummaryRow label="Salida" group={data.salida} accent="text-red-700" />

                            <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>Promedio de ítems por donación</span>
                                <span className="font-semibold text-gray-800">{formatOnlyNumberWithDots(data.averageItemsPerDonation, 2)}</span>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs text-gray-600">
                                <span>Rango de fechas</span>
                                <span className="font-medium text-gray-800">
                                    {data.dateRange
                                        ? `${formatDate(data.dateRange.from)} - ${formatDate(data.dateRange.to)}`
                                        : 'Sin rango'}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
