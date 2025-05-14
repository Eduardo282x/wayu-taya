import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';

export const Layout = () => {
    return (
        <div className=' w-screen h-screen overflow-hidden bg-linear-to-r from-[#024dae] to-[#5cdee5] flex items-center justify-around'>
            <div className='w-[15%] h-screen'>
                <Sidebar />
            </div>
            
            <div className='w-[82%] h-[95%] bg-gray-100 rounded-2xl'>
                {/* <Header /> */}
                <div className='p-4'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
