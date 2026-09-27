import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailSchema } from "@/lib/validation";
import { apiMessage, getFieldErrors } from "@/services/api-error";
import { authRecover } from "@/services/auth/auth.service";

interface RecoverFormProps {
    onBackToLogin: () => void;
}

type RecoverBody = { email: string };

/**
 * PASO 1 de la recuperacion: pedir el enlace.
 *
 * Este endpoint ya NO cambia la contrasena, solo genera un token de un solo uso
 * valido 15 minutos. Y siempre responde 200 con el mismo mensaje exista o no el
 * correo, para no revelar que correos estan registrados: por eso aqui no se
 * deduce nada del resultado, solo se muestra lo que devuelve la API.
 */
export const RecoverForm = ({ onBackToLogin }: RecoverFormProps) => {
    const [loading, setLoading] = useState(false);
    const [sentMessage, setSentMessage] = useState<string>("");
    const [formError, setFormError] = useState<string>("");

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RecoverBody>({
        defaultValues: { email: "" },
        resolver: zodResolver(z.object({ email: emailSchema })),
    });

    const onSubmit = async (data: RecoverBody) => {
        setLoading(true);
        setFormError("");
        setSentMessage("");

        try {
            const response = await authRecover(data);

            if (response.success) {
                setSentMessage(apiMessage(response, "Si el correo está registrado, recibirás un enlace."));
                return;
            }

            setFormError(apiMessage(response, "No se pudo solicitar el enlace"));

            const fieldErrors = getFieldErrors(response);
            if (fieldErrors.email) setError("email", { message: fieldErrors.email });
        } catch {
            setFormError("No se pudo conectar con el servidor. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-4 lg:px-2 w-full flex flex-col lg:items-center" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col relative justify-center w-full">
                <Label className="ml-1 mb-1 bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent font-medium selection:bg-transparent">
                    Correo Electrónico
                </Label>
                <Input
                    type="email"
                    placeholder="Correo Electrónico"
                    autoComplete="email"
                    className="bg-white h-11 rounded-lg pr-10"
                    {...register("email")}
                />
                <div className="h-[0.9rem] text-nowrap lg:h-2">
                    {errors.email && (
                        <span className="text-[0.54rem] text-center text-red-500 manrope lg:text-[0.7rem]">
                            {errors.email.message}
                        </span>
                    )}
                </div>
            </div>

            {sentMessage && (
                <p className="text-sm text-center text-green-700 manrope" role="status">
                    {sentMessage}
                </p>
            )}

            {formError && (
                <p className="text-sm text-center text-red-600 manrope" role="alert">
                    {formError}
                </p>
            )}

            {import.meta.env.DEV && (
                <p className="text-[0.68rem] text-center text-gray-500 manrope">
                    Desarrollo: el token se imprime en el log del servidor. En produccion no se registra
                    porque no hay proveedor de correo configurado, y el flujo no es utilizable.
                </p>
            )}

            <div className="flex lg:flex-row flex-col-reverse items-center justify-between w-full gap-4">
                <Button type="button" onClick={onBackToLogin} variant="outline" disabled={loading} className="w-full lg:w-auto text-blue-800 border-gray-400">
                    Volver al inicio de sesión
                </Button>

                <Button type="submit" variant="animated" disabled={loading} className="w-full lg:w-1/2 shadow-xl">
                    {loading ? "Enviando..." : "Solicitar enlace"}
                </Button>
            </div>

            <p className="text-center text-[0.72rem] text-gray-500 manrope">
                ¿Ya tienes el enlace?{" "}
                <Link to="/restablecer" className="text-blue-800 underline">
                    Restablecer con el token
                </Link>
            </p>
        </form>
    );
};
