"use client"

import { useState, useEffect } from "react"
import { IoIosAdd } from "react-icons/io"
import type { Account } from "./columns"
import { createColumns } from "./columns"
import { DataTable } from "./data-table"
import { UserFormModal, DeleteConfirmationModal } from "./UserFormModal"

export const Users = () => {
  // Estado para los usuarios
  const [users, setUsers] = useState<Account[]>([])

  // Estados para los modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<Account | null>(null)

  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<Account[]>([])

  // Cargar datos iniciales
  useEffect(() => {
    // Simular la obtención de datos
    const initialUsers: Account[] = [
      {
        name: "José Pérez",
        user: "parmesano",
        email: "parmesano@gmail.com",
      },
      {
        name: "María López",
        user: "maria123",
        email: "maria@gmail.com",
      },
      {
        name: "Carlos Rodríguez",
        user: "carlos_dev",
        email: "carlos@gmail.com",
      },
      
    ]
    setUsers(initialUsers)
  }, [])

  // Filtrar usuarios cuando cambia la búsqueda o los usuarios
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  // Función para validar usuarios duplicados
  const validateUser = (userData: Account, isEditing = false): string | null => {
    // Si estamos editando, excluir el usuario actual de la validación
    const usersToCheck = isEditing ? users.filter((user) => user.email !== currentUser?.email) : users

    // Verificar email duplicado
    const emailExists = usersToCheck.some((user) => user.email.toLowerCase() === userData.email.toLowerCase())
    if (emailExists) {
      return "Ya existe un usuario con este correo electrónico"
    }

    // Verificar username duplicado
    const userExists = usersToCheck.some((user) => user.user.toLowerCase() === userData.user.toLowerCase())
    if (userExists) {
      return "Ya existe un usuario con este nombre de usuario"
    }

    return null // No hay errores
  }

  // Manejadores para abrir modales
  const handleAddUser = () => {
    setCurrentUser(null)
    setIsAddModalOpen(true)
  }

  const handleEditUser = (user: Account) => {
    setCurrentUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (user: Account) => {
    setCurrentUser(user)
    setIsDeleteModalOpen(true)
  }

  // Manejadores para acciones CRUD
  const handleSaveNewUser = (user: Account) => {
    const validationError = validateUser(user, false)
    if (validationError) {
      alert(validationError) // En una app real, usarías un toast o modal de error
      return false
    }
    setUsers((prev) => [...prev, user])
    setIsAddModalOpen(false)
    return true
  }

  const handleUpdateUser = (updatedUser: Account) => {
    const validationError = validateUser(updatedUser, true)
    if (validationError) {
      alert(validationError) // En una app real, usarías un toast o modal de error
      return false
    }
    setUsers((prev) => prev.map((user) => (user.email === currentUser?.email ? updatedUser : user)))
    setIsEditModalOpen(false)
    return true
  }

  const handleConfirmDelete = () => {
    if (currentUser) {
      setUsers((prev) => prev.filter((user) => user.email !== currentUser.email))
      setIsDeleteModalOpen(false)
    }
  }

  // Crear columnas con los manejadores
  const columns = createColumns(handleEditUser, handleDeleteUser)

  return (
    <div className="manrope h-[90vh] w-[79.8vw] relative">
      <div className="absolute top-0 left-0 right-0 h-[15%] flex items-center justify-between m-1 rounded-xl bg-gradient-to-br from-[#3449D5] to-[#34A8D5] z-10">
        <h1 className="text-2xl text-white mx-4">Usuarios</h1>
        <div className="text-[1rem]">
          <input
            type="search"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-100 lg:placeholder:text-[1rem] lg:text-[1rem] lg:py-2 placeholder:text-[0.7rem] text-[0.7rem] w-full p-[0.5rem] pb-1 lg:px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 placeholder:opacity-80 shadow-2xl lg:mb-0"
          />
        </div>

        <button
          onClick={handleAddUser}
          className="bg-blue-700 rounded-2xl p-2 text-[#ffffff] h-[50%] w-[14%] cursor-pointer flex text-center transition 100ms ease-in hover:bg-blue-800 shadow-xl mx-2"
        >
          <IoIosAdd className="text-2xl" />
          Añadir Usuario
        </button>
      </div>

      <div className="absolute top-[15%] left-1 right-1 bottom-1 ">
        <div className="h-full px-4 pt-4 overflow-auto">
          <DataTable columns={columns} data={filteredUsers} />
        </div>
      </div>

      {/* Modal para añadir usuario */}
      <UserFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewUser}
        title="Añadir Usuario"
      />

      {/* Modal para editar usuario */}
      <UserFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateUser}
        initialData={currentUser}
        title="Editar Usuario"
      />

      {/* Modal para confirmar eliminación */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={currentUser?.name || ""}
      />
    </div>
  )
}

export default Users
