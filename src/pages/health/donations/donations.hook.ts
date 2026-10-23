import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { DonationBody, DonationSummaryQueryParams, DonationsQueryParams, PaginatedDonationsContent } from "@/services/donations/donations.interface"
import { getDonations, getDonationsSummary, getLotes, postDonation, putDonation, deleteDonation } from "@/services/donations/donations.service"
import { useDonationStore } from "./donationStore"
import { useIsAuthenticated } from "@/store/auth.store"
import { inventoryKeys } from "@/pages/health/inventory/inventory.hook"

export const donationsKeys = {
    all: ["donations"] as const,
    list: (params: DonationsQueryParams) => ["donations", "list", params] as const,
    summary: (params: DonationSummaryQueryParams) => ["donations", "summary", params] as const,
    lotes: ["donations", "lotes"] as const,
}

export const useDonationsQuery = () => {
    const { page, size, filters } = useDonationStore()
    const isAuthenticated = useIsAuthenticated()
    const params: DonationsQueryParams = { page: page + 1, size, ...filters }

    return useQuery({
        queryKey: donationsKeys.list(params),
        queryFn: () => getDonations(params),
        enabled: isAuthenticated,
        placeholderData: keepPreviousData,
        select: (data: PaginatedDonationsContent) => data,
    })
}

export const useLotesQuery = () => {
    const isAuthenticated = useIsAuthenticated()

    return useQuery({
        queryKey: donationsKeys.lotes,
        queryFn: getLotes,
        enabled: isAuthenticated,
    })
}

export const useDonationsSummaryQuery = () => {
    const { filters } = useDonationStore()
    const isAuthenticated = useIsAuthenticated()
    const params: DonationSummaryQueryParams = { ...filters }

    return useQuery({
        queryKey: donationsKeys.summary(params),
        queryFn: () => getDonationsSummary(params),
        enabled: isAuthenticated,
    })
}

export const useCreateDonationMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DonationBody) => postDonation(data, { silent: true }),
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: donationsKeys.all })
                queryClient.invalidateQueries({ queryKey: inventoryKeys.all })
            }
        },
    })
}

export const useUpdateDonationMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: DonationBody }) => putDonation(id, data, { silent: true }),
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: donationsKeys.all })
                queryClient.invalidateQueries({ queryKey: inventoryKeys.all })
            }
        },
    })
}

export const useDeleteDonationMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => deleteDonation(id),
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: donationsKeys.all })
                queryClient.invalidateQueries({ queryKey: inventoryKeys.all })
            }
        },
    })
}