import { TableComponents } from "@/components/table/TableComponents"; // importamos el componente de la tabla
import { columnPeople, dataPeople } from "./people.data"; // importamos la tabla y los datos de la tabla
// import { useState } from "react";
import { HeaderPages } from "@/pages/layout/Header"; // importamos el header de la pagina que esta en src pages layout
import { BsFillPersonLinesFill } from "react-icons/bs"; // importamos el icono de persona
import { Button } from "@/components/ui/button"; // importamoes el boton que esta en src ui button
import { IoPersonAddOutline } from "react-icons/io5"; // importamos el icono de agregar persona
import "@/styles/people.css"; // importamos el css de la tabla

import { Input } from "@/components/ui/input"; // importamos el input que esta en src ui input

export const People = () => {
  return (
    <div>
      <div className="flex justify-end mb-3">
        <HeaderPages title="Personas" Icon={BsFillPersonLinesFill} />
      </div>
      <div className="flex justify-end gap-2 mb-2">
        <Input className="w-60" placeholder="Buscar..." />
        <Button variant='animated' className="mb-2">
          <IoPersonAddOutline />
          Agregar persona
        </Button>
      </div>
      <div>
        <TableComponents column={columnPeople} data={dataPeople} />
      </div>
    </div>
  );
};
