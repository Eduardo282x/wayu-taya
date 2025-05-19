"use client"
import React from 'react'
import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa' 
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { type passwordform, passwordSchema } from "./passwordformdata"

// Definir la interfaz para las props
interface PasswordFormProps {
  onBackToLogin: () => void
}

export const PasswordForm = ({ onBackToLogin }: PasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<passwordform>({
        defaultValues: {
          email: "",
          password: "",
          confirmPassword:""
        },
        resolver: zodResolver(passwordSchema),
      })
    
      const onSubmit = async (data: passwordform) => {
        console.log(data)
      }
  return (
    <form className="lg:space-y-6 lg:px-6 h-full w-full flex flex-col lg:items-center" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col relative justify-center lg:w-[70%]">
        <label className="text-[0.8rem] ml-1 text-[#34A8D5] lg:text-[1rem] manrope">Correo Electrónico</label>
        <input
          type="email"
          placeholder="Correo Electrónico"
          className="lg:placeholder:text-[1rem] lg:text-[1rem] lg:py-2 placeholder:text-[0.7rem] text-[0.7rem] w-full p-[0.5rem] pb-1 scope-one lg:px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#34A8D5] placeholder:opacity-80 shadow-2xl lg:mb-0 "
          {...register("email")}/>

          <div className='h-[0.6rem] text-nowrap mb-2 lg:mb-0 lg:h-[0.5rem]'>
      {errors.email && (
          <span className="text-[0.54rem] text-center text-red-500 manrope lg:text-[0.7rem] lg:text-nowrap">
            {errors.email?.message || "\u00A0"}
          </span>
        )}
      </div>
      
      </div>


      <div className='lg:self-center lg:w-[70%]'>
      <label className='text-[0.8rem] ml-1 text-[#34A8D5] lg:text-[1rem] manrope'>Contraseña</label>
            <div className='flex  border border-gray-300 rounded-xl shadow-2xl'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Contraseña"
                                    className="lg:placeholder:text-[1rem] lg:text-[1rem] lg:py-2 text-[0.7rem] placeholder:text-[0.7rem] w-full p-[0.5rem] pb-1 pl-2 scope-one lg:px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#34A8D5] placeholder:opacity-80 lg:pr-10 lg:mb-0"
                                    {...register('password')}
                                />
            
                                <div className='text-2xl flex items-center p-1' onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword
                                    ? <FaRegEye className="text-[#34A8D5] cursor-pointer"/>
                                    : <FaRegEyeSlash className="text-[#34A8D5] cursor-pointer" />
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
              <label className='text-[0.8rem] ml-1 text-[#34A8D5] lg:text-[1rem] manrope'>Confirmar Contraseña</label>
              <div className='flex w-full border border-gray-300 rounded-xl shadow-2xl'>
                                <input
                                    type={showPasswordConfirm ? 'text' : 'password'}
                                    placeholder="Contraseña"
                                    className="lg:placeholder:text-[1rem] lg:text-[1rem] lg:py-2 text-[0.7rem] placeholder:text-[0.7rem] w-full p-[0.5rem] pb-1 pl-2 scope-one lg:px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#34A8D5] placeholder:opacity-80 lg:pr-10 lg:mb-0"
                                    {...register('confirmPassword')}
                                />
            
                                <div className='text-2xl flex items-center p-1' onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                                    {showPasswordConfirm
                                    ? <FaRegEye className="text-[#34A8D5] cursor-pointer"/>
                                    : <FaRegEyeSlash className="text-[#34A8D5] cursor-pointer" />
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
          className="lg:text-[1rem] p-3 text-[0.77rem] lg:py-[4%] manrope text-white font-medium rounded-xl bg-[#34A8D5] transition 100ms ease-in hover:bg-[#3449D5]  cursor-pointer shadow-xl w-[50%] lg:w-[70%] lg:h-[10%] h-[50%]">
          Confirmar
        </button>
      

      <div
          className="text-[#34A8D5] scope-one lg:text-[0.75rem] cursor-pointer hover:underline text-[0.54rem] self-center ml-1 lg:text-nowrap"
          onClick={onBackToLogin}>
          Volver al inicio de sesión
        </div>
      </div>
    
    </form>
  )
}
