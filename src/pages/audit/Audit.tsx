import { format, parse } from "date-fns"
import { Trash2 } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { FaClipboardList } from "react-icons/fa"
import { DatePickerRange } from "@/components/datePickerRange/DatePickerRange"
import FormSelectCustom from "@/components/formInput/FormSelectCustom"
import { TableComponents } from "@/components/table/TableComponents"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HeaderPages } from "@/layout/header/Header"
import { Audit_Actions_Options, Audit_Entities_Options } from "@/services/audit/audit.interface"
import type { AuditAction } from "@/services/audit/audit.interface"
import { auditColumns } from "./audit.data"
import { useAuditQuery, useAuditUsersQuery } from "./audit.hook"
import { useAuditStore } from "./auditStore"

const ALL = "all"

const parseLocalDate = (value: string) => parse(value, "yyyy-MM-dd", new Date())

export const Audit = () => {
    const { page, size, filters, setPage, setSize, setFilter, setFilters, cleanFilters } = useAuditStore()
    const { data: usersData } = useAuditUsersQuery()

    const { data, isPending } = useAuditQuery({
        page: page + 1,
        size,
        entity: filters.entity ?? undefined,
        action: filters.action ?? undefined,
        userId: filters.userId ?? undefined,
        from: filters.from ?? undefined,
        to: filters.to ?? undefined,
    })

    const logs = data?.logs ?? []
    const total = data?.pagination?.total ?? 0
    const users = usersData?.users ?? []

    const dateRangeValue: DateRange | undefined =
        filters.from || filters.to
            ? {
                from: filters.from ? parseLocalDate(filters.from) : undefined,
                to: filters.to ? parseLocalDate(filters.to) : undefined,
            }
            : undefined

    const handleDateChange = (range?: DateRange) => {
        setFilters({
            from: range?.from ? format(range.from, "yyyy-MM-dd") : null,
            to: range?.to ? format(range.to, "yyyy-MM-dd") : null,
        })
    }

    return (
        <div className="px-2 lg:p-0 h-full flex flex-col min-h-0">
            <HeaderPages title="Auditoría" Icon={FaClipboardList} />

            <div className="w-full h-fit border-b-2 border-gray-300 flex flex-wrap items-end justify-end gap-2 pb-2 px-2">
                <FormSelectCustom
                    label="Entidad"
                    id="audit-entity"
                    className="w-full sm:w-44"
                    value={filters.entity ?? ALL}
                    options={[
                        { value: ALL, label: "Todas las entidades" },
                        ...Audit_Entities_Options.map((item) => ({ value: item.value, label: item.label })),
                    ]}
                    onChange={(e) => setFilter("entity", e.target.value === ALL ? null : e.target.value)}
                />

                <FormSelectCustom
                    label="Acción"
                    id="audit-action"
                    className="w-full sm:w-44"
                    value={filters.action ?? ALL}
                    options={[
                        { value: ALL, label: "Todas las acciones" },
                        ...Audit_Actions_Options.map((item) => ({ value: item.value, label: item.label })),
                    ]}
                    onChange={(e) => setFilter("action", e.target.value === ALL ? null : e.target.value as AuditAction)}
                />

                <FormSelectCustom
                    label="Usuario"
                    id="audit-user"
                    className="w-full sm:w-56"
                    value={filters.userId?.toString() ?? ALL}
                    options={[
                        { value: ALL, label: "Todos los usuarios" },
                        ...users.map((user) => ({
                            value: user.id.toString(),
                            label: `${user.name} ${user.lastName} - ${user.username}`,
                        })),
                    ]}
                    onChange={(e) => setFilter("userId", e.target.value === ALL ? null : Number(e.target.value))}
                />

                <div className="w-full sm:w-64">
                    <span className="block text-sm font-medium mb-1 bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent">
                        Fechas
                    </span>
                    <DatePickerRange
                        className="w-full"
                        value={dateRangeValue}
                        onChange={handleDateChange}
                    />
                </div>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={cleanFilters}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="opacity-70" side="top">
                        <span>Limpiar filtros</span>
                    </TooltipContent>
                </Tooltip>
            </div>

            <div className="lg:mx-2 mt-3 flex-1 min-h-0 flex flex-col">
                <TableComponents
                    data={logs}
                    column={auditColumns}
                    actionTable={() => { }}
                    totalItems={total}
                    page={page}
                    onPageChange={setPage}
                    rowsPerPage={size}
                    onRowsPerPageChange={setSize}
                    loading={isPending}
                    getRowId={(item) => item.id}
                />
            </div>
        </div>
    )
}
