import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Login, userSchema } from "./login.data";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiMessage, getFieldErrors, getThrottleSeconds } from "@/services/api-error";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router";

interface LoginFormProps {
    onForgotPassword: () => void;
    setLoading: (loader: boolean) => void;
    loading: boolean;
}

const formatCountdown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${minutes}:${String(rest).padStart(2, "0")}`;
};

export const LoginForm = ({ onForgotPassword, setLoading, loading }: LoginFormProps) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formError, setFormError] = useState<string>("");
    const [lockedFor, setLockedFor] = useState<number>(0);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const isLocked = lockedFor > 0;

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<Login>({
        defaultValues: {
            username: "",
            password: "",
        },
        resolver: zodResolver(userSchema),
    });

    // Cuenta regresiva del bloqueo por intentos fallidos.
    useEffect(() => {
        if (lockedFor <= 0) return;

        const timer = window.setInterval(() => {
            setLockedFor((current) => (current <= 1 ? 0 : current - 1));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [lockedFor]);

    const onSubmit = async (data: Login) => {
        if (isLocked) return;

        setLoading(true);
        setFormError("");
        clearErrors();

        try {
            const response = await login(data.username, data.password);

            if (response.success && response.data?.accessToken) {
                navigate("/salud/inventario", { replace: true });
                return;
            }

            // Un 401 por credenciales NUNCA dispara refresh: el interceptor solo
            // refresca ante "Token invalido o expirado". El mensaje se muestra
            // tal cual porque la API ya lo devuelve localizado.
            setFormError(apiMessage(response, "No se pudo iniciar sesión"));

            // El backend responde 400 con `data.errors` en los fallos de
            // validacion del DTO: con eso se marca cada campo.
            const fieldErrors = getFieldErrors(response);
            if (fieldErrors.username) setError("username", { message: fieldErrors.username });
            if (fieldErrors.password) setError("password", { message: fieldErrors.password });

            // 429: el login se bloquea tras 5 intentos por usuario e IP en 15
            // minutos. Se deshabilitan campos y boton, y se cuenta hacia atras.
            if (response.statusCode === 429) {
                setLockedFor(getThrottleSeconds(response.message));
            }
        } catch {
            setFormError("No se pudo conectar con el servidor. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-6 lg:px-6 h-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col relative justify-center w-full mx-auto h-20">
                <Label className="ml-1 mb-1 bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent font-medium text-lg selection:bg-transparent">Usuario</Label>
                <Input
                    type="text"
                    placeholder="Usuario"
                    autoComplete="username"
                    disabled={isLocked}
                    className="bg-white h-11 rounded-lg pr-10 disabled:opacity-60"
                    {...register("username")}
                />
                {errors.username && (
                    <span className="text-[0.54rem] text-center text-red-500 manrope h-[1%] text-nowrap lg:text-[0.7rem]">
                        {errors.username?.message || " "}
                    </span>
                )}
            </div>

            <div className="flex flex-col justify-center relative w-full mx-auto h-15">
                <Label className="ml-1 mb-1 bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent font-medium text-lg selection:bg-transparent">Contraseña</Label>
                <div className="relative w-full">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        disabled={isLocked}
                        className="bg-white h-11 rounded-lg pr-10 disabled:opacity-60"
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-800 cursor-pointer"
                    >
                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                </div>

                {errors.password && (
                    <span className="text-[0.54rem] text-center text-red-500 manrope h-[5%] lg:text-[0.7rem] lg:text-nowrap">
                        {errors.password?.message || " "}
                    </span>
                )}
            </div>

            {(formError || isLocked) && (
                <p
                    className="text-sm text-center text-red-600 manrope"
                    role={isLocked ? "alert" : undefined}
                >
                    {formError}
                    {isLocked && (
                        <span className="block mt-1 font-semibold">
                            Podrás intentarlo de nuevo en {formatCountdown(lockedFor)}.
                        </span>
                    )}
                </p>
            )}

            <div className="flex justify-center lg:justify-end">
                <button
                    type="button"
                    className="text-blue-800 text-sm cursor-pointer hover:underline selection:bg-transparent disabled:text-gray-400 disabled:no-underline"
                    onClick={onForgotPassword}
                    disabled={isLocked}
                >
                    ¿Olvidaste tu contraseña?
                </button>
            </div>

            <Button
                type="submit"
                variant="animated"
                disabled={loading || isLocked}
                className="w-full h-[60%] text-lg font-semibold shadow-xl"
            >
                {isLocked ? `Espera ${formatCountdown(lockedFor)}` : "Iniciar Sesión"}
            </Button>
        </form>
    );
};
