import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { StoreBody } from "@/services/store/store.interface"
import { getStore, postStore, putStore, deleteStore } from "@/services/store/store.service"
import { useIsAuthenticated } from "@/store/auth.store"

export const storeKeys = {
    all: ["stores"] as const,
}

export const useStoresQuery = (enabled = true) => {
    // Sin sesion no hay cabecera Authorization: la peticion solo puede
    // producir un 401 y, con el, un refresh inútil.
    const isAuthenticated = useIsAuthenticated()

    return useQuery({
        queryKey: storeKeys.all,
        queryFn: getStore,
        enabled: enabled && isAuthenticated,
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export const useCreateStoreMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: StoreBody) => postStore(data),
        onSuccess: (response) => {
            // El servicio NO lanza en error: devuelve el sobre con
            // `success: false`. Invalidar la cache cuando la escritura fallo
            // dispara un refetch que no arregla nada.
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: storeKeys.all })
            }
        },
    })
}

export const useUpdateStoreMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: StoreBody }) => putStore(id, data),
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: storeKeys.all })
            }
        },
    })
}

export const useDeleteStoreMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => deleteStore(id),
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: storeKeys.all })
            }
        },
    })
}
