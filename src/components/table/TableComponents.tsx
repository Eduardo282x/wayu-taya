/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Column } from "@/interfaces/table.interface";
import { FC } from "react"

interface TableProps {
    column: Column[];
    data: any[]
}

export const TableComponents: FC<TableProps> = ({ column, data }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {column.map((col: Column, index: number) => (
                        <TableHead key={index}>{col.label}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index: number) => (
                    <TableRow key={index}>
                        {column.map((col: Column, index: number) => (
                            <TableCell key={index}>{col.element(item)}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
