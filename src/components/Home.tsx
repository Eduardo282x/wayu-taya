import { CardComponents } from "@/components/card/CardComponents"
import { IoIosMusicalNotes, IoIosWater } from "react-icons/io"
import { IoDocument, IoFastFood } from "react-icons/io5"
import { MdOutlineHealthAndSafety } from "react-icons/md"

export const Home = () => {
    return (
        <div className='bg-gray-300 w-screen h-screen p-4'>
            <p className="text-3xl font-semibold text-black">Sistema de Gestión de Documentos para la fundación Wayu Taya</p>

            <div className="flex flex-col items-start justify-center mt-8 mx-16">
                <p className="text-black text-xl">Disponible</p>
                <div className="flex flex-wrap items-start justify-center gap-8 mt-4">
                    <CardComponents url="/documentos" text='Documentos' icon={IoDocument} className="text-blue-600 border-blue-600"></CardComponents>
                </div>
            </div>

            <div className="flex flex-col items-start justify-center mt-8 mx-16">
                <p className="text-black text-xl">En proceso</p>
                <div className="flex flex-wrap items-start justify-center gap-8 mt-4">
                    <CardComponents url="/salud" text='Salud' icon={MdOutlineHealthAndSafety} className="text-red-500 border-red-500"></CardComponents>
                    <CardComponents url="/alimentos" text='Alimentos' icon={IoFastFood} className="text-cyan-300 border-cyan-300" ></CardComponents>
                    <CardComponents url="/agua" text='Agua' icon={IoIosWater} className="text-blue-400 border-blue-400"></CardComponents>
                    <CardComponents url="/musica" text='Música' icon={IoIosMusicalNotes} className=" text-purple-700 border-purple-700"></CardComponents>
                </div>
            </div>
        </div>
    )
}
