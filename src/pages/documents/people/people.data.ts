import { Column } from "@/interfaces/table.interface"; // Importa la interfaz Column, probablemente define la estructura de las columnas de la tabla.

// Define la interfaz People que representa la estructura de los datos de cada persona en la tabla.
interface People {
  name: string; // Propiedad para el nombre de la persona.
  lastname: string; // Propiedad para el apellido de la persona.
  address: string; // Propiedad para la dirección de la persona.
  phone: string; // Propiedad para el número de teléfono de la persona.
  dni: string; // Propiedad para el documento de identidad (cédula) de la persona.
}

// Define un array de objetos Column que configuran las columnas de la tabla.
export const columnPeople: Column[] = [
  {
    label: 'Nombre', // Etiqueta que se mostrará en la cabecera de la columna.
    element: (data: People) => data.name // Función que recibe un objeto People y devuelve el valor que se mostrará en esta columna (en este caso, el nombre).
  },
  {
    label: 'Apellido', // Etiqueta para la columna de apellido.
    element: (data: People) => data.lastname // Función para obtener el apellido de cada persona.
  },
  {
    label: 'Cédula', // Etiqueta para la columna de cédula.
    element: (data: People) => data.dni // Función para obtener la cédula de cada persona.
  },
  {
    label: 'Dirección', // Etiqueta para la columna de dirección.
    element: (data: People) => data.address // Función para obtener la dirección de cada persona.
  },
  {
    label: 'Teléfono', // Etiqueta para la columna de teléfono.
    element: (data: People) => data.phone // Función para obtener el teléfono de cada persona.
  }
];

// Define un array de objetos People que contiene los datos que se mostrarán en la tabla.
export const dataPeople: People[] = [
  {
    name: 'Juan',
    lastname: 'Perez',
    dni: '12345678',
    address: 'Casa',
    phone: '1234567'
  },
  {
    name: 'Juan',
    lastname: 'Perez',
    dni: '12345678',
    address: 'Casa',
    phone: '1234567'
  },
  {
    name: 'Juan',
    lastname: 'Perez',
    dni: '12345678',
    address: 'Casa',
    phone: '1234567'
  },
  {
    name: 'Juan',
    lastname: 'Perez',
    dni: '12345678',
    address: 'Casa',
    phone: '1234567'
  },
  {
    name: 'Juan',
    lastname: 'Perez',
    dni: '12345678',
    address: 'Casa',
    phone: '1234567'
  },
  {
    name: 'Juan',
    lastname: 'Perez',
    dni: '12345678',
    address: 'Casa',
    phone: '1234567'
  },
  {
    name: 'Juan',
    lastname: 'Perez',
    dni: '12345678',
    address: 'Casa',
    phone: '1234567'
  },
  {
    name: 'Juan',
    lastname: 'Perez',
    dni: '12345678',
    address: 'Casa',
    phone: '1234567'
  },
  {
    name: 'Juan',
    lastname: 'Perez',
    dni: '12345678',
    address: 'Casa',
    phone: '1234567'
  },
  
];