import { Button } from "../ui/button"
import { Column } from "./table.interface";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaFilter } from "react-icons/fa";

interface DropdownColumnFilterProps {
    columns: Column[];
    setColumns: (columns: Column[]) => void
}

export const DropdownColumnFilter = ({ columns, setColumns }: DropdownColumnFilterProps) => {

    const changeChecked = (column: Column, checked: boolean) => {
        const newColumns = columns.map(item => {
            return {
                ...item,
                visible: column.column === item.column ? checked : item.visible
            }
        })
        setColumns(newColumns)
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button
                        variant="outline"
                        className="bg-white text-[#0350af] border border-[#0350af] hover:bg-[#e6fafd] hover:text-[#0350af]"
                    >
                        <FaFilter />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {columns.map((column: Column, index: number) => (
                        <DropdownMenuCheckboxItem
                            key={index}
                            className='capitalize hover:bg-gray-200'
                            checked={column.visible}
                            onCheckedChange={(checked) => changeChecked(column, checked)}
                            onSelect={(e) => e.preventDefault()}
                        >
                            {column.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div >
    )
}
