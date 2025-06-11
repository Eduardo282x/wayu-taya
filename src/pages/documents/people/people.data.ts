import { Column } from "@/interfaces/table.interface";
import { IPeople } from "@/services/people/people.interface";
import { formatDate } from "@/utils/formatters";

export const columnPeople: Column[] = [
  {
    label: 'Nombre',
    column: 'name',
    element: (data: IPeople) => data.name,
    isIcon: false,
    visible: true
  },
  {
    label: 'Apellido',
    column: 'lastName',
    element: (data: IPeople) => data.lastName,
    isIcon: false,
    visible: true
  },
  {
    label: 'Cédula',
    column: 'identification',
    element: (data: IPeople) => data.identification,
    isIcon: false,
    visible: true
  },
  // {
  //   label: 'Sexo',
  //   element: (data: IPeople) => data.sex,
  // isIcon: false,
  // visible: true
  // },
  {
    label: 'Teléfono',
    column: 'phone',
    element: (data: IPeople) => data.phone,
    isIcon: false,
    visible: true
  },
  {
    label: 'Dirección',
    column: 'address',
    element: (data: IPeople) => data.address,
    isIcon: false,
    visible: true
  },
  {
    label: 'Fecha de Nacimiento',
    column: 'birthdate',
    element: (data: IPeople) => formatDate(data.birthdate),
    isIcon: false,
    visible: true
  },
  // {
  //   label: 'Correo Electrónico',
  //   element: (data: IPeople) => data.email,
  // isIcon: false,
  // visible: true
  // }
];

export const peopleForm = [
  {
    label: 'Nombre',
    name: 'name',
  }
]