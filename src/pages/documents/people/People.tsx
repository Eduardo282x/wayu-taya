import { TableComponents } from "@/components/table/TableComponents"; // Importamos el componente de la tabla
import { columnPeople, dataPeople } from "./people.data"; // Importamos las columnas y los datos de la tabla
import { useState } from "react"; // Importamos el hook useState para manejar el estado
import { HeaderPages } from "@/pages/layout/Header"; // Importamos el componente de cabecera de la página
import { BsFillPersonLinesFill } from "react-icons/bs"; // Importamos el icono de persona
import { Button } from "@/components/ui/button"; // Importamos el componente de botón
import { IoPersonAddOutline } from "react-icons/io5"; // Importamos el icono de agregar persona
import { CiSearch } from "react-icons/ci"; // Importamos el icono de búsqueda
import "@/styles/people.css"; // Importamos el archivo CSS específico para esta página

import { Input } from "@/components/ui/input"; // Importamos el componente de input

// Importar los componentes del diálogo desde tu archivo de diálogo (asegúrate de que esta ruta sea correcta)
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Importar los componentes del Select
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Asegúrate de que esta ruta sea correcta

export const People = () => {
  const [inputValue, setInputValue] = useState(""); // Estado para el valor del input de búsqueda
  const [rowsPerPage, setRowsPerPage] = useState("5"); // Cambiado el valor por defecto a "5"

  // Filtramos los datos para mostrar solo la cantidad especificada por rowsPerPage
  const paginatedData = dataPeople.slice(0, parseInt(rowsPerPage));

  return (
    <div>
      {/* Contenedor para el encabezado de la página */}
      <div className="flex justify-end mb-3">
        <HeaderPages title="Personas" Icon={BsFillPersonLinesFill} />{" "}
        {/* Agrega el header a la página */}
      </div>{" "}
      {/* Contenedor para el input de búsqueda y el botón de agregar persona */}
      <div className="flex justify-end gap-2 mb-2">
        {/* Contenedor para el Input y el Icono de búsqueda */}
        <div className="relative w-60">
          <Input
            className="pr-8" // Agrega padding a la DERECHA para el icono
            placeholder="Buscar..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <CiSearch
            className="absolute right-2 top-1/2 -translate-y-[55%] text-gray-400" // Posiciona el icono
            size={20}
          />{" "}
        </div>
        {/* Implementación del Diálogo para "Agregar persona" */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-2">
              <span className="flex items-center">
                <IoPersonAddOutline className="mr-2" /> Agregar persona
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
            {/* Ajusta el tamaño máximo del diálogo según necesidad */}
            <DialogHeader>
              <DialogTitle>Agregar Nueva Persona</DialogTitle>
              <DialogDescription>
                Rellena todos los campos para añadir una nueva persona.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Campos del formulario para agregar persona */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-left">
                  {" "}
                  {/* Alinear label a la izquierda */}
                  Nombre
                </label>
                <Input id="name" placeholder="Juan" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="lastname" className="text-left">
                  {" "}
                  {/* Alinear label a la izquierda */}
                  Apellido
                </label>
                <Input
                  id="lastname"
                  placeholder="Pérez"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="identification" className="text-left">
                  {" "}
                  {/* Alinear label a la izquierda */}
                  Cédula
                </label>
                <Input
                  id="identification"
                  placeholder="V-12345678"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="sex" className="text-left">
                  {" "}
                  {/* Alinear label a la izquierda */}
                  Sexo
                </label>
                <Input
                  id="sex"
                  placeholder="Masculino/Femenino"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="address" className="text-left">
                  {" "}
                  {/* Alinear label a la izquierda */}
                  Dirección
                </label>
                <Input
                  id="address"
                  placeholder="Calle Principal, Casa #1"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="birthdate" className="text-left">
                  {" "}
                  {/* Alinear label a la izquierda */}
                  F. Nacimiento
                </label>
                <Input id="birthdate" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-left">
                  {" "}
                  {/* Alinear label a la izquierda */}
                  Teléfono
                </label>
                <Input
                  id="phone"
                  placeholder="0414-1234567"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-left">
                  {" "}
                  {/* Alinear label a la izquierda */}
                  Correo Electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@dominio.com"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar</Button>
              <DialogClose asChild>
                {/* Botón para cerrar el diálogo */}
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <TableComponents column={columnPeople} data={paginatedData} />{" "}
        {/* Usamos los datos paginados en la tabla */}
        {/* Contenedor para el Select de "Filas por página" y la paginación */}
        {/* Deberás ajustar la posición de tu componente de paginación para que quede al lado de este Select */}
        <div className="flex justify-start items-center mt-4">
          {" "}
          {/* Alineado a la izquierda, con margen superior */}
          <span className="mr-2 text-sm text-gray-700">
            Elementos por página:
          </span>
          <Select onValueChange={setRowsPerPage} defaultValue={rowsPerPage}>
            <SelectTrigger className="w-[80px]">
              {" "}
              {/* Ancho del select */}
              <SelectValue placeholder="5" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* Opciones de 5, 10, 20, 30, 40, 50 */}
                {[5, 10, 20, 30, 40, 50].map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* Ejemplo: <Pagination /> */}
        </div>
      </div>
    </div>
  );
};
