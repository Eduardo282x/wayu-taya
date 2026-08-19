import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { StoreBody, StoreContent } from "@/services/store/store.interface"
import { getStore, postStore, putStore, deleteStore } from "@/services/store/store.service"

export const storeKeys = {
    all: ["stores"] as const,
}

export const useStoresQuery = () => {
    return useQuery({
        queryKey: storeKeys.all,
        queryFn: getStore,
        select: (data: StoreContent) => data,
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export const useCreateStoreMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: StoreBody) => postStore(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storeKeys.all })
        },
    })
}

export const useUpdateStoreMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: StoreBody }) => putStore(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storeKeys.all })
        },
    })
}

export const useDeleteStoreMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => deleteStore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storeKeys.all })
        },
    })
}
