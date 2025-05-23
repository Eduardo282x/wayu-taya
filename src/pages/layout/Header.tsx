import { FaRegUserCircle } from 'react-icons/fa'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FaRegUser } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { FC } from 'react';

export const Header = () => {
    return (
        <div className='flex items-center justify-between w-full bg-[#4498b8] text-white p-4'>
            <p className='text-3xl'>Wayuu Taya</p>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className='flex items-center justify-center gap-3 text-xl cursor-pointer border py-1 px-4 rounded-lg'>
                        <FaRegUserCircle />
                        <span>Administrador</span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                    <DropdownMenuGroup>
                        <DropdownMenuItem className=' cursor-pointer'>
                            <FaRegUser /> Mi Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem className=' cursor-pointer'>
                            <IoSettingsOutline />  Configuración
                        </DropdownMenuItem>
                        <DropdownMenuItem className=' cursor-pointer'>
                            <TbLogout2 /> Cerrar sesión
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

interface HeaderPageProps {
    title: string;
    Icon: React.ComponentType<{ className?: string }>;
}

export const HeaderPages: FC<HeaderPageProps> = ({ title, Icon }) => {
    return (
        <div className='mb-2 bg-linear-to-r from-[#024dae] to-[#5cdee5] rounded-full w-full flex items-center justify-start px-4 py-2 text-2xl gap-2 text-white'>
            <Icon className='text-2xl'/> {title}
        </div>
    )
}