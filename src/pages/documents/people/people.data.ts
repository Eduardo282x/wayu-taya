import { Column } from "@/components/table/table.interface";
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
  {
    label: 'Correo Electrónico',
    column: 'email',
    element: (data: IPeople) => data.email,
    isIcon: false,
    visible: false
  },
  {
    label: 'Teléfono',
    column: 'phone',
    element: (data: IPeople) => data.phone,
    isIcon: false,
    visible: true
  },
  {
    label: 'Sexo',
    column: 'sex',
    element: (data: IPeople) => data.sex,
    isIcon: false,
    visible: false
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
  }
];

export const peopleForm = [
  {
    label: 'Nombre',
    name: 'name',
  }
]