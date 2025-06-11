import { PiUsersThree } from "react-icons/pi";
import { Button } from '@/components/ui/button';
import { TiUserAddOutline } from "react-icons/ti";
import UserTable from "./UserTable";
import { User } from "./types";
import { useState, useMemo } from "react";
import UsersForm from "./UserForms"; 
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import AlertDialog from "./AlertDialog";
import { HeaderPages } from "../layout/Header"

const initialUsers: User[] = [
  { id: 1, nombre: "Juan", apellido:"Pérez", usuario: "juanp", correo: "juanp@mail.com" },
  { id: 2, nombre: "María", apellido:"López", usuario: "marial", correo: "marial@mail.com" },
];

export const Users = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const openCreateForm = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  // Guardar usuario (crear o editar)
  const handleUserSubmit = (data: Omit<User, "id"> | User) => {
    const usuarioExistente = users.some(
      (u) =>
        u.usuario.toLowerCase() === data.usuario.toLowerCase() &&
        ("id" in data ? u.id !== data.id : true)
    );
    const correoExistente = users.some(
      (u) =>
        u.correo.toLowerCase() === data.correo.toLowerCase() &&
        ("id" in data ? u.id !== data.id : true)
    );

    if (usuarioExistente || correoExistente) {
      setAlertMessage("El usuario o correo ya está registrado.");
      setAlertOpen(true);
      return;
    }

    if ("id" in data) {
      // Editar usuario existente
      setUsers(users.map(u => (u.id === data.id ? data : u)));
    } else {
      // Crear nuevo usuario
      const newUser: User = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...data,
      };
      setUsers([...users, newUser]);
    }
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lowerSearch = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.nombre.toLowerCase().includes(lowerSearch) ||
        user.apellido.toLowerCase().includes(lowerSearch) ||
        user.usuario.toLowerCase().includes(lowerSearch) ||
        user.correo.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm, users]);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className=''>
      <HeaderPages title="Usuarios" Icon={PiUsersThree}/>
      <div className='w-full h-fit border-b-2 border-gray-300 flex items-center pb-1 justify-between'>
        <input
          type='search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Buscar...'
          className='focus:outline-0 shadow-2xl border-1 border-gray-400 bg-gray-200 rounded-xl h-[5vh] m-2 placeholder:opacity-60 py-5 px-2 manrope focus:ring-1 focus:ring-[#3449D5] transition-all 200s w-[30%]'
        />
        <Button variant='animated' className='h-[90%]' onClick={openCreateForm}>
          <TiUserAddOutline className='size-6 '/>Crear Usuario
        </Button>
      </div>
      <div>
        <UserTable
          users={filteredUsers}
          onEdit={openEditForm}
          onDelete={(userId) => {
            const user = users.find((u) => u.id === userId);
            if (user) handleDeleteClick(user);
          }}
        />

        <UsersForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleUserSubmit}
          user={editingUser}
        />

        <ConfirmDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          userName={userToDelete?.nombre}
        />

        <AlertDialog
          open={alertOpen}
          onOpenChange={setAlertOpen}
          title="Error"
          description={alertMessage}
        />
      </div>
    </div>
  );
};
