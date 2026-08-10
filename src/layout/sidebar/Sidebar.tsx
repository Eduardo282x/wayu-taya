import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { menuDocuments, menuHealth, menuMusic, menuWater, menuFeed, IMenu, IMenuSection, Sections, menu } from './sidebar.data';
import { TbLogout2 } from "react-icons/tb";
import logo from '@/assets/images/logo1.png';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaRegUser } from 'react-icons/fa6';
import { FiUser } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import { useAuthStore } from '@/store/auth.store';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const logoutStore = useAuthStore((state) => state.logout);
    const [menuData, setMenuData] = useState<IMenuSection[]>([{ items: menu }]);

    useEffect(() => {
        const getMenuLocalStorage: Sections = localStorage.getItem('menu') as Sections;
        if (getMenuLocalStorage) {
            switch (getMenuLocalStorage) {
                case 'documentos':
                    setMenuData([{ items: menuDocuments }]);
                    break;
                case 'salud':
                    setMenuData(menuHealth);
                    break;
                case 'musica':
                    setMenuData([{ items: menuMusic }]);
                    break;
                case 'agua':
                    setMenuData([{ items: menuWater }]);
                    break;
                case 'alimentos':
                    setMenuData([{ items: menuFeed }]);
                    break;
                default:
                    setMenuData([{ items: menu }]);
                    break;
            }
        }
    }, [])

    useEffect(() => {
        setMenuData((prev) => prev.map(section => {
            return {
                ...section,
                items: section.items.map(me => {
                    return {
                        ...me,
                        active: location.pathname === me.url
                    }
                })
            }
        }))
    }, [location.pathname])

    const nameUser = (): string => {
        if (!user) {
            return 'Administrador';
        }
        return `${user.name} ${user.lastName}`;
    }

    const goProfile = () => {
        navigate('/perfil')
    }
    const logout = () => {
        logoutStore();
        navigate('/login')
    }

    return (
        <div className='w-full h-full bg-transparent py-4'>
            <div className='flex items-center justify-center cursor-pointer w-full' onClick={() => navigate('/')}>
                <img src={logo} alt="" className='w-16' />
                <h2 className='text-lg text-white font-medium julius-sans-one-regular'>WAYUU TAYA</h2>
            </div>

            <div className='flex flex-col items-start justify-between h-[90%] w-full'>
                <div className='flex flex-col items-start justify-start gap-1 w-full'>
                    {menuData && menuData.map((section: IMenuSection, index: number) => (
                        <div key={index} className='flex flex-col items-start justify-start gap-1 w-full'>
                            {section.title && (
                                <p className='mt-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-white/50 manrope'>
                                    {section.title}
                                </p>
                            )}
                            {section.items.map((me: IMenu, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => navigate(me.url)}
                                    className={`flex items-center justify-start gap-3 cursor-pointer rounded-lg text-white w-full p-2 manrope border border-transparent  hover:border-white ${me.active && ' border-white shadow-2xl font-medium '} transition-all`}
                                >
                                    <me.icon className='text-3xl' /> {me.label}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger className={`flex items-center justify-around cursor-pointer bg-gray-200 hover:bg-gray-100 rounded-lg text-black w-full p-2  transition-all manrope`}>
                        <FiUser /> {nameUser()} <IoIosArrowDown />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-52 bg-gray-200'>
                        <DropdownMenuItem onClick={goProfile} className='flex items-center justify-start gap-3  cursor-pointer'>
                            <FaRegUser className='text-2xl ' />Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={logout} className='flex items-center justify-start gap-3  cursor-pointer'>
                            <TbLogout2 className='text-2xl ' /> Cerrar Sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
