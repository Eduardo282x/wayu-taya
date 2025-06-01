import { Column } from "@/interfaces/table.interface"; // Importa la interfaz Column, probablemente define la estructura de las columnas de la tabla.
 // importamos el css de la tabla
import "@/styles/peopledata.css";
// Define la interfaz People que representa la estructura de los datos de cada persona en la tabla.
interface People {
  // Propiedad para el ID de la parroquia a la que pertenece la persona.
  name: string; // Propiedad para el nombre de la persona.
  lastname: string; // Propiedad para el apellido de la persona.

  address: string; // Propiedad para la dirección de la persona.
  email:string;
  phone: string; // Propiedad para el número de teléfono de la persona.
  identification: string; // Propiedad para el documento de identidad (cédula) de la persona.
  sex:string; // Propiedad para el sexo de la persona (masculino, femenino, etc.).
  birthdate: string; // Propiedad para la fecha de nacimiento de la persona.
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
    element: (data: People) => data.identification // Función para obtener la cédula de cada persona.
  },
    {
    label: 'Sexo', // Etiqueta para la columna de cédula.
    element: (data: People) => data.sex // Función para obtener la cédula de cada persona.
  }, {
    label: 'Dirección', // Etiqueta para la columna de dirección.
    element: (data: People) => data.address // Función para obtener la dirección de cada persona.
  },
    {
    label: 'Fecha de Nacimiento', // Etiqueta para la columna de cédula.
    element: (data: People) => data.birthdate // Función para obtener la cédula de cada persona.
  },
  {
    label: 'Teléfono', // Etiqueta para la columna de teléfono.
    element: (data: People) => data.phone // Función para obtener el teléfono de cada persona.
  },   {
    label: 'Correo Electronico', // Etiqueta para la columna de email
    element: (data: People) => data.email // Función para obtener la cédula de cada persona.
  }
];

// Define un array de objetos People que contiene los datos que se mostrarán en la tabla.
export const dataPeople: People[] = [
 {
    name: 'Juan',
    lastname: 'Perez',
    identification: '12345678',
    sex: "masculino" ,
    address: 'Casa',
    birthdate:"19/03/2003",
    phone: '1234567',
    email: "juanperez123@gmail.com"
  },
  // --- A partir de aquí, los 7 ejemplos adicionales ---

  {
    name: 'Maria',
    lastname: 'González',
    identification: '98765432',
    sex: "femenino" ,
    address: 'Avenida Siempre Viva 742',
    birthdate:"05/11/1995",
    phone: '7654321',
    email: "maria.gonzalez@example.com"
  },
  {
    name: 'Carlos',
    lastname: 'Rodríguez',
    identification: '11223344',
    sex: "masculino" ,
    address: 'Calle Luna 123',
    birthdate:"22/07/1988",
    phone: '1122334',
    email: "carlos.r@correo.net"
  },
  {
    name: 'Ana',
    lastname: 'Martínez',
    identification: '55667788',
    sex: "femenino",
    address: 'Urbanización El Sol, Casa 5',
    birthdate:"14/02/2000",
    phone: '5566778',
    email: "ana.martinez@web.com"
  },
  {
    name: 'Pedro',
    lastname: 'Sánchez',
    identification: '99001122',
    sex: "masculino" ,
    address: 'Sector La Montaña, Finca Grande',
    birthdate:"01/09/1975",
    phone: '9900112',
    email: "pedro.sanchez@dominio.org"
  },
  {
    name: 'Laura',
    lastname: 'Díaz',
    identification: '33445566',
    sex: "femenino",
    address: 'Calle Principal 456, Edif. Apto. 3B',
    birthdate:"30/04/1992",
    phone: '3344556',
    email: "laura.diaz@mail.com"
  },
  {
    name: 'Miguel',
    lastname: 'Fernández',
    identification: '77889900',
    sex: "masculino",
    address: 'Barrio Nuevo, Calle 8, Casa 15',
    birthdate:"10/06/1980",
    phone: '7788990',
    email: "miguel.f@gmail.com"
  },
  {
    name: 'Sofía',
    lastname: 'Gómez',
    identification: '22114433',
    sex: "femenino",
    address: 'Carretera Vieja Km 5',
    birthdate:"17/12/2001",
    phone: '2211443',
    email: "sofia.gomez@empresa.biz"
  }

  
];