import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MedicineBody, MedicineQueryParams } from "@/services/medicine/medicine.interface"
import { getCategories, getForms, getMedicine, getMedicinesPage, postMedicine, putMedicine, deleteMedicine } from "@/services/medicine/medicine.service"
import { useMedicineStore } from "./medicineStore"

export const medicineKeys = {
    all: ["medicines"] as const,
    allList: ["medicines", "all"] as const,
    list: (params: MedicineQueryParams) => ["medicines", "list", params] as const,
    categories: ["medicines", "categories"] as const,
    forms: ["medicines", "forms"] as const,
}

export const useMedicinesQuery = () => {
    const { page, size, name } = useMedicineStore()
    const params: MedicineQueryParams = { page: page + 1, size, name }

    return useQuery({
        queryKey: medicineKeys.list(params),
        queryFn: () => getMedicinesPage(params),
        placeholderData: keepPreviousData,
    })
}

export const useAllMedicinesQuery = (enabled = true) => {
    return useQuery({
        queryKey: medicineKeys.allList,
        queryFn: getMedicine,
        enabled,
        staleTime: Infinity,
        gcTime: 30 * 60 * 1000,
    })
}

export const useCategoriesQuery = () => {
    return useQuery({
        queryKey: medicineKeys.categories,
        queryFn: getCategories,
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export const useFormsQuery = () => {
    return useQuery({
        queryKey: medicineKeys.forms,
        queryFn: getForms,
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
