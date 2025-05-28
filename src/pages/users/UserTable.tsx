import React from "react";
import "./UserTable.css";
import { User } from "./types";
import { FaRegEdit } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";

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
            <th>Usuario</th>
            <th>Correo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, nombre, usuario, correo }) => (
            <tr key={id}>
              <td>{nombre}</td>
              <td>{usuario}</td>
              <td>{correo}</td>
              <td className="actions-cell flex justify-evenly">
                <button
                  className="btn edit-btn flex justify-center items-center gap-2"
                  onClick={() => onEdit({ id, nombre, usuario, correo })}
                  aria-label={`Editar usuario ${usuario}`}
                ><FaRegEdit className="size-[1.3rem]" />
                  Editar
                </button>
                <button
                  className="btn delete-btn flex justify-center items-center gap-2"
                  onClick={() => onDelete(id)}
                  aria-label={`Eliminar usuario ${usuario}`}
                >
                  Eliminar <TiDeleteOutline className="size-[1.4rem]"/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
