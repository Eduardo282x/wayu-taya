import { useEffect } from "react";
import { useNavigate } from "react-router";

import { SESSION_EXPIRED_EVENT } from "@/services/auth/session";

/**
 * Unico punto que convierte el evento `wt:session-expired` en navegacion.
 *
 * Vive DENTRO del router, y fuera de el los servicios no dependen de
 * react-router. El store y la cache de TanStack Query ya estan limpios cuando
 * este evento se emite: aqui solo se navega.
 *
 * Con `replace: true` la pantalla cerrada no queda en el historial: el boton
 * "atras" del navegador no devuelve a una pagina protegida sin sesion.
 */
export const AuthWatcher = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleExpired = () => navigate("/login", { replace: true });

        window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
        return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    }, [navigate]);

    return null;
};
