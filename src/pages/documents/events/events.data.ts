import { Column } from "@/interfaces/table.interface";
import { formatDate } from "@/utils/formatters";

interface Events {
    name: string;
    time: string;
    date: Date;
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
        element: (data: Events) => formatDate(data.date)
    }
]

export const dataEvents: Events[] = [
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: new Date()
    },
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: new Date()
    },
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: new Date()
    },
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: new Date()
    },
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: new Date()
    },
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: new Date()
    },
    {
        name: 'Eventos 1',
        location: 'Raul leoin',
        time: '09:00 AM',
        date: new Date()
    },
]