import { PiUserList, PiUsersThree } from "react-icons/pi";
import { FaRegCalendarAlt } from "react-icons/fa";
// import { MdAccessTime } from "react-icons/md";
// import { FaBuilding } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

export interface IMenu {
    label: string;
    url: string;
    active: boolean;
    section: Sections[];
    icon: React.ComponentType<{ className?: string }>;
}

export type Sections = 'documentos' | 'salud' | 'agua' | 'musica' | 'alimentos' | '' | 'usuarios';

export const menu: IMenu[] = [
    {
        label: 'Personas',
        active: false,
        url: '/documentos/personas',
        icon: PiUserList,
        section: ['alimentos', 'documentos', 'salud']
    },
    // {
    //     label: 'Comunidades',
    //     active: false,
    //     url: '/documentos/comunidades',
    //     icon: FaBuilding  
    // },
    {
        label: 'Eventos',
        active: false,
        url: '/documentos/eventos',
        icon: FaRegCalendarAlt,
        section: ['documentos', 'salud']
    },
    // {
    //     label: 'Actividades',
    //     active: false,
    //     url: '/documentos/actividades',
    //     icon: MdAccessTime   
    // },
    {
        label: 'Documentos',
        active: false,
        url: '/documentos/documentos',
        icon: IoDocumentTextOutline,
        section: ['documentos']
    },
    {
        label: 'Usuarios',
        active: false,
        url: '/usuarios',
        icon: PiUsersThree,
        section: ['documentos', 'salud', 'musica', 'usuarios']
    },
]