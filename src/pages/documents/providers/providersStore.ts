import { create } from "zustand"

interface ProvidersState {
    providersPage: number
    providersSize: number
    institutionsPage: number
    institutionsSize: number
    setProvidersPage: (page: number) => void
    setProvidersSize: (size: number) => void
    setInstitutionsPage: (page: number) => void
    setInstitutionsSize: (size: number) => void
}

export const useProvidersStore = create<ProvidersState>()((set) => ({
    providersPage: 0,
    providersSize: 100,
    institutionsPage: 0,
    institutionsSize: 100,
    setProvidersPage: (providersPage) => set({ providersPage }),
    setProvidersSize: (providersSize) => set({ providersSize, providersPage: 0 }),
    setInstitutionsPage: (institutionsPage) => set({ institutionsPage }),
    setInstitutionsSize: (institutionsSize) => set({ institutionsSize, institutionsPage: 0 }),
}))
