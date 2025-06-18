import logo from '@/assets/images/logo1.png';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { IoMdMenu } from 'react-icons/io';
import { Sidebar } from './Sidebar';
import { useState } from 'react';

export const HeaderMobile = () => {
    return (
        <div className='flex items-center justify-between w-full py-4'>
            <div className='flex items-center justify-start cursor-pointer w-full'>
                <img src={logo} alt="" className='w-16' />
                <h2 className='text-white font-bold text-xl julius-sans-one-regular'>WAYUU TAYA</h2>
            </div>
            <MenuMobile />
        </div>
    )
}

const MenuMobile = () => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button asChild variant={'normal'} size={'icon'}>
                        <IoMdMenu />
                    </Button>
                </SheetTrigger>
                <SheetContent side='right' className='bg-linear-to-r from-[#024dae] to-[#5cdee5]' onClick={() => setOpen(false)}>
                    <Sidebar />
                </SheetContent>
            </Sheet>
        </div>
    )
}
