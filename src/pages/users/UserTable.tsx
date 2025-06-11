import { User } from "./types";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead className="bg-gradient-to-r from-blue-800 to-[#34A8D5] pointer-events-none">
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, nombre, apellido, usuario, correo }) => (
            <tr key={id}>
              <td>{nombre}</td>
              <td>{apellido}</td>
              <td>{usuario}</td>
              <td>{correo}</td>
              <td className="actions-cell">
                <Button size={"icon"}
                  className="py-[0.4rem] pl-[0.2rem] "
                  variant={'edit'}
                  onClick={() => onEdit({ id, nombre, apellido, usuario, correo })}
                  aria-label={`Editar usuario ${usuario}`}
                ><FaRegEdit className="size-4.5" />
                </Button>
              </td>
              <td>
                <Button className="rounded-xl py-[0.4rem] px-[0.2rem]" size={'icon'}
                  variant={'delete'}
                  onClick={() => onDelete(id)}
                  aria-label={`Eliminar usuario ${usuario}`}
                >
                  <FaRegTrashAlt className="size-5 " />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
