import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Login, userSchema } from "./login.data"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { authLogin } from "@/services/auth/auth.service"
import { Snackbar } from "@/components/snackbar/Snackbar"
import toast from 'react-hot-toast'
import { useNavigate } from "react-router"

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
      const res = await authLogin(data);
      if (res?.success) {
        console.log(res)
        localStorage.setItem('token', res.data.token)
        setTimeout(() => {
          navigate('/')
        }, 500);
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
      <div className="flex flex-col relative justify-center w-full mx-auto h-20">
        <Label className="ml-1 mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent font-medium text-lg selection:bg-transparent">Usuario</Label>
        <Input
          type="text"
          placeholder="Usuario"
          className="bg-white h-11 rounded-lg pr-10"
          {...register("username")}
        />
        {errors.username && (
          <span className="text-[0.54rem] text-center text-red-500 manrope h-[1%] text-nowrap lg:text-[0.7rem]">
            {errors.username?.message || "\u00A0"}
          </span>
        )}
      </div>

      <div className="flex flex-col justify-center relative w-full mx-auto h-15">
        <Label className="ml-1 mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent font-medium text-lg selection:bg-transparent">Contraseña</Label>
        <div className="relative w-full">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="bg-white h-11 rounded-lg pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-800 cursor-pointer"
          >
            {showPassword ? (
              <FaRegEye />
            ) : (
              <FaRegEyeSlash />
            )}
          </button>
        </div>

        {errors.password && (
          <span className="text-[0.54rem] text-center text-red-500 manrope h-[5%] lg:text-[0.7rem] lg:text-nowrap">
            {errors.password?.message || "\u00A0"}
          </span>
        )}
      </div>

      <div className="flex justify-center lg:justify-end mt-6">
        <div
          className="text-blue-800 text-sm cursor-pointer hover:underline selection:bg-transparent"
          onClick={onForgotPassword}
        >
          ¿Olvidaste tu contraseña?
        </div>
      </div>

      <Button
        type="submit"
        variant="animated"
        disabled={loading}
        className="w-full h-[60%] text-lg font-semibold shadow-xl"
      >
        Iniciar Sesión
      </Button>
    </form>
  )
}
