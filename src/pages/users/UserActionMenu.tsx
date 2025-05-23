"use client"

import { useState } from "react"
import { Edit, Trash2, MoreVertical } from "lucide-react"
import type { Account } from "./columns"

interface UserActionMenuProps {
  user: Account
  onEdit: (user: Account) => void
  onDelete: (user: Account) => void
}

export function UserActionMenu({ user, onEdit, onDelete }: UserActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleEdit = () => {
    onEdit(user)
    setIsOpen(false)
  }

  const handleDelete = () => {
    onDelete(user)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button onClick={toggleMenu} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
            <button
              onClick={handleEdit}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  )
}
