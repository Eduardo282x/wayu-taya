import { HeaderPages } from '@/pages/layout/Header'
import { BsImage } from 'react-icons/bs'
import { FaEllipsisVertical } from 'react-icons/fa6'
import { IoDocumentTextOutline } from 'react-icons/io5'

export const Doc = () => {
    return (
        <div>
            <HeaderPages title='Documentos' Icon={IoDocumentTextOutline} />
            <div className='bg-[#3779c3] rounded-2xl'>
                <div className='flex items-center justify-end'>
                    
                </div>

                <div className='flex flex-wrap items-start justify-start gap-4 w-[80%] mx-auto py-20'>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                        <CardDocuments key={item}/>
                    ))}
                </div>

            </div>
        </div>
    )
}


const CardDocuments = () => {
    return (
        <div className='bg-[#3779c3] rounded-2xl border border-white w-48 h-40 p-1'>
            <div className='flex items-center justify-between px-2 text-white py-1'>
                <div className='flex items-center gap-2'>
                    <BsImage />
                    <p>1.png</p>
                </div>

                <FaEllipsisVertical />
            </div>

            <div className='w-full h-[80%] bg-white rounded-2xl'>

            </div>
        </div>
    )
}

const ListDocuments = () => {
    return (
        <div>

        </div>
    )
}