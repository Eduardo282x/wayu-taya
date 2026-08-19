import { create } from "zustand"

interface MedicineState {
    page: number
    size: number
    name: string
    setPage: (page: number) => void
    setSize: (size: number) => void
    setName: (name: string) => void
    cleanFilters: () => void
}

export const useMedicineStore = create<MedicineState>()((set) => ({
    page: 0,
    size: 100,
    name: '',
    setPage: (page) => set({ page }),
    setSize: (size) => set({ size, page: 0 }),
    setName: (name) => set({ name, page: 0 }),
    cleanFilters: () => set({ name: '', page: 0 }),
}))
