import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    InventoryAlertsQueryParams,
    InventoryHistoryQueryParams,
    InventoryQueryParams,
    InventorySummaryQueryParams,
    MoveMedicineFormData,
} from "@/services/inventory/inventory.interface"
import { getInventoryHistorial, getInventoryPage, getInventorySummary, moveInventoryStorage } from "@/services/inventory/inventory.service"
import { getInventoryAlerts } from "@/services/inventory/inventory.alert.service"
import { useInventoryStore } from "./inventoryStore"
import { useIsAuthenticated } from "@/store/auth.store"

export const inventoryKeys = {
    all: ["inventory"] as const,
    list: (params: InventoryQueryParams) => ["inventory", "list", params] as const,
    search: (name: string) => ["inventory", "search", name] as const,
    byMedicine: (medicineId: number) => ["inventory", "by-medicine", medicineId] as const,
    summary: (params: InventorySummaryQueryParams) => ["inventory", "summary", params] as const,
    /** Clave base del historial: invalida todas las paginas por prefijo. */
    history: ["inventory", "history"] as const,
    historyList: (params: InventoryHistoryQueryParams) => ["inventory", "history", "list", params] as const,
    alerts: (params: InventoryAlertsQueryParams) => ["inventory", "alerts", params] as const,
}

export const useInventoryQuery = () => {
    const { page, size, name, storeId } = useInventoryStore()
    const isAuthenticated = useIsAuthenticated()
    const params: InventoryQueryParams = { page: page + 1, size, name, storeId }

    return useQuery({
        queryKey: inventoryKeys.list(params),
        queryFn: () => getInventoryPage(params),
        enabled: isAuthenticated,
        placeholderData: keepPreviousData,
    })
}

export const useAllInventoryQuery = (enabled = true) => {
    const isAuthenticated = useIsAuthenticated()

    return useQuery({
        queryKey: inventoryKeys.all,
        // Lista inicial acotada: el resto se resuelve por búsqueda o por id.
        queryFn: () => getInventoryPage({ page: 1, size: 100 }),
        enabled: enabled && isAuthenticated,
        staleTime: Infinity,
        gcTime: 30 * 60 * 1000,
    })
}

export const useInventorySummaryQuery = () => {
    const { name, storeId } = useInventoryStore()
    const isAuthenticated = useIsAuthenticated()
    const params: InventorySummaryQueryParams = { name, storeId }

    return useQuery({
        queryKey: inventoryKeys.summary(params),
        queryFn: () => getInventorySummary(params),
        enabled: isAuthenticated,
    })
}

/**
 * Busca inventario por nombre de medicina directamente en la API. No usa el
 * `inventoryStore` para no afectar la tabla del modulo de Inventario.
 */
export const useInventorySearchQuery = (name: string) => {
    const isAuthenticated = useIsAuthenticated()
    const params: InventoryQueryParams = { page: 1, size: 30, name }

    return useQuery({
        queryKey: inventoryKeys.search(name),
        queryFn: () => getInventoryPage(params),
        enabled: isAuthenticated && name.trim().length >= 2,
        staleTime: 60 * 1000,
    })
}

export const useInventoryHistoryQuery = (
    params: InventoryHistoryQueryParams = { page: 1, size: 100 },
    enabled = true,
) => {
    const isAuthenticated = useIsAuthenticated()

    return useQuery({
        queryKey: inventoryKeys.historyList(params),
        queryFn: () => getInventoryHistorial(params),
        enabled: enabled && isAuthenticated,
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
        gcTime: 30 * 60 * 1000,
    })
}

export const useInventoryAlertsQuery = (
    params: InventoryAlertsQueryParams = { days: 30 },
    enabled = true,
) => {
    const isAuthenticated = useIsAuthenticated()

    return useQuery({
        queryKey: inventoryKeys.alerts(params),
        queryFn: () => getInventoryAlerts(params),
        enabled: enabled && isAuthenticated,
        staleTime: 60 * 1000,
    })
}

export const useMoveInventoryMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: MoveMedicineFormData) => moveInventoryStorage(data),
        onSuccess: (response) => {
            // El servicio devuelve el sobre: un fallo NO debe disparar refetch.
            if (response?.success) {
                queryClient.invalidateQueries({ queryKey: inventoryKeys.all })
                queryClient.invalidateQueries({ queryKey: inventoryKeys.history })
            }
        },
    })
}
