import type { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, Mail, User, UserCircle, Edit, Trash2 } from "lucide-react"

export type Account = {
  name: string
  user: string
  email: string
}

// Esta función se definirá en el componente Users
export const createColumns = (
  onEdit: (user: Account) => void,
  onDelete: (user: Account) => void,
): ColumnDef<Account>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1 font-bold text-white cursor-default">
          <UserCircle className="h-4 w-4" />
          <span>Nombre</span>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="ml-1 cursor-pointer hover:bg-white/20 rounded p-1 transition-colors"
          >
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
          </button>
        </div>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1 font-bold text-white cursor-default">
          <User className="h-4 w-4" />
          <span>Usuario</span>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="ml-1 cursor-pointer hover:bg-white/20 rounded p-1 transition-colors"
          >
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
          </button>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1 font-bold text-white cursor-default">
          <Mail className="h-4 w-4" />
          <span>Correo</span>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="ml-1 cursor-pointer hover:bg-white/20 rounded p-1 transition-colors"
          >
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
          </button>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(user)}
            className="p-1 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
            title="Editar usuario"
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="p-1 rounded-full hover:bg-red-100 transition-colors cursor-pointer"
            title="Eliminar usuario"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )
    },
    header: () => <div className="text-right font-bold text-white cursor-default">Acciones</div>,
  },
]
