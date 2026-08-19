import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { DonationBody, DonationsQueryParams, PaginatedDonationsContent } from "@/services/donations/donations.interface"
import { getDonations, getLotes, postDonation, putDonation } from "@/services/donations/donations.service"
import { useDonationStore } from "./donationStore"

export const donationsKeys = {
    all: ["donations"] as const,
    list: (params: DonationsQueryParams) => ["donations", "list", params] as const,
    lotes: ["donations", "lotes"] as const,
}

export const useDonationsQuery = () => {
    const { page, size, filters } = useDonationStore()
    const params: DonationsQueryParams = { page: page + 1, size, ...filters }

    return useQuery({
        queryKey: donationsKeys.list(params),
        queryFn: () => getDonations(params),
        placeholderData: keepPreviousData,
        select: (data: PaginatedDonationsContent) => data,
    })
}

export const useLotesQuery = () => {
    return useQuery({
        queryKey: donationsKeys.lotes,
        queryFn: getLotes,
    })
}

export const useCreateDonationMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DonationBody) => postDonation(data),
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: donationsKeys.all })
                queryClient.invalidateQueries({ queryKey: ["inventory"] })
            }
        },
    })
}

export const useUpdateDonationMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: DonationBody }) => putDonation(id, data),
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: donationsKeys.all })
                queryClient.invalidateQueries({ queryKey: ["inventory"] })
            }
        },
    })
}