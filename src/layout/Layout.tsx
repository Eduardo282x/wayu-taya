import { Outlet } from 'react-router';
import { Sidebar } from './sidebar/Sidebar';
import { HeaderMobile } from './header/HeaderMobile';
import { TooltipProvider } from '@/components/ui/tooltip';

export const Layout = () => {

    return (
        <div className=' w-screen h-screen overflow-hidden bg-linear-to-r from-[#024dae] to-[#3089FD] flex flex-col lg:flex-row lg:items-center lg:justify-around'>
            <TooltipProvider>
                <div className='hidden lg:block w-[15%] mr-2 h-screen'>
                    <Sidebar />
                </div>

                <div className='w-full lg:w-[82.5%] px-2 pb-3 lg:px-4 lg:pb-0 flex flex-col flex-1 min-h-0 lg:flex-none lg:my-auto lg:h-[95%]'>
                    {/* <Header /> */}
                    <div className='block lg:hidden shrink-0'>
                        <HeaderMobile />
                    </div>
                    <div className='lg:py-4 flex-1 min-h-0 lg:h-full overflow-y-auto bg-gray-100 rounded-2xl'>
                        <Outlet />
                    </div>
                </div>
            </TooltipProvider>
        </div>
    )
}
