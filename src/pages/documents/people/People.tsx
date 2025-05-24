import { TableComponents } from "@/components/table/TableComponents";
import { columnPeople, dataPeople } from "./people.data"; // importamos la tabla y los datos de la tabla
import { useState } from "react";
import { HeaderPages } from "@/pages/layout/Header"; // importamos el header de la pagina que esta en src pages layout
import { BsFillPersonLinesFill } from "react-icons/bs"; // importamos el icono de persona
import { Button } from "@/components/ui/button"; // importamoes el boton que esta en src ui button
import { IoPersonAddOutline } from "react-icons/io5"; // importamos el icono de agregar persona
import "@/styles/people.css"; // importamos el css de la tabla
import "@/styles/peopledata.css"; // importamos el css de la tabla
import { Input } from "@/components/ui/input";

export const People = () => {
  const [inputValue, setInputValue] = useState("");
  return (
    <div>
      {/*className='flex justify-end mb-3'     es para que los elementos tengas una separacion*/}
      <div className="flex justify-end mb-3">
        <HeaderPages title="Personas" Icon={BsFillPersonLinesFill} />
      </div>{" "}
      {/*este es el header de la pagina*/}
      <div className="flex justify-end gap-2 mb-2">
        <Input className="w-60" placeholder="Buscar..." />
        <Button className="mb-2">
          <IoPersonAddOutline />
          Agregar evento
        </Button>
      </div>
      {/*este es el comando del boton*/}
      <div>
        <TableComponents column={columnPeople} data={dataPeople} />
      </div>
      {/*este es la tabla importada de people.data*/}
    </div>
  );
};
