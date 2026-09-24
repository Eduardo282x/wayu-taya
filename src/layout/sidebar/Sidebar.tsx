import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { menuDocuments, menuHealth, menuMusic, menuWater, menuFeed, IMenu, IMenuSection, Sections, menu } from './sidebar.data';
import { TbLogout2 } from "react-icons/tb";
import logo from '@/assets/images/logo1.png';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaRegUser } from 'react-icons/fa6';
import { FiUser } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import { IoBuildOutline } from 'react-icons/io5';
import { ArrowUpRight, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import { Snackbar } from '@/components/snackbar/Snackbar';
import { useAuthStore } from '@/store/auth.store';
import { CategoryCardProps, optionsMenu } from '@/pages/home/menu.data';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const logoutStore = useAuthStore((state) => state.logout);
    const [menuData, setMenuData] = useState<IMenuSection[]>([{ items: menu }]);
    const [currentModule, setCurrentModule] = useState<string>('Aplicaciones');

    useEffect(() => {
        const getMenuLocalStorage: Sections = localStorage.getItem('menu') as Sections;
        if (getMenuLocalStorage) {
            const moduleActive = optionsMenu.find((option) => option.section === getMenuLocalStorage);
            setCurrentModule(moduleActive ? moduleActive.title : 'Aplicaciones');
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
    }, [location.pathname]);

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

    const handleModuleSelect = (item: CategoryCardProps) => {
        localStorage.setItem('menu', item.section);
        if (item.working) {
            toast.custom(<Snackbar success={true} message={'Modulo en desarrollo...'} Icon={IoBuildOutline} className="bg-gray-600" />, {
                duration: 1500,
                position: 'bottom-center'
            });
            return;
        }
        navigate(item.url);
    }

    return (
        <div className='w-full h-full bg-[#024dae] lg:bg-transparent py-4 px-4 lg:px-0'>
            <div className='flex items-center justify-center cursor-pointer w-full' onClick={() => navigate('/')}>
                <img src={logo} alt="" className='w-16' />
                <h2 className='text-lg text-white font-medium julius-sans-one-regular'>WAYUU TAYA</h2>
            </div>

            <div className='flex flex-col items-start justify-between h-[90%] w-full'>
                <div className='flex flex-col items-start justify-start gap-1 w-full'>
                    <DropdownMenu>
                        <DropdownMenuTrigger className='flex items-center justify-between gap-3 cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg w-full p-2 manrope transition-all'>
                            <span className='flex items-center justify-start gap-3'>
                                <LayoutGrid className='text-2xl' /> {currentModule}
                            </span>
                            <IoIosArrowDown />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='ml-1 w-72 bg-white'>
                            <div className="px-2 py-1.5">
                                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Aplicaciones</span>
                                <h2 className="text-sm font-bold text-gray-800">Tus accesos disponibles</h2>
                                <p className="text-xs text-gray-500">Este panel reutiliza el mismo catálogo que el home.</p>
                            </div>
                            <DropdownMenuSeparator />
                            {optionsMenu.map((item: CategoryCardProps) => (
                                <DropdownMenuItem
                                    key={item.section}
                                    onClick={() => handleModuleSelect(item)}
                                    className='flex items-center justify-start gap-3 cursor-pointer py-2 mb-2'
                                >
                                    <span className='flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 text-blue-600 shrink-0'>
                                        <item.icon className='text-xl' />
                                    </span>
                                    <span className='flex flex-col items-start justify-start'>
                                        <span className='font-medium text-gray-800'>{item.title}</span>
                                        <span className='text-[11px] text-gray-500'>{item.url}</span>
                                    </span>
                                    <ArrowUpRight className='ml-auto text-gray-400' />
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

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
