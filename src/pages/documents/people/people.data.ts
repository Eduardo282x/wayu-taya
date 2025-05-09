import { Column } from "@/interfaces/table.interface";

interface People {
    name: string;
    lastname: string;
    address: string;
    phone: string
}

export const columnPeople: Column[] = [
    {
        label: 'Nombre',
        element: (data: People) => data.name
    },
    {
        label: 'Apellido',
        element: (data: People) => data.lastname
    },
    {
        label: 'Direction',
        element: (data: People) => data.address
    },
    {
        label: 'Teléfono',
        element: (data: People) => data.phone
    }
]

export const dataPeople: People[] = [
    {
        name: 'Juan',
        lastname: 'Perez',
        address: 'Casa',
        phone: '1234567'
    },
    {
        name: 'Angel',
        lastname: 'Perez',
        address: 'Casa',
        phone: '1234567'
    },
    {
        name: 'Maria',
        lastname: 'Perez',
        address: 'Casa',
        phone: '1234567'
    },
    {
        name: 'Isaac',
        lastname: 'Perez',
        address: 'Casa',
        phone: '1234567'
    },
    {
        name: 'Luis',
        lastname: 'Perez',
        address: 'Casa',
        phone: '1234567'
    },
]