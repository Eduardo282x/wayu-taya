import { create } from "zustand"
import type { AuditAction } from "@/services/audit/audit.interface"

export interface AuditFilters {
    entity: string | null
    action: AuditAction | null
    userId: number | null
    from: string | null
    to: string | null
}

interface AuditState {
    page: number
    size: number
    filters: AuditFilters
    setPage: (page: number) => void
    setSize: (size: number) => void
    setFilter: <K extends keyof AuditFilters>(filter: K, value: AuditFilters[K]) => void
    setFilters: (patch: Partial<AuditFilters>) => void
    cleanFilters: () => void
}

const defaultFilters: AuditFilters = {
    entity: null,
    action: null,
    userId: null,
    from: null,
    to: null,
}

export const useAuditStore = create<AuditState>()((set) => ({
    page: 0,
    size: 100,
    filters: { ...defaultFilters },
    setPage: (page) => set({ page }),
    setSize: (size) => set({ size, page: 0 }),
    setFilter: (filter, value) => set((state) => ({
        filters: { ...state.filters, [filter]: value },
        page: 0,
    })),
    setFilters: (patch) => set((state) => ({
        filters: { ...state.filters, ...patch },
        page: 0,
    })),
    cleanFilters: () => set({ filters: { ...defaultFilters }, page: 0 }),
}))
