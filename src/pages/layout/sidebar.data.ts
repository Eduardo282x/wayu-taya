import { PiUserList, PiUsersThree } from "react-icons/pi";
import { FaRegCalendarAlt } from "react-icons/fa";
// import { MdAccessTime } from "react-icons/md";
// import { FaBuilding } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

export interface IMenu {
    label: string;
    url: string;
    active: boolean;
    icon: React.ComponentType<{ className?: string }>;
}

export const menu: IMenu[] = [
    {
        label: 'Personas',
        active: false,
        url: '/documentos/personas',
        icon: PiUserList 
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
        icon: FaRegCalendarAlt  
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
        icon: IoDocumentTextOutline    
    },
    {
        label: 'Usuarios',
        active: false,
        url: '/usuarios',
        icon: PiUsersThree    
    },
]