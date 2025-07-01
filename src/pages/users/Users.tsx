import { PiUsersThree } from "react-icons/pi";
import { Button } from '@/components/ui/button';
import { TiUserAddOutline } from "react-icons/ti";
import { useEffect, useState } from "react";
import UsersForm from "./UserForms";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { HeaderPages } from "../layout/Header"
import { TableComponents } from "@/components/table/TableComponents";
import { GroupUsers, IUsers, UsersBody } from "@/services/users/user.interface";
import { FilterComponent } from "@/components/table/FilterComponent";
import { usersColumns } from "./user.data";
import { getUsers, postUsers, putUsers } from "@/services/users/user.service";
import { ScreenLoader } from "@/components/loaders/ScreenLoader";

export const Users = () => {
  const [users, setUsers] = useState<GroupUsers>({ allUsers: [], users: [] });
  const [userSelected, setUserSelected] = useState<IUsers | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    getUsersApi()
  }, [])

  const getUsersApi = async () => {
    setLoading(true)
    try {
      const response: IUsers[] = await getUsers();
      setUsers({ allUsers: response, users: response })
    } catch (err) {
      console.log(err);
    }
    setLoading(false)
  }


  const setUserFilter = (users: IUsers[]) => {
    setUsers((prev) => ({ ...prev, users: users }))
  }

  const newUser = () => {
    setUserSelected(null);
    setOpen(true);
  }

  const handleConfirmDelete = () => {
    if (userSelected) {
      // setUsers(users.filter((u) => u.id !== userToDelete.id));
      // setUserToDelete(null);
      // setIsDeleteDialogOpen(false);
    }
  };

  const getActionTable = (action: string, data: IUsers) => {
    setUserSelected(data);
    if (action == 'edit') {
      setOpen(true);
    }
    if (action == 'delete') {
      setIsDeleteDialogOpen(true);
    }
  }

  const getActionForm = async (user: UsersBody) => {
    if (userSelected) {
      await putUsers(userSelected.id, user);
    } else {
      await postUsers(user);
    }
    getUsersApi();
    setOpen(false);
  }

  return (
    <div className='px-3 lg:p-0 '>
      {loading && (
        <ScreenLoader />
      )}
      <HeaderPages title="Usuarios" Icon={PiUsersThree} />

      <div className="flex justify-end items-center px-2 pb-2 pt-1 h-fit border-b-2 border-gray-300">
        <div className="flex items-center ">
          <FilterComponent
            data={users.allUsers}
            columns={usersColumns}
            setDataFilter={setUserFilter}
            placeholder="Buscar usuarios..."
          />
          <Button
            variant={"animated"}
            className="w-fit lg:h-full text-[0.8rem] lg:text-[1rem]"
            onClick={newUser}
          >
            <TiUserAddOutline className='size-4 lg:size-6 ' />
            Crear Usuario
          </Button>
        </div>
      </div>

      <div className="mt-1 lg:mt-4 ">
        <TableComponents
          data={users.users}
          column={usersColumns}
          actionTable={getActionTable}
        />

        <UsersForm
          open={open}
          onOpenChange={setOpen}
          user={userSelected}
          onSubmit={getActionForm}
        />

        <ConfirmDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          userName={userSelected?.name}
        />
      </div>
    </div>
  );
};
