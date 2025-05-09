import logo from '../../../assets/img/logo .png'
import { useState } from 'react'


export const Login = () => {
    const[ShowPswd, setShowPswd] = useState(false)
    return (

        
        <div className="bg-gradient-to-tr from-[#3449D5] to-[#34A8D5] h-screen flex items-center justify-center font-sans">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden">
            <div className="w-1/2 p-8 bg-gray-100">
            {/* Lado izquierdo - Formulario */}
                <div className="flex items-center mb-12 cursor-default">
                       <img src={logo} alt="logo" className='w-20 h-20 drop-shadow-gray-500 drop-shadow-lg'/>
                    <div className="ml-2 julius-sans-one-regular text-[2.5rem]  text-[#34A8D5] text-shadow2 ">WAYUU TAYA</div>
                </div>
                
                <div className="text-center mb-8 cursor-default">
                    <div className="text-[#34A8D5] manrope text-xl m-5">¡Bienvenido!</div>
                    <div className="text-gray-500 manrope text-xl opacity-70">Ingresa tus datos....</div>
                </div>
                
                <form className="space-y-8">
                    <div className='flex justify-center'>
                        <input type="text" placeholder="Usuario" className="scope-one w-[70%] px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#34A8D5] placeholder:opacity-80 shadow-2xl" required/>
                    </div>
                    
                    <div className='flex justify-center relative'>
                        <input type={ShowPswd ? 'text' : 'password'} placeholder="Contraseña" className="scope-one w-[70%] px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#34A8D5] placeholder:opacity-80 shadow-2xl pr-10" required/>

                        <div className='absolute top-[0.6rem] right-17' onClick={() => setShowPswd (!ShowPswd)}>
                        {ShowPswd ? <i className="fas fa-eye   text-[#3449D5] cursor-pointer"></i> : <i className="fa-solid fa-eye-slash text-[#34A8D5] cursor-pointer"></i>}
                        </div>
                        
                        
                    </div>
                    
                    <div className="flex justify-end text-xs w-[85%]">
                        <div className="text-[#34A8D5] scope-one text-[0.9rem] cursor-pointer hover:underline">¿Olvidaste tu contraseña?</div>
                    </div>
                    
                    <div className="mt-6 flex justify-center w-full">
                        <button className="py-4 manrope text-white font-medium rounded-xl bg-[#34A8D5] transition 100ms ease-in hover:bg-[#3449D5]   text-center cursor-pointer shadow-xl w-[70%]">
                            Iniciar Sesión
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Lado derecho - logo grande */}
            <div className="w-1/2 p-8 bg-[#3449D5] rounded-xl flex flex-wrap items-center justify-start text-black">
                        <img src={logo} alt="" className='w-20 h-20 mt-[3rem] drop-shadow-black drop-shadow-lg'/>
                        <div className='flex flex-col text-center cursor-default'>
                            <span className='oswald font-normal text-4xl'>FUNDACIÓN</span>
                            <span className='julius-sans-one-regular text-[2.5rem] border-y-2 border-black'>WAYUU TAYA</span>
                        </div>
            </div>
        </div>
    </div>
    
    )
}
