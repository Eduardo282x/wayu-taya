import { PiUserList, PiUsersThree } from "react-icons/pi";
import { FaRegCalendarAlt } from "react-icons/fa";
// import { MdAccessTime } from "react-icons/md";
// import { FaBuilding } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineInventory2 } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";

export interface IMenu {
    label: string;
    url: string;
    active: boolean;
    icon: React.ComponentType<{ className?: string }>;
}

export type Sections = 'documentos' | 'salud' | 'agua' | 'musica' | 'alimentos';

export const menu: IMenu[] = [
    {
        label: 'Personas',
        active: false,
        url: '/documentos/personas',
        icon: PiUserList,
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
    },
    {
        label: 'Inventario',
        active: false,
        url: '/salud/inventario',
        icon: MdOutlineInventory2,
    },
    {
        label: 'Medicamentos',
        active: false,
        url: '/salud/medicamentos',
        icon: AiOutlineProduct,
    },
    {
        label: 'Usuarios',
        active: false,
        url: '/usuarios',
        icon: PiUsersThree,
    },
]


export const menuDocuments: IMenu[] = [
    {
        label: 'Personas',
        active: false,
        url: '/documentos/personas',
        icon: PiUserList,
    },
    {
        label: 'Eventos',
        active: false,
        url: '/documentos/eventos',
        icon: FaRegCalendarAlt,
    },
    {
        label: 'Documentos',
        active: false,
        url: '/documentos/documentos',
        icon: IoDocumentTextOutline,
    },
    {
        label: 'Usuarios',
        active: false,
        url: '/usuarios',
        icon: PiUsersThree,
    },
];
export const menuHealth: IMenu[] = [
    {
        label: 'Eventos',
        active: false,
        url: '/documentos/eventos',
        icon: FaRegCalendarAlt,
    },
    {
        label: 'Inventario',
        active: false,
        url: '/salud/inventario',
        icon: MdOutlineInventory2,
    },
    {
        label: 'Medicamentos',
        active: false,
        url: '/salud/medicamentos',
        icon: AiOutlineProduct,
    },
    {
        label: 'Usuarios',
        active: false,
        url: '/usuarios',
        icon: PiUsersThree,
    },
];
export const menuMusic: IMenu[] = [
    {
        label: 'Personas',
        active: false,
        url: '/documentos/personas',
        icon: PiUserList,
    },
    {
        label: 'Eventos',
        active: false,
        url: '/documentos/eventos',
        icon: FaRegCalendarAlt,
    },
    {
        label: 'Documentos',
        active: false,
        url: '/documentos/documentos',
        icon: IoDocumentTextOutline,
    },
    {
        label: 'Usuarios',
        active: false,
        url: '/usuarios',
        icon: PiUsersThree,
    },
];
export const menuWater: IMenu[] = [
    {
        label: 'Usuarios',
        active: false,
        url: '/usuarios',
        icon: PiUsersThree,
    },
];
export const menuFeed: IMenu[] = [
    {
        label: 'Personas',
        active: false,
        url: '/documentos/personas',
        icon: PiUserList,
    },
    {
        label: 'Inventario',
        active: false,
        url: '/salud/inventario',
        icon: MdOutlineInventory2,
    },
    {
        label: 'Usuarios',
        active: false,
        url: '/usuarios',
        icon: PiUsersThree,
    },
];