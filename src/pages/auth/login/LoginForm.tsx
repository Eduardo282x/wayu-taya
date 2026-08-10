import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Login, userSchema } from "./login.data"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router"
import { authLogin } from "@/services/auth/auth.service"
import { Snackbar, SnackbarProps } from "@/components/snackbar/Snackbar"
import toast from 'react-hot-toast'

// Definir la interfaz para las props
interface LoginFormProps {
  onForgotPassword: () => void
  setLoading: (loader: boolean) => void
  loading: boolean
}


export const LoginForm = ({ onForgotPassword, setLoading, loading }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(userSchema),
  })

  const onSubmit = async (data: Login) => {
    setLoading(true)
    try {
      const res: SnackbarProps = await authLogin(data)
      if (res?.success) {
        localStorage.setItem('token', String(res.token))
        setTimeout(() => {
          navigate('/')
        }, 1000);
      }
    } catch {
      toast.custom(<Snackbar success={false} message="Error al iniciar sesión, intenta de nuevo." />, {
        duration: 1500,
        position: 'bottom-center'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="lg:space-y-6 space-y-1 lg:px-6 h-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col relative justify-center lg:w-[70%] w-full mx-auto h-20">
        <label className="ml-1 mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent font-medium text-lg selection:bg-transparent">Usuario</label>
        <input
          type="text"
          placeholder="Usuario"
          className="lg:placeholder:text-[1rem] lg:text-[1rem] lg:py-2 placeholder:text-[0.7rem] text-[0.7rem] w-full p-[0.5rem] pb-1 lg:px-4 border border-gray-300 rounded-md focus:outline-1 focus:outline-blue-800 placeholder:opacity-80 shadow-xl lg:mb-0"
          {...register("username")}
        />
        {errors.username && (
          <span className="text-[0.54rem] text-center text-red-500 manrope h-[1%] text-nowrap lg:text-[0.7rem]">
            {errors.username?.message || "\u00A0"}
          </span>
        )}
      </div>

      <div className="flex flex-col justify-center relative lg:w-[70%] w-full mx-auto h-15">
        <label className="text-[0.8rem] ml-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent lg:text-[1rem] manrope selection:bg-transparent">Contraseña</label>
        <div className="flex items-center relative justify-between w-full">
          <div className="flex w-full border border-gray-300 rounded-md shadow-xl focus-within:outline-1 focus-within:outline-blue-800">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="lg:placeholder:text-[1rem] lg:text-[1rem] lg:py-2 text-[0.7rem] placeholder:text-[0.7rem] w-full p-[0.5rem] pb-1 pl-2 lg:px-4 lg:pr-0 rounded-md focus:outline-none placeholder:opacity-80 lg:mb-0"
              {...register("password")}
            />
            <div className="text-2xl flex items-center p-1" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <FaRegEye className="text-blue-800 cursor-pointer" />
              ) : (
                <FaRegEyeSlash className="text-blue-800 cursor-pointer" />
              )}
            </div>
          </div>
        </div>

        {errors.password && (
          <span className="text-[0.54rem] text-center text-red-500 manrope h-[5%] lg:text-[0.7rem] lg:text-nowrap">
            {errors.password?.message || "\u00A0"}
          </span>
        )}
      </div>

      <div className="flex justify-center lg:justify-end lg:text-xs lg:w-[85%] mt-6">
        <div
          className="text-blue-800 lg:text-[0.9rem] cursor-pointer hover:underline text-[0.58rem] manrope selection:bg-transparent"
          onClick={onForgotPassword}
        >
          ¿Olvidaste tu contraseña?
        </div>
      </div>

      <div className="flex justify-center items-center lg:w-full h-[20%] lg:h-auto">
        <button disabled={loading} className="lg:text-[1rem] p-3 text-[0.77rem] lg:py-2 manrope text-white font-medium rounded-md bg-linear-to-r from-blue-800 to-[#5cdee5] transition-all duration-200 hover:-translate-y-[0.2rem] disabled:opacity-60 disabled:cursor-not-allowed text-center cursor-pointer shadow-xl w-[70%] lg:w-[70%] h-[60%]">
          Iniciar Sesión
        </button>
      </div>
    </form>
  )
}
