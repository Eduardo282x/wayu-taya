"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="w-full h-full" style={{ margin: 0, padding: 0 }}>
      <div
        className="w-full border border-gray-300 rounded-md shadow-md overflow-hidden"
        style={{ margin: 0, padding: 0, height: "fit-content" }}
      >
        <table className="w-full border-collapse" style={{ margin: 0, padding: 0, borderSpacing: 0 }}>
          <thead className="bg-gradient-to-r from-[#3449D5] to-[#34A8D5]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-300">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-4 px-4 text-white font-bold text-left cursor-default"
                    style={{ margin: 0, padding: "16px" }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody style={{ margin: 0, padding: 0 }}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-100 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } ${index === table.getRowModel().rows.length - 1 ? "" : "border-b border-gray-200"}`}
                  style={{ margin: 0, padding: 0 }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 px-4" style={{ margin: 0, padding: "12px 16px" }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr style={{ margin: 0, padding: 0 }}>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                  style={{ margin: 0, padding: "24px 16px" }}
                >
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
