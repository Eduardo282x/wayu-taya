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
        <div className='w-full h-full bg-[#afdced] p-4'>
            <div className='flex items-center justify-center border-b-4 border-solid border-white cursor-pointer w-full mb-6'>
                <img src={logo} alt="" className='w-20' />
                <h2 className='text-3xl text-[#34a8d5]'>WAYUU TAYA</h2>
            </div>

            <div className='flex flex-col items-start justify-between h-[83%] w-full'>
                <div className='flex flex-col items-start justify-start gap-3 w-full'>
                    {menuData && menuData.map((me: IMenu, index: number) => (
                        <div
                            key={index}
                            onClick={() => navigate(me.url)}
                            className={`flex items-center justify-start gap-3 cursor-pointer rounded-lg border-[#4498b8] border shadow-lg w-full p-2 ${me.active && 'bg-[#4498b8] text-white font-medium'} hover:bg-[#4498b8] hover:text-white transition-all`}
                        >
                            <me.icon className='text-2xl' /> {me.label}
                        </div>
                    ))}
                </div>

                <div
                    onClick={() => navigate('/login')}
                    className={`flex items-center justify-start gap-3 cursor-pointer rounded-lg border-[#4498b8] border shadow-lg w-full p-2 hover:bg-[#4498b8] hover:text-white transition-all`}
                >
                    <TbLogout2 className='text-2xl' /> Cerrar Sesión
                </div>
            </div>
        </div>
    )
}
