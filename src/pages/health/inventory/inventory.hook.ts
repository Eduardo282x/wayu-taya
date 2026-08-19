import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { InventoryQueryParams, PaginatedInventoryContent, InventoryHistoryContent, InventoryContent } from "@/services/inventory/inventory.interface"
import { getInventory, getInventoryHistorial, getInventoryPage, moveInventoryStorage } from "@/services/inventory/inventory.service"
import { MoveMedicineFormData } from "./move-medicine-dialog"
import { useInventoryStore } from "./inventoryStore"

export const inventoryKeys = {
    all: ["inventory"] as const,
    list: (params: InventoryQueryParams) => ["inventory", "list", params] as const,
    history: ["inventory", "history"] as const,
}

export const useInventoryQuery = () => {
    const { page, size, name, storeId } = useInventoryStore()
    const params: InventoryQueryParams = { page: page + 1, size, name, storeId }

    return useQuery({
        queryKey: inventoryKeys.list(params),
        queryFn: () => getInventoryPage(params),
        placeholderData: keepPreviousData,
        select: (data: PaginatedInventoryContent) => data,
    })
}

export const useAllInventoryQuery = () => {
    return useQuery({
        queryKey: inventoryKeys.all,
        queryFn: getInventory,
        select: (data: InventoryContent) => data,
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export const useInventoryHistoryQuery = () => {
    return useQuery({
        queryKey: inventoryKeys.history,
        queryFn: getInventoryHistorial,
        select: (data: InventoryHistoryContent) => data,
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export const useMoveInventoryMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: MoveMedicineFormData) => moveInventoryStorage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.all })
            queryClient.invalidateQueries({ queryKey: inventoryKeys.history })
        },
    })
}
