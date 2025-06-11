import { HeaderPages } from '@/pages/layout/Header'
import { useState } from 'react'
import { BsImage } from 'react-icons/bs'
import { FaEllipsisVertical } from 'react-icons/fa6'
import { IoDocumentTextOutline } from 'react-icons/io5'

export const Doc = () => {
    const [list, setList] = useState<string>('list');

    return (
        <div>
            <HeaderPages title='Documentos' Icon={IoDocumentTextOutline} />
            <div className='bg-[#3779c3] rounded-2xl w-full'>
                <div className='flex items-center justify-end'>
                    <div className='border-white border rounded-2xl m-4 overflow-hidden w-32 flex justify-between'>
                        <div className={`${list == 'list' && 'bg-blue-800'} w-1/2 border border-white px-4 text-white`} onClick={() => setList('list')}>
                            Lista
                        </div>
                        <div className={`${list == 'tabla' && 'bg-blue-800'} w-1/2 border border-white px-4 text-white`} onClick={() => setList('tabla')}>
                            Tabla
                        </div>
                    </div>
                </div>

                {list == 'tabla' ? (
                    <div className='flex items-start justify-start flex-wrap gap-4 mx-8 h-80 overflow-y-auto'>
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                        <CardDocuments name={'Archivo'} />
                    </div>
                ) : (
                    <div>
                        <ListDocuments name={'Listas'} type={'jpg'}/>
                        <ListDocuments name={'Listas'} type={'jpg'}/>
                        <ListDocuments name={'Listas'} type={'jpg'}/>
                        <ListDocuments name={'Listas'} type={'pdf'}/>
                        <ListDocuments name={'Listas'} type={'word'}/>
                        <ListDocuments name={'Listas'} type={'excel'}/>
                    </div>
                )}

                {/* <div className='flex flex-wrap items-start justify-start gap-4 w-[80%] mx-auto py-20'>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                        <CardDocuments name={item} key={item} />
                    ))}
                </div> */}

            </div>
        </div>
    )
}

interface CardDocumentsProps {
    name: string
}

const CardDocuments = ({ name }: CardDocumentsProps) => {
    return (
        <div className='bg-[#3779c3] rounded-2xl border border-white w-48 h-40 p-1'>
            <div className='flex items-center justify-between px-2 text-white py-1'>
                <div className='flex items-center gap-2'>
                    <BsImage />
                    <p>{name}.png</p>
                </div>

                <FaEllipsisVertical />
            </div>

            <div className='w-full h-[80%] bg-white rounded-2xl'>

            </div>
        </div>
    )
}

interface ListDocumentsProps {
    name: string;
    type: string;
}

const ListDocuments = ({ name, type }: ListDocumentsProps) => {
    return (
        <div>
            {name} Este es un elemento de la tabla y es de tipo {type}
        </div>
    )
}