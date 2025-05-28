import { PiUsersThree } from "react-icons/pi";
import { Button } from '@/components/ui/button';
import { TiUserAddOutline } from "react-icons/ti";
import UserTable from "./UserTable";
import { User } from "./types";
import{ useState, useMemo } from "react";
import EditUserForm from "./EditUserForm";
import CreateUserForm from './CreateUserForm';
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import AlertDialog from "./AlertDialog";


const initialUsers: User[] = [
  { id: 1, nombre: "Juan Pérez", usuario: "juanp", correo: "juanp@mail.com" },
  { id: 2, nombre: "María López", usuario: "marial", correo: "marial@mail.com" },
];

export const Users = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lowerSearch = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.nombre.toLowerCase().includes(lowerSearch) ||
        user.usuario.toLowerCase().includes(lowerSearch) ||
        user.correo.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm, users]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSave = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleCreate = (newUserData: Omit<User, "id">) => {
    const usuarioExistente = users.some(
      (u) =>
        u.usuario.toLowerCase() === newUserData.usuario.toLowerCase() ||
        u.correo.toLowerCase() === newUserData.correo.toLowerCase()
    );

    if (usuarioExistente) {
      setAlertMessage("El usuario o correo ya está registrado.");
      setAlertOpen(true);
      return;
    }

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      ...newUserData,
    };
    setUsers([...users, newUser]);
    setIsCreateDialogOpen(false);
  };



  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    }
  };


  return (
    <div className='h-[90vh] w-[79.5vw]'>
      <div className='w-full h-fit border-b-2 border-gray-300 flex items-center pb-1 justify-between'>
          <div className='flex p-2 items-center '>
            <h2 className='manrope text-3xl mx-2 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent '>Usuarios</h2>
            <PiUsersThree className='text-3xl text-[#34A8D5]'/>
          </div>
          <input type='search' value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} placeholder='Buscar...' className='focus:outline-0 shadow-2xl border-1 border-gray-400 bg-gray-200 rounded-xl h-[5vh] m-2 placeholder:opacity-60 py-5 px-2 manrope focus:ring-1 focus:ring-[#3449D5] transition-all 200s w-[30%]'/>
          <Button className='text-[1rem] hover:-translate-y-[0.2rem] transition-transform duration-200 drop-shadow-xl drop-shadow-[#a5b4c2] h-[90%]' onClick={() => setIsCreateDialogOpen(true)}><TiUserAddOutline className='size-6 '/>Crear Usuario</Button>
      </div>
      <div>
      <UserTable
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={(userId) => {
          const user = users.find((u) => u.id === userId);
          if (user) handleDeleteClick(user);
        }}
      />

      <EditUserForm
        user={editingUser}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSave}
      />
      <CreateUserForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreate}
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
  )
}

