import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MedicineBody, MedicineQueryParams } from "@/services/medicine/medicine.interface"
import { getCategories, getForms, getMedicine, getMedicinesPage, postMedicine, putMedicine, deleteMedicine } from "@/services/medicine/medicine.service"
import { useMedicineStore } from "./medicineStore"
import { useIsAuthenticated } from "@/store/auth.store"

export const medicineKeys = {
    all: ["medicines"] as const,
    allList: ["medicines", "all"] as const,
    list: (params: MedicineQueryParams) => ["medicines", "list", params] as const,
    search: (name: string) => ["medicines", "search", name] as const,
    categories: ["medicines", "categories"] as const,
    forms: ["medicines", "forms"] as const,
}

export const useMedicinesQuery = () => {
    const { page, size, name } = useMedicineStore()
    const isAuthenticated = useIsAuthenticated()
    const params: MedicineQueryParams = { page: page + 1, size, name }

    return useQuery({
        queryKey: medicineKeys.list(params),
        queryFn: () => getMedicinesPage(params),
        enabled: isAuthenticated,
        placeholderData: keepPreviousData,
    })
}

export const useAllMedicinesQuery = (enabled = true) => {
    const isAuthenticated = useIsAuthenticated()

    return useQuery({
        queryKey: medicineKeys.allList,
        queryFn: getMedicine,
        enabled: enabled && isAuthenticated,
        staleTime: Infinity,
        gcTime: 30 * 60 * 1000,
    })
}

/**
 * Busca medicinas por nombre directamente en la API. Independiente del
 * `medicineStore` para no interferir con la tabla del modulo de Medicamentos.
 */
export const useMedicineSearchQuery = (name: string) => {
    const isAuthenticated = useIsAuthenticated()
    const params: MedicineQueryParams = { page: 1, size: 30, name }

    return useQuery({
        queryKey: medicineKeys.search(name),
        queryFn: () => getMedicinesPage(params),
        enabled: isAuthenticated && name.trim().length > 0,
        staleTime: 60 * 1000,
    })
}

export const useCategoriesQuery = () => {
    const isAuthenticated = useIsAuthenticated()

    return useQuery({
        queryKey: medicineKeys.categories,
        queryFn: getCategories,
        enabled: isAuthenticated,
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export const useFormsQuery = () => {
    const isAuthenticated = useIsAuthenticated()

    return useQuery({
        queryKey: medicineKeys.forms,
        queryFn: getForms,
        enabled: isAuthenticated,
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export const useCreateMedicineMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: MedicineBody) => postMedicine(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: medicineKeys.all })
        },
    })
}

export const useUpdateMedicineMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: MedicineBody }) => putMedicine(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: medicineKeys.all })
        },
    })
}

export const useDeleteMedicineMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => deleteMedicine(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: medicineKeys.all })
        },
    })
}
