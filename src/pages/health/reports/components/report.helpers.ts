import type { Donaciones, GraphicStorage, ProductByStorage } from "@/services/reports/report.interface"
import { formatDate, formatDateForInput } from "@/utils/formatters"

const STORAGE_COLORS = ["#024dae", "#1e5bb8", "#3a6bc2", "#3089FD", "#58c0e9", "#0f766e"]

/** Colores estables por almacen (evita el parpadeo de un color aleatorio). */
export const buildWarehouseData = (productByStorage: ProductByStorage[] = []): GraphicStorage[] =>
    productByStorage.map((item, index) => ({
        name: item.storage,
        value: item.totalProducts,
        fill: STORAGE_COLORS[index % STORAGE_COLORS.length],
    }))

/** Serie real de donaciones por dia del periodo (reemplaza los datos ficticios). */
export const buildDonationsByDay = (donations: Donaciones[] = []): { date: string; amount: number }[] => {
    const counts = new Map<string, number>()
    donations.forEach((donation) => {
        const key = formatDateForInput(donation.date)
        if (!key) return
        counts.set(key, (counts.get(key) ?? 0) + 1)
    })

    return [...counts.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, amount]) => ({ date: formatDate(date), amount }))
}
