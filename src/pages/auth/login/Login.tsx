
export const Login = () => {
    return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <form className=' rounded-lg bg-gray-300 py-8 px-32 flex flex-col items-center justify-center gap-8 '>
                <p className='text-2xl'>Inicio de sesión</p>

                <div className='flex flex-col gap-2 w-80'>
                    <p>Usuario</p>
                    <input type="text" className=' outline-none border-gray-700 border-2 border-solid rounded-md px-4 py-1' />
                </div>

                <div className='flex flex-col gap-2 w-80'>
                    <p>Contraseña</p>
                    <input type="text" className=' outline-none border-gray-700 border-2 border-solid rounded-md px-4 py-1' />
                    <span className=" cursor-pointer text-blue-900 underline text-right">Recuperar contraseña</span>
                </div>
                <button className=' rounded-md mx-auto bg-gray-400 hover:bg-gray-500 hover:px-16 transition-all px-6 py-2  cursor-pointer'>Iniciar sesión</button>
            </form>
        </div>
    )
}
