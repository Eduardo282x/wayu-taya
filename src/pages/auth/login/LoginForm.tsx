import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Login, userSchema } from './login.data'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

export const LoginForm = () => {

    const [showPassword, setShowPassword] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<Login>({
        defaultValues: {
            username: '',
            password: ''
        },
        resolver: zodResolver(userSchema)
    });

    const onSubmit = (data: Login) => {
        console.log(data);
    }

    return (
        <form className="lg:space-y-6 space-y-1 lg:px-6" onSubmit={handleSubmit(onSubmit)}>

            <div className='flex flex-col relative justify-center lg:w-[70%] w-full mx-auto'>
                <label>Usuario</label>
                <input
                    type="text"
                    placeholder="Usuario"
                    className="lg:placeholder:text-[1rem] lg:text-[1rem] lg:py-2 placeholder:text-[0.7rem] text-[0.7rem] w-full p-[0.5rem] pb-1  scope-one lg:px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#34A8D5] placeholder:opacity-80 shadow-2xl mb-4 lg:mb-0"
                    {...register('username')}
                />
                {errors.username && (
                    <span className='absolute -bottom-5 text-[.8rem] text-center text-red-500 text-nowrap'>
                        {errors.username?.message || '\u00A0'}
                    </span>
                )}
            </div>


            <div className='flex flex-col justify-center relative lg:w-[70%] w-full mx-auto'>
                <label>Contraseña</label>
                <div className='flex items-center relative justify-between w-full'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña"
                        className="lg:placeholder:text-[1rem] lg:text-[1rem] lg:py-2 text-[0.7rem] placeholder:text-[0.7rem] w-full p-[0.5rem] pb-1 pl-2 scope-one lg:px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#34A8D5] placeholder:opacity-80 shadow-2xl lg:pr-10  mb-4 lg:mb-0"
                        {...register('password')}
                    />

                    <div className='absolute top-4 lg:top-[0.6rem] lg:right-4' onClick={() => setShowPassword(!showPassword)}>
                        {showPassword
                        ? <FaRegEye className="text-[#34A8D5] cursor-pointer"/>
                        : <FaRegEyeSlash className="text-[#34A8D5] cursor-pointer" />
                        }
                    </div>

                </div>

                {errors.password && (
                    <span className='absolute -bottom-5 text-center manrope text-[.8rem] text-red-500 text-nowrap'>
                        {errors.password?.message || '\u00A0'}
                    </span>
                )}
            </div>


            <div className="flex justify-center lg:justify-end lg:text-xs lg:w-[85%]">
                <div className="text-[#34A8D5] scope-one lg:text-[0.9rem] cursor-pointer hover:underline text-[0.58rem]">¿Olvidaste tu contraseña?</div>
            </div>

            <div className="flex justify-center lg:w-full">
                <button className="lg:text-[1rem] p-3 text-[0.77rem] lg:py-4 manrope text-white font-medium rounded-xl bg-[#34A8D5] transition 100ms ease-in hover:bg-[#3449D5]   text-center cursor-pointer shadow-xl lg:w-[70%]">
                    Iniciar Sesión
                </button>
            </div>
        </form>
    )
}
