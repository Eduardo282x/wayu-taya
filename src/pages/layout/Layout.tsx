import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = () => {
    return (
        <div className=' w-screen h-screen overflow-hidden flex items-start justify-between'>
            <div className='w-[20%] h-screen'>
                <Sidebar />
            </div>
            <div className='w-[80%] h-full bg-gray-100'>
                <Header />
                <div className='p-4'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
