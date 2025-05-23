"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Account } from "./columns"

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (user: Account) => boolean // Cambiado para retornar boolean
  initialData?: Account | null
  title: string
}

export function UserFormModal({ isOpen, onClose, onSave, initialData, title }: UserFormModalProps) {
  const [formData, setFormData] = useState<Account>({
    name: "",
    user: "",
    email: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      // Resetear el formulario si estamos añadiendo
      setFormData({
        name: "",
        user: "",
        email: "",
      })
    }
    setErrors({}) // Limpiar errores al abrir el modal
  }, [initialData, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!formData.user.trim()) {
      newErrors.user = "El usuario es requerido"
    } else if (formData.user.length < 3) {
      newErrors.user = "El usuario debe tener al menos 3 caracteres"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del correo no es válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const success = onSave(formData)
    if (success) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                type="text"
                id="user"
                name="user"
                value={formData.user}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.user ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.user && <p className="text-red-500 text-sm mt-1">{errors.user}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmar eliminación</h2>
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar al usuario <span className="font-semibold">{userName}</span>? Esta acción
          no se puede deshacer.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
