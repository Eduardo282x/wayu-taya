import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { menu, IMenu } from './sidebar.data';
import { TbLogout2 } from "react-icons/tb";
import logo from '@/assets/images/logo1.png';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuData, setMenuData] = useState<IMenu[]>(menu);

    useEffect(() => {
        setMenuData((prev) => prev.map(me => {
            return {
                ...me,
                active: location.pathname === me.url
            }
        }))
    }, [location.pathname])

    return (
        <div className='w-full h-full bg-transparent py-4'>
            <div className='flex items-center justify-center cursor-pointer w-full mb-6'>
                <img src={logo} alt="" className='w-16' />
                <h2 className='text-lg text-white font-medium'>WAYUU TAYA</h2>
            </div>

            <div className='flex flex-col items-start justify-between h-[83%] w-full'>
                <div className='flex flex-col items-start justify-start gap-3 w-full'>
                    {menuData && menuData.map((me: IMenu, index: number) => (
                        <div
                            key={index}
                            onClick={() => navigate(me.url)}
                            className={`flex items-center justify-start gap-3 cursor-pointer rounded-lg text-white w-full p-2 ${me.active && '  font-medium '} transition-all`}
                        >
                            <me.icon className='text-3xl' /> {me.label}
                        </div>
                    ))}
                </div>

                <div
                    onClick={() => navigate('/login')}
                    className={`flex items-center justify-start gap-3 cursor-pointer text-white w-full p-2  transition-all`}
                >
                    <TbLogout2 className='text-2xl' /> Cerrar Sesión
                </div>
            </div>
        </div>
    )
}
