import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { passwordSchema } from "./passwordForm.data"
import { BodyRecoverPassword } from '@/services/auth/auth.interfaces'
import { recoverPasswordLogin } from '@/services/auth/auth.service'

// Definir la interfaz para las props
interface PasswordFormProps {
  onBackToLogin: () => void
}

export const PasswordForm = ({ onBackToLogin }: PasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BodyRecoverPassword>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (data: BodyRecoverPassword) => {
    setLoading(true)
    try {
      const response = await recoverPasswordLogin(data);
      if (response?.success) {
        onBackToLogin();
        reset();
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="lg:space-y-6 lg:px-6 h-full w-full flex flex-col lg:items-center" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col relative justify-center lg:w-[70%]">
        <label className="text-[0.8rem] ml-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent lg:text-[1rem] manrope selection:bg-transparent">Correo Electrónico</label>
        <input
          type="email"
          placeholder="Correo Electrónico"
          className="lg:placeholder:text-[1rem] lg:text-[1rem] lg:py-2 placeholder:text-[0.7rem] text-[0.7rem] w-full p-[0.5rem] pb-1 lg:px-4 border border-gray-300 rounded-md focus:outline-1 focus:outline-blue-800 placeholder:opacity-80 shadow-xl lg:mb-0 "
          {...register("email")} />

        <div className='h-[0.6rem] text-nowrap mb-2 lg:mb-0 lg:h-[0.5rem]'>
          {errors.email && (
            <span className="text-[0.54rem] text-center text-red-500 manrope lg:text-[0.7rem] lg:text-nowrap">
              {errors.email?.message || "\u00A0"}
            </span>
          )}
        </div>

      </div>


      <div className='lg:self-center lg:w-[70%]'>
        <label className='text-[0.8rem] ml-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent lg:text-[1rem] manrope selection:bg-transparent'>Contraseña</label>
        <div className='flex  border border-gray-300 rounded-md shadow-xl focus-within:outline-1 focus-within:outline-blue-800'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            className="lg:placeholder:text-[1rem] lg:text-[1rem] lg:py-2 text-[0.7rem] placeholder:text-[0.7rem] w-full p-[0.5rem] pb-1 pl-2 lg:px-4 rounded-md focus:outline-none placeholder:opacity-80 lg:pr-0 lg:mb-0"
            {...register('password')}
          />

          <div className='text-2xl flex items-center p-1' onClick={() => setShowPassword(!showPassword)}>
            {showPassword
              ? <FaRegEye className="text-blue-800 cursor-pointer" />
              : <FaRegEyeSlash className="text-blue-800 cursor-pointer" />
            }
          </div>
        </div>
        <div className='h-[1rem] text-center  w-55 '>
          {errors.password && (
            <span className="text-[0.54rem] text-red-500 manrope h-[5%] lg:text-[0.7rem] lg:text-nowrap  text-nowrap ">
              {errors.password?.message || "\u00A0"}
            </span>
          )}
        </div>
      </div>

      <div className='lg:self-center lg:w-[70%]'>
        <label className='text-[0.8rem] ml-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent lg:text-[1rem] manrope selection:bg-transparent'>Confirmar Contraseña</label>
        <div className='flex w-full border border-gray-300 rounded-md shadow-xl focus-within:outline-1 focus-within:outline-blue-800'>
          <input
            type={showPasswordConfirm ? 'text' : 'password'}
            placeholder="Contraseña"
            className="lg:placeholder:text-[1rem] lg:text-[1rem] lg:py-2 text-[0.7rem] placeholder:text-[0.7rem] w-full p-[0.5rem] pb-1 pl-2 lg:px-4 rounded-md focus:outline-none  placeholder:opacity-80 lg:pr-0 lg:mb-0"
            {...register('confirmPassword')}
          />

          <div className='text-2xl flex items-center p-1' onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
            {showPasswordConfirm
              ? <FaRegEye className="text-blue-800 cursor-pointer" />
              : <FaRegEyeSlash className="text-blue-800 cursor-pointer" />
            }
          </div>
        </div>

        <div className='h-[1rem] text-center text-nowrap mb-2 lg:mb-[0] lg:h-[0.5rem] w-[55]'>

          {errors.confirmPassword && (
            <span className="text-[0.54rem] text-center text-red-500 manrope h-[5%] lg:text-[0.7rem] lg:text-nowrap w-[100%]">
              {errors.confirmPassword?.message || "\u00A0"}
            </span>
          )}

        </div>

      </div>


      <div className='flex  lg:w-[70%]'>
        <button
          type="submit"
          disabled={loading}
          className="lg:text-[1rem] p-3 text-[0.77rem] lg:py-[4%] manrope text-white font-medium rounded-md bg-linear-to-r from-blue-800 to-[#5cdee5] transition-all duration-200 hover:-translate-y-[0.2rem] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-xl w-[50%] lg:w-[70%] lg:h-[10%] h-[50%]">
          Confirmar
        </button>


        <div
          className="text-blue-800 lg:text-[0.75rem] cursor-pointer hover:underline text-[0.54rem] self-center ml-1 lg:text-nowrap manrope selection:bg-transparent"
          onClick={onBackToLogin}>
          Volver al inicio de sesión
        </div>
      </div>

    </form>
  )
}
