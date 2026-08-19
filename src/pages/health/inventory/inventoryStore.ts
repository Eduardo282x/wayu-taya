import { create } from "zustand"

interface InventoryState {
    page: number
    size: number
    name: string
    storeId: number | null
    setPage: (page: number) => void
    setSize: (size: number) => void
    setName: (name: string) => void
    setStoreId: (storeId: number | null) => void
    cleanFilters: () => void
}

export const useInventoryStore = create<InventoryState>()((set) => ({
    page: 0,
    size: 100,
    name: '',
    storeId: null,
    setPage: (page) => set({ page }),
    setSize: (size) => set({ size, page: 0 }),
    setName: (name) => set({ name, page: 0 }),
    setStoreId: (storeId) => set({ storeId, page: 0 }),
    cleanFilters: () => set({ name: '', storeId: null, page: 0 }),
}))
