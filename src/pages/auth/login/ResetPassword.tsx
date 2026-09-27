import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PASSWORD_RULES, confirmPasswordSchema, passwordSchema, recoveryTokenSchema } from "@/lib/validation";
import { apiMessage, getFieldErrors } from "@/services/api-error";
import { authConfirmRecover } from "@/services/auth/auth.service";
import { clearSessionSilently } from "@/services/auth/session";

type ResetBody = {
    token: string;
    password: string;
    confirmPassword: string;
};

const schema = z
    .object({
        token: recoveryTokenSchema,
        password: passwordSchema,
        confirmPassword: confirmPasswordSchema(),
    })
    // Coincidencia: las reglas de complejidad de arriba solo garantizan que la
    // confirmacion sea una contrasena valida, no que sea la MISMA.
    .refine((values) => values.password === values.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

/**
 * PASO 2 de la recuperacion: confirmar con el token.
 *
 * El token llega en el enlace (`/restablecer?token=...`) y se borra de la URL
 * de inmediato con `replaceState`: si se dejara, quedaria en el historial del
 * navegador, se podria reenviar por Referer y sobrevivir a un refresco de
 * pagina. Por eso ademas existe el campo manual, para pegar el token a mano si
 * se llega sin query.
 */
export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string>("");
    const [expired, setExpired] = useState(false);
    const [done, setDone] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        watch,
        reset,
        formState: { errors },
    } = useForm<ResetBody>({
        defaultValues: { token: "", password: "", confirmPassword: "" },
        resolver: zodResolver(schema),
    });

    const tokenFromUrl = searchParams.get("token") ?? "";
    const password = watch("password");

    useEffect(() => {
        if (!tokenFromUrl) return;

        reset((current) => ({ ...current, token: tokenFromUrl }));

        // Se limpia la query sin dejar entrada en el historial.
        window.history.replaceState(null, "", "/restablecer");
    }, [tokenFromUrl, reset]);

    const onSubmit = async (data: ResetBody) => {
        setLoading(true);
        setFormError("");
        setExpired(false);

        try {
            const response = await authConfirmRecover({ token: data.token, password: data.password });

            if (response.success) {
                // El backend revoca TODAS las sesiones de esa cuenta. Si el
                // token de esta pestana era de ese mismo usuario, ya no sirve
                // para nada: dejarlo en memoria solo produciria 401 en la
                // siguiente peticion. Se limpia store y cache.
                clearSessionSilently();
                setDone(true);
                return;
            }

            // 400 "El enlace es invalido o ha expirado": el token caduco o ya se
            // uso. Se vuelve al paso 1 a pedir uno nuevo.
            if (response.statusCode === 400 && /expirado|invalido/i.test(response.message)) {
                setExpired(true);
                return;
            }

            setFormError(apiMessage(response, "No se pudo restablecer la contraseña"));

            const fieldErrors = getFieldErrors(response);
            if (fieldErrors.token) setError("token", { message: fieldErrors.token });
            if (fieldErrors.password) setError("password", { message: fieldErrors.password });
        } catch {
            setFormError("No se pudo conectar con el servidor. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <div className="w-full flex flex-col items-center gap-4">
                <p className="text-sm text-center text-green-700 manrope" role="status">
                    Contraseña actualizada correctamente. Ya puedes iniciar sesión.
                </p>
                <Button variant="animated" onClick={() => navigate("/login", { replace: true })}>
                    Ir al inicio de sesión
                </Button>
            </div>
        );
    }

    return (
        <form className="space-y-4 lg:px-2 w-full flex flex-col lg:items-center" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col relative justify-center w-full">
                <Label className="ml-1 mb-1 bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent font-medium selection:bg-transparent">
                    Token del enlace
                </Label>
                <Input
                    type="text"
                    placeholder="Pega aquí el token que recibiste"
                    className="bg-white h-11 rounded-lg"
                    {...register("token")}
                />
                <div className="h-[0.9rem] text-nowrap lg:h-2">
                    {errors.token && (
                        <span className="text-[0.54rem] text-center text-red-500 manrope lg:text-[0.7rem]">
                            {errors.token.message}
                        </span>
                    )}
                </div>
            </div>

            <div className="w-full">
                <Label className="ml-1 mb-1 bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent font-medium selection:bg-transparent">
                    Nueva contraseña
                </Label>
                <div className="relative w-full">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nueva contraseña"
                        autoComplete="new-password"
                        className="bg-white h-11 rounded-lg pr-10"
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
                <div className="h-[1.6rem] text-center">
                    {errors.password && (
                        <span className="text-[0.6rem] text-red-500 manrope">{errors.password.message}</span>
                    )}
                </div>
            </div>

            <div className="w-full">
                <Label className="ml-1 mb-1 bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent font-medium selection:bg-transparent">
                    Confirmar contraseña
                </Label>
                <div className="relative w-full">
                    <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Repite la contraseña"
                        autoComplete="new-password"
                        className="bg-white h-11 rounded-lg pr-10"
                        {...register("confirmPassword")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-800 cursor-pointer"
                    >
                        {showConfirm ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                </div>
                <div className="h-[1.6rem] text-center">
                    {errors.confirmPassword && (
                        <span className="text-[0.6rem] text-red-500 manrope">{errors.confirmPassword.message}</span>
                    )}
                </div>
            </div>

            {/* Los requisitos se muestran de inmediato, no solo al enviar. */}
            <ul className="text-[0.68rem] text-gray-600 manrope w-full px-1 space-y-0.5">
                {PASSWORD_RULES.map((rule) => (
                    <li key={rule}>• {rule}</li>
                ))}
            </ul>

            {expired && (
                <p className="text-sm text-center text-red-600 manrope" role="alert">
                    El enlace es inválido o ha expirado.{" "}
                    <Link to="/login" className="underline">
                        Solicita uno nuevo
                    </Link>
                    .
                </p>
            )}

            {formError && (
                <p className="text-sm text-center text-red-600 manrope" role="alert">
                    {formError}
                </p>
            )}

            <div className="flex lg:flex-row flex-col-reverse items-center justify-between w-full gap-4">
                <Button type="button" onClick={() => navigate("/login")} variant="outline" disabled={loading} className="w-full lg:w-auto text-blue-800 border-gray-400">
                    Volver al inicio de sesión
                </Button>

                <Button type="submit" variant="animated" disabled={loading} className="w-full lg:w-1/2 shadow-xl">
                    {loading ? "Guardando..." : "Restablecer contraseña"}
                </Button>
            </div>

            <p className="text-center text-[0.68rem] text-gray-500 manrope">
                {password ? "Las sesiones abiertas de esta cuenta se cerraran al cambiar la contraseña." : " "}
            </p>
        </form>
    );
};
