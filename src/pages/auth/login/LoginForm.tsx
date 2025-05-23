import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Login, userSchema } from "./login.data"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router"
import { Snackbar } from "@/components/snackbar/Snackbar"
import toast from "react-hot-toast"
import { authLogin } from "@/services/auth/auth"
import { SnackbarProps } from "@/components/snackbar/Snackbar"

// Definir la interfaz para las props
interface LoginFormProps {
  onForgotPassword: () => void
}


export const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
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
    console.log(data);

    await authLogin(data).then((res: SnackbarProps) => {
      toast.custom(<Snackbar success={res.success} message={res.message} />, {
        duration: 1500,
        position: 'bottom-center'
      });

      if (res.success) {
        setTimeout(() => {
          navigate('/')
        }, 1500);
      }
    })
  }

  return (
    <form className="lg:space-y-6 space-y-1 lg:px-6 h-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col relative justify-center lg:w-[70%] w-full mx-auto h-20">
        <label className="text-[0.8rem] ml-1 text-[#34A8D5] lg:text-[1rem] manrope selection:bg-transparent">Usuario</label>
        <input
          type="text"
          placeholder="Usuario"
          className="lg:placeholder:text-[1rem] lg:text-[1rem] lg:py-2 placeholder:text-[0.7rem] text-[0.7rem] w-full p-[0.5rem] pb-1  scope-one lg:px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#34A8D5] placeholder:opacity-80 shadow-2xl lg:mb-0"
          {...register("username")}
        />
        {errors.username && (
          <span className="text-[0.54rem] text-center text-red-500 manrope h-[1%] text-nowrap lg:text-[0.7rem]">
            {errors.username?.message || "\u00A0"}
          </span>
        )}
      </div>

      <div className="flex flex-col justify-center relative lg:w-[70%] w-full mx-auto h-15">
        <label className="text-[0.8rem] ml-1 text-[#34A8D5] lg:text-[1rem] manrope selection:bg-transparent">Contraseña</label>
        <div className="flex items-center relative justify-between w-full">
          <div className="flex w-full border border-gray-300 rounded-xl shadow-2xl focus-within:border-[#34A8D5]">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="lg:placeholder:text-[1rem] lg:text-[1rem] lg:py-2 text-[0.7rem] placeholder:text-[0.7rem] w-full p-[0.5rem] pb-1 pl-2 scope-one lg:px-4 lg:pr-0 rounded-xl focus:outline-none   placeholder:opacity-80 lg:mb-0"
              {...register("password")}
            />
            <div className="text-2xl flex items-center p-1" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <FaRegEye className="text-[#34A8D5] cursor-pointer" />
              ) : (
                <FaRegEyeSlash className="text-[#34A8D5] cursor-pointer" />
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
          className="text-[#34A8D5] scope-one lg:text-[0.9rem] cursor-pointer hover:underline text-[0.58rem] selection:bg-transparent"
          onClick={onForgotPassword}
        >
          ¿Olvidaste tu contraseña?
        </div>
      </div>

      <div className="flex justify-center items-center lg:w-full h-[20%] lg:h-auto">
        <button className="lg:text-[1rem] p-3 text-[0.77rem] lg:py-4 manrope text-white font-medium rounded-xl bg-[#34A8D5] transition 100ms ease-in hover:bg-[#3449D5]   text-center cursor-pointer shadow-xl w-[70%] lg:w-[70%] h-[60%]">
          Iniciar Sesión
        </button>
      </div>
    </form>
  )
}
