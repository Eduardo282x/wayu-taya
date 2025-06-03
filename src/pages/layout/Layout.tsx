import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { HeaderMobile } from './HeaderMobile';

export const Layout = () => {
    return (
        <div className=' w-screen h-screen overflow-hidden bg-linear-to-r from-[#024dae] to-[#5cdee5] flex items-center justify-around'>
            <div className='hidden lg:block w-[15%] h-screen'>
                <Sidebar />
            </div>

            <div className='w-[90%] px-4 h-full lg:w-[82%] lg:h-[95%] lg:bg-gray-100 rounded-2xl'>
                {/* <Header /> */}
                <div className='block lg:hidden'>
                    <HeaderMobile />
                </div>
                <div className='p-4 bg-gray-100 rounded-2xl'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
