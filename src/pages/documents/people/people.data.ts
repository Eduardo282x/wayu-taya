import { Column } from "@/components/table/table.interface";
import { IPeople } from "@/services/people/people.interface";
import { formatDate } from "@/utils/formatters";
import { MdEdit } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";

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
  },
  {
    label: 'Editar',
    column: 'edit',
    element: (data: IPeople) => formatDate(data.birthdate),
    icon: {
      icon: MdEdit,
      label: 'Editar persona',
      className: '',
      variant: 'edit'
    },
    isIcon: true,
    visible: true
  },
  {
    label: 'Eliminar',
    column: 'delete',
    element: (data: IPeople) => formatDate(data.birthdate),
    icon: {
      icon: FiTrash2,
      label: 'Eliminar persona',
      className: '',
      variant: 'delete'
    },
    isIcon: true,
    visible: true
  },
];

export const peopleForm = [
  {
    label: 'Nombre',
    name: 'name',
  }
]