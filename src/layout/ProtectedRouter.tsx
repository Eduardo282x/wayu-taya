import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";

import { useAuthStore, useIsAuthenticated } from "@/store/auth.store";

/**
 * Puerta de las rutas privadas.
 *
 * Al arrancar, el accessToken solo vivia en memoria y se perdio al recargar;
 * lo que sobrevive es el refreshToken en sessionStorage. Por eso antes de
 * decidir hay que rehidratar: `hydrate()` hace UN POST /auth/refresh, deja un
 * accessToken nuevo en memoria y ademas actualiza el usuario, que pudo cambiar
 * de rol mientras tanto.
 *
 * El redirect se resuelve en el render, no en un useEffect: antes se
 * redirigia desde un efecto y aun asi se renderizaba `<Outlet />`, lo que
 * dejaba parpadear el contenido protegido un frame.
 */
export const ProtectedRouter = () => {
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const isAuthenticated = useIsAuthenticated();
    const hydrate = useAuthStore((state) => state.hydrate);

    useEffect(() => {
        if (!isHydrated) {
            void hydrate();
        }
    }, [isHydrated, hydrate]);

    if (!isHydrated) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return <Outlet />;
};
