import logo from '../../../assets/img/logo .png'
import { useState } from 'react'
import{useForm} from 'react-hook-form'
import{zodResolver} from '@hookform/resolvers/zod'
import { userSchema } from '../../../validations/userSchema';


type inputs = {
    user:string;
    password:string;
}

export const Login = () => {
    const[ShowPswd, setShowPswd] = useState(false)
    const {register, handleSubmit, formState:{errors}} = useForm<inputs>({resolver:zodResolver(userSchema)});

    console.log(errors)

    return (

        
        <div className="bg-gradient-to-tr from-[#3449D5] to-[#34A8D5] h-screen flex items-center justify-center font-sans">
        <div className="bg-white rounded-2xl shadow-2xl lg:w-full lg:max-w-4xl w-60 flex overflow-hidden">
            <div className="lg:w-1/2 w-[100%] lg:p-8 bg-gray-100 p-4 ">
            {/* Lado izquierdo - Formulario */}
                <div className="flex items-center lg:mb-12 cursor-default">
                       <img src={logo} alt="logo" className='w-12 m-2 lg:w-20 lg:h-20 drop-shadow-gray-500 drop-shadow-lg'/>
                    <div className="lg:ml-2 text-[1rem] mr-2  julius-sans-one-regular lg:text-[2.5rem]  text-[#34A8D5] text-shadow2 ">WAYUU TAYA</div>
                </div>
                
                <div className="text-center lg:mb-8 cursor-default space-y-3 mb-6 text-[0.78rem]">
                    <div className="text-[#34A8D5] manrope lg:text-xl lg:m-5">¡Bienvenido!</div>
                    <div className="text-gray-500 manrope lg:text-xl opacity-70 ml-1">Ingresa tus datos....</div>
                </div>
                
                <form className="lg:space-y-6 space-y-1" onSubmit={handleSubmit(data=>{console.log(data)})}>

                <p className='lg:h-[0] h-2 lg:text-[0.8rem] text-center manrope text-[0.5rem] text-[#34A8D5]'>
                    {errors.user?.message || '\u00A0'}
                </p>

                    <div className='flex justify-center'>
                        <input type="text" placeholder="Usuario" className="lg:placeholder:text-[1rem]
                        lg:text-[1rem] lg:py-2 placeholder:text-[0.7rem] text-[0.7rem] w-[85%] p-[0.5rem] pb-1  scope-one lg:w-[70%] lg:px-4  border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#34A8D5] placeholder:opacity-80 shadow-2xl" {...register('user')} required/>
                    </div>

                    <p className='lg:h-[0] h-6 lg:text-[0.8rem] text-center manrope text-[0.5rem] text-[#34A8D5]'>
                    {errors.password?.message || '\u00A0'}
                    </p>

                    <div className='flex justify-center relative'>
                        <input type={ShowPswd ? 'text' : 'password'} placeholder="Contraseña" className="lg:placeholder:text-[1rem]
                        lg:text-[1rem] lg:py-2 text-[0.7rem] placeholder:text-[0.7rem] w-[85%] p-[0.5rem] pb-1 pl-2 scope-one lg:w-[70%] lg:px-4  border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#34A8D5] placeholder:opacity-80 shadow-2xl lg:pr-10 mb-3" {...register('password')} required/>

                        <div className='absolute top-1 right-6 lg:top-[0.6rem] lg:right-17' onClick={() => setShowPswd (!ShowPswd)}>
                        {ShowPswd ? <i className="fas fa-eye   text-[#34A8D5] cursor-pointer"></i> : <i className="fa-solid fa-eye-slash text-[#34A8D5] cursor-pointer"></i>}
                        </div>
                        
                        
                    </div>
                    
                    <div className="flex justify-center lg:justify-end lg:text-xs lg:w-[85%]">
                        <div className="text-[#34A8D5] scope-one lg:text-[0.9rem] cursor-pointer hover:underline text-[0.58rem]">¿Olvidaste tu contraseña?</div>
                    </div>
                    
                    <div className="lg:mt-6 flex justify-center lg:w-full">
                        <button className="lg:text-[1rem] p-3 text-[0.77rem] lg:py-4 manrope text-white font-medium rounded-xl bg-[#34A8D5] transition 100ms ease-in hover:bg-[#3449D5]   text-center cursor-pointer shadow-xl lg:w-[70%]">
                            Iniciar Sesión
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Lado derecho - logo grande */}
            <div className="w-1/2 p-8 bg-[#3449D5] rounded-xl lg:flex flex-wrap items-center justify-start text-black hidden">
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
