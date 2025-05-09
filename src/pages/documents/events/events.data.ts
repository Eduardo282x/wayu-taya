import { Column } from "@/interfaces/table.interface";

interface Events {
    name: string;
    time: string;
    date: string;
    location: string;
}

export const columnEvents: Column[] = [
    {
        label: 'Nombre evento',
        element: (data: Events) => data.name
    },
    {
        label: 'Ubicacion',
        element: (data: Events) => data.location
    },
    {
        label: 'Hora',
        element: (data: Events) => data.time
    },
    {
        label: 'Fecha',
        element: (data: Events) => data.date
    }
]

export const dataEvents: Events[] = [
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: '02 Mayo 2025'
    },
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: '02 Mayo 2025'
    },
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: '02 Mayo 2025'
    },
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: '02 Mayo 2025'
    },
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: '02 Mayo 2025'
    },
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: '02 Mayo 2025'
    },
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: '02 Mayo 2025'
    },
]