import { create } from "zustand"
import { IDonationsFilters } from "./donations.data"

interface DonationState {
    page: number
    size: number
    filters: IDonationsFilters
    setPage: (page: number) => void
    setSize: (size: number) => void
    setFilter: (filter: keyof IDonationsFilters, value: IDonationsFilters[keyof IDonationsFilters]) => void
    cleanFilters: () => void
}

const defaultFilters: IDonationsFilters = {
    type: 'Entrada',
    lote: '',
    providerId: null,
    institutionId: null,
    startDate: null,
    endDate: null,
    controlNumber: '',
}

export const useDonationStore = create<DonationState>()((set) => ({
    page: 0,
    size: 100,
    filters: { ...defaultFilters },
    setPage: (page) => set({ page }),
    setSize: (size) => set({ size, page: 0 }),
    setFilter: (filter, value) => set((state) => ({
        filters: { ...state.filters, [filter]: value },
        page: 0,
    })),
    cleanFilters: () => set({ filters: { ...defaultFilters }, page: 0 }),
}))