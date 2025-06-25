import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { menuDocuments, menuHealth, menuMusic, menuWater, menuFeed, IMenu, Sections, menu } from './sidebar.data';
import { TbLogout2 } from "react-icons/tb";
import logo from '@/assets/images/logo1.png';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuData, setMenuData] = useState<IMenu[]>(menu);

    useEffect(() => {
        const getMenuLocalStorage: Sections = localStorage.getItem('menu') as Sections;
        if (getMenuLocalStorage) {
            switch (getMenuLocalStorage) {
                case 'documentos':
                    setMenuData(menuDocuments);
                    break;
                case 'salud':
                    setMenuData(menuHealth);
                    break;
                case 'musica':
                    setMenuData(menuMusic);
                    break;
                case 'agua':
                    setMenuData(menuWater);
                    break;
                case 'alimentos':
                    setMenuData(menuFeed);
                    break;
                default:
                    setMenuData(menu);
                    break;
            }
        }
    }, [])

    useEffect(() => {
        setMenuData((prev) => prev.map(me => {
            return {
                ...me,
                active: location.pathname === me.url
            }
        }))
    }, [location.pathname])

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login')
    }

    return (
        <div className='w-full h-full bg-transparent py-4'>
            <div className='flex items-center justify-center cursor-pointer w-full mb-6' onClick={() => navigate('/')}>
                <img src={logo} alt="" className='w-16' />
                <h2 className='text-lg text-white font-medium julius-sans-one-regular'>WAYUU TAYA</h2>
            </div>

            <div className='flex flex-col items-start justify-between h-[83%] w-full'>
                <div className='flex flex-col items-start justify-start gap-1 w-full'>
                    {menuData && menuData.map((me: IMenu, index: number) => (
                        <div
                            key={index}
                            onClick={() => navigate(me.url)}
                            className={`flex items-center justify-start gap-3 cursor-pointer rounded-lg text-white w-full p-2 manrope border border-transparent  hover:border-white ${me.active && ' border-white shadow-2xl font-medium '} transition-all`}
                        >
                            <me.icon className='text-3xl' /> {me.label}
                        </div>
                    ))}
                </div>

                <div
                    onClick={logout}
                    className={`flex items-center justify-start gap-3 cursor-pointer text-white w-full p-2  transition-all manrope`}
                >
                    <TbLogout2 className='text-2xl ' /> Cerrar Sesión
                </div>
            </div>
        </div>
    )
}
