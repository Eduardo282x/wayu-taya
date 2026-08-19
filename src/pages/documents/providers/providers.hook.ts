import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ProviderBody, ProvidersQueryParams, PaginatedProvidersContent, ProvidersContent } from "@/services/provider/provider.interface"
import { deleteProviders, getProviders, getProvidersPage, postProviders, putProviders } from "@/services/provider/provider.service"
import { InstitutionsBody, InstitutionsQueryParams, PaginatedInstitutionsContent, ParishContent, InstitutionContent } from "@/services/institution/institution.interface"
import { deleteInstitutions, getInstitutions, getInstitutionsPage, getParish, postInstitutions, putInstitutions } from "@/services/institution/institution.service"
import { useProvidersStore } from "./providersStore"

export const providersKeys = {
    all: ["providers"] as const,
    allList: ["providers", "all"] as const,
    list: (params: ProvidersQueryParams) => ["providers", "list", params] as const,
}

export const institutionsKeys = {
    all: ["institutions"] as const,
    allList: ["institutions", "all"] as const,
    list: (params: InstitutionsQueryParams) => ["institutions", "list", params] as const,
}

export const parishKeys = {
    all: ["parish"] as const,
}

export const useProvidersQuery = () => {
    const { providersPage, providersSize } = useProvidersStore()
    const params: ProvidersQueryParams = { page: providersPage + 1, size: providersSize }

    return useQuery({
        queryKey: providersKeys.list(params),
        queryFn: () => getProvidersPage(params),
        placeholderData: keepPreviousData,
        select: (data: PaginatedProvidersContent) => data,
    })
}

export const useInstitutionsQuery = () => {
    const { institutionsPage, institutionsSize } = useProvidersStore()
    const params: InstitutionsQueryParams = { page: institutionsPage + 1, size: institutionsSize }

    return useQuery({
        queryKey: institutionsKeys.list(params),
        queryFn: () => getInstitutionsPage(params),
        placeholderData: keepPreviousData,
        select: (data: PaginatedInstitutionsContent) => data,
    })
}

export const useParishQuery = () => {
    return useQuery({
        queryKey: parishKeys.all,
        queryFn: getParish,
        select: (data: ParishContent) => data,
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export const useAllProvidersQuery = () => {
    return useQuery({
        queryKey: providersKeys.allList,
        queryFn: getProviders,
        select: (data: ProvidersContent) => data,
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export const useAllInstitutionsQuery = () => {
    return useQuery({
        queryKey: institutionsKeys.allList,
        queryFn: getInstitutions,
        select: (data: InstitutionContent) => data,
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export const useCreateProviderMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: ProviderBody) => postProviders(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: providersKeys.all })
        },
    })
}

export const useUpdateProviderMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ProviderBody }) => putProviders(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: providersKeys.all })
        },
    })
}

export const useDeleteProviderMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => deleteProviders(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: providersKeys.all })
        },
    })
}

export const useCreateInstitutionMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: InstitutionsBody) => postInstitutions(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: institutionsKeys.all })
        },
    })
}

export const useUpdateInstitutionMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: InstitutionsBody }) => putInstitutions(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: institutionsKeys.all })
        },
    })
}

export const useDeleteInstitutionMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => deleteInstitutions(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: institutionsKeys.all })
        },
    })
}
