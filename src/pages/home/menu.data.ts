import { FileText } from "lucide-react"
import { FaMusic } from "react-icons/fa"
import { GiHealthNormal } from "react-icons/gi"
import { IoIosWater } from "react-icons/io"
import { TbAppleFilled } from "react-icons/tb"

export interface CategoryCardProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    buttonText: string;
    url: string;
}


export const optionsMenu: CategoryCardProps[] = [
    {
        title: "Agua",
        description: "Control y administración del agua",
        icon: IoIosWater,
        buttonText: "Acceder",
        url: '/agua'
    },
    {
        title: "Salud",
        description: "Actividades y recursos destinados al campo de salud",
        icon: GiHealthNormal,
        buttonText: "Salud",
        url: '/salud'
    },
    {
        title: "Documentos",
        description: "Administración de archivos de la fundación",
        icon: FileText,
        buttonText: "Documentos",
        url: '/documentos'
    },
    {
        title: "Musica",
        description: "Actividades y eventos relacionados a la música",
        icon: FaMusic,
        buttonText: "Musica",
        url: '/musica'
    },
    {
        title: "Comida",
        description: "Administración de insumos y comida en las diferentes regiones",
        icon: TbAppleFilled,
        buttonText: "Comida",
        url: '/alimentos'
    },
]