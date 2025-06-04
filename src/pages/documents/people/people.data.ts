import { Column } from "@/interfaces/table.interface";
import { IPeople } from "@/services/people/people.interface";
import { formatDate } from "@/utils/formatters";

export const columnPeople: Column[] = [
  {
    label: 'Nombre',
    column: 'name',
    element: (data: IPeople) => data.name
  },
  {
    label: 'Apellido',
    column: 'lastName',
    element: (data: IPeople) => data.lastName
  },
  {
    label: 'Cédula',
    column: 'identification',
    element: (data: IPeople) => data.identification
  },
  // {
  //   label: 'Sexo',
  //   element: (data: IPeople) => data.sex
  // },
  {
    label: 'Teléfono',
    column: 'phone',
    element: (data: IPeople) => data.phone
  },
  {
    label: 'Dirección',
    column: 'address',
    element: (data: IPeople) => data.address
  },
  {
    label: 'Fecha de Nacimiento',
    column: 'birthdate',
    element: (data: IPeople) => formatDate(data.birthdate)
  },
  // {
  //   label: 'Correo Electrónico',
  //   element: (data: IPeople) => data.email
  // }
];