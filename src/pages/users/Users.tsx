import { useEffect, useMemo, useState } from "react";
import { PiUsersThree } from "react-icons/pi";
import { Button } from '@/components/ui/button';
import { TiUserAddOutline } from "react-icons/ti";
import { FaRegCopy } from "react-icons/fa";
import UsersForm from "./UserForms";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { HeaderPages } from "../../layout/header/Header"
import { TableComponents } from "@/components/table/TableComponents";
import { IUsers, RolesContent, UsersBody, UsersContent } from "@/services/users/user.interface";
import { FilterComponent } from "@/components/table/FilterComponent";
import { getUsersColumns } from "./user.data";
import { deleteUsers, getRoles, getUsers, postUsers, putUsers } from "@/services/users/user.service";
import PageTransitionComponent from "@/components/PageTransition";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/store/auth.store";

export const Users = () => {
  const currentUser = useUser();
  const [users, setUsers] = useState<UsersContent>({ users: [] });
  const [roles, setRoles] = useState<RolesContent>({ roles: [] });
  const [userSelected, setUserSelected] = useState<IUsers | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  /**
   * Si el backend genera una contraseña temporal porque el admin no mandó
   * ninguna, hay que comunicársela: no se vuelve a devolver nunca más.
   */
  const [temporaryPassword, setTemporaryPassword] = useState<string>("");

  useEffect(() => {
    getUsersApi()
    getRolesApi()
  }, [])

  const getRolesApi = async () => {
    const response = await getRoles();
    setRoles(response)
  }

  const getUsersApi = async () => {
    setLoading(true)
    const response: UsersContent = await getUsers();
    setUsers(response)
    setLoading(false)
  }

  // Memorizado: `TableComponents` copia las columnas a estado propio en un
  // efecto que depende de `[column]`. Sin `useMemo` el array seria nuevo en
  // cada render y ese efecto se reejecutaria de mas en cada cambio de estado.
  const columns = useMemo(() => getUsersColumns(currentUser?.id), [currentUser?.id]);

  const setUserFilter = (filtered: IUsers[]) => {
    setUsers((prev) => ({ ...prev, users: filtered }))
  }

  const newUser = () => {
    setUserSelected(null);
    setOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (userSelected) {
      await deleteUsers(userSelected.id);
      await getUsersApi();
      setIsDeleteDialogOpen(false)
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
    if (action == 'password') {
      setIsResetPasswordOpen(true);
    }
  }

  const getActionForm = async (user: UsersBody) => {
    if (userSelected) {
      // El payload ya viene limpio: en edicion no lleva `password`.
      const response = await putUsers(userSelected.id, user);
      if (!response.success) return;
    } else {
      const response = await postUsers(user);
      if (!response.success) return;

      if (response.data?.temporaryPassword) {
        setTemporaryPassword(response.data.temporaryPassword);
      }
    }

    await getUsersApi();
    setOpen(false);
  }

  return (
    <div className='px-2 lg:p-0 h-full flex flex-col'>
      <PageTransitionComponent toggle={open}>
        <div className="h-full flex flex-col min-h-0">
          <HeaderPages title="Usuarios" Icon={PiUsersThree} />

          <div className="flex justify-end items-center px-2 pb-2 pt-1 h-fit border-b-2 border-gray-300">
            <div className="flex items-center ">
              <FilterComponent
                data={users.users}
                columns={columns}
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

          <div className="lg:mx-2 mt-1 lg:mt-4 flex-1 min-h-0 flex flex-col">
            <TableComponents
              data={users.users}
              column={columns}
              actionTable={getActionTable}
              loading={loading}
            />
          </div>

          <ConfirmDeleteDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleConfirmDelete}
            userName={userSelected?.name}
          />

          <ResetPasswordDialog
            open={isResetPasswordOpen}
            onOpenChange={setIsResetPasswordOpen}
            userId={userSelected?.id ?? null}
            userName={userSelected?.name}
          />
        </div>

        <div className="h-full px-2">
          <UsersForm
            open={open}
            onOpenChange={setOpen}
            user={userSelected}
            roles={roles.roles}
            onSubmit={getActionForm}
          />
        </div>
      </PageTransitionComponent>

      {/* Contraseña temporal: solo se muestra una vez. */}
      <Dialog open={!!temporaryPassword} onOpenChange={(value) => !value && setTemporaryPassword("")}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contraseña temporal generada</DialogTitle>
            <DialogDescription>
              Comunícasela al usuario por un canal seguro. No se vuelve a mostrar, y le serve para
              iniciar sesión y cambiarla desde su perfil.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-md border bg-gray-50 px-3 py-2 text-sm break-all select-all">
              {temporaryPassword}
            </code>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => navigator.clipboard?.writeText(temporaryPassword)}
              aria-label="Copiar contraseña"
            >
              <FaRegCopy />
            </Button>
          </div>

          <DialogFooter className="flex justify-end">
            <Button variant="animated" onClick={() => setTemporaryPassword("")}>
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
