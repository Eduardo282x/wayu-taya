import { useState } from "react"
import { HeaderPages } from "@/layout/header/Header"
import { TableComponents } from "@/components/table/TableComponents"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaClipboardList } from "react-icons/fa"
import { auditColumns } from "./audit.data"
import { useAuditQuery } from "./audit.hook"
import { Audit_Entities_Options } from "@/services/audit/audit.interface"

const ALL = "all"

export const Audit = () => {
    const [entity, setEntity] = useState<string>(ALL)
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(100)

    const { data, isPending } = useAuditQuery({
        page: page + 1,
        size,
        entity: entity === ALL ? undefined : entity,
    })

    const logs = data?.logs ?? []
    const total = data?.pagination?.total ?? 0

    const handleEntityChange = (value: string) => {
        setEntity(value)
        setPage(0)
    }

    const handleSizeChange = (nextSize: number) => {
        setSize(nextSize)
        setPage(0)
    }

    return (
        <div className="px-2 lg:p-0 h-full flex flex-col min-h-0">
            <HeaderPages title="Auditoría" Icon={FaClipboardList} />

            <div className="w-full h-fit border-b-2 border-gray-300 flex items-center justify-end pb-2 px-2">
                <Select value={entity} onValueChange={handleEntityChange}>
                    <SelectTrigger className="w-56">
                        <SelectValue placeholder="Filtrar por entidad..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>Todas las entidades</SelectItem>
                        {Audit_Entities_Options.map((item, index) => (
                            <SelectItem key={`${index}-${item.value}`} value={item.value}>
                                {item.value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
                    onRowsPerPageChange={handleSizeChange}
                    loading={isPending}
                    getRowId={(item) => item.id}
                />
            </div>
        </div>
    )
}
