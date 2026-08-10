import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
      <div className="flex flex-col relative justify-center w-full">
        <Label className="ml-1 mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent font-medium text-lg selection:bg-transparent">Correo Electrónico</Label>
        <Input
          type="email"
          placeholder="Correo Electrónico"
          className="bg-white h-11 rounded-lg pr-10"
          {...register("email")} />

        <div className='h-[0.6rem] text-nowrap mb-2 lg:mb-0 lg:h-[0.5rem]'>
          {errors.email && (
            <span className="text-[0.54rem] text-center text-red-500 manrope lg:text-[0.7rem] lg:text-nowrap">
              {errors.email?.message || "\u00A0"}
            </span>
          )}
        </div>

      </div>


      <div className='lg:self-center w-full'>
        <Label className='ml-1 mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent font-medium text-lg selection:bg-transparent'>Contraseña</Label>
        <div className='relative w-full'>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            className="bg-white h-11 rounded-lg pr-10 pr-10"
            {...register('password')}
          />

          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-800 cursor-pointer"
          >
            {showPassword
              ? <FaRegEye />
              : <FaRegEyeSlash />
            }
          </button>
        </div>
        <div className='h-[1rem] text-center  w-55 '>
          {errors.password && (
            <span className="text-[0.54rem] text-red-500 manrope h-[5%] lg:text-[0.7rem] lg:text-nowrap  text-nowrap ">
              {errors.password?.message || "\u00A0"}
            </span>
          )}
        </div>
      </div>

      <div className='lg:self-center w-full'>
        <Label className='ml-1 mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent font-medium text-lg selection:bg-transparent'>Confirmar Contraseña</Label>
        <div className='relative w-full'>
          <Input
            type={showPasswordConfirm ? 'text' : 'password'}
            placeholder="Contraseña"
            className="bg-white h-11 rounded-lg pr-10 pr-10"
            {...register('confirmPassword')}
          />

          <button
            type='button'
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-800 cursor-pointer"
          >
            {showPasswordConfirm
              ? <FaRegEye />
              : <FaRegEyeSlash />
            }
          </button>
        </div>

        <div className='h-[1rem] text-center text-nowrap mb-2 lg:mb-[0] lg:h-[0.5rem] w-[55]'>

          {errors.confirmPassword && (
            <span className="text-[0.54rem] text-center text-red-500 manrope h-[5%] lg:text-[0.7rem] lg:text-nowrap w-[100%]">
              {errors.confirmPassword?.message || "\u00A0"}
            </span>
          )}

        </div>

      </div>


      <div className='flex items-center justify-between w-full gap-4'>
        <Button
          type="submit"
          variant="animated"
          disabled={loading}
          className="w-[50%] shadow-xl">
          Confirmar
        </Button>

        <Button
          type="button"
          onClick={onBackToLogin}
          variant="outline"
          disabled={loading}
          className="text-blue-800">
          Volver al inicio de sesión
        </Button>

        {/* <div
          className="text-blue-800 lg:text-[0.75rem] cursor-pointer hover:underline text-[0.54rem] self-center ml-1 lg:text-nowrap manrope selection:bg-transparent"
          onClick={onBackToLogin}>
          Volver al inicio de sesión
        </div> */}
      </div>

    </form>
  )
}
