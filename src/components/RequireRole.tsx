import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { hasAnyRole } from "@/lib/roles";
import { useRol } from "@/store/auth.store";

interface RequireRoleProps {
    roles: readonly string[];
    children: ReactNode;
}

/**
 * Puerta de ruta por rol.
 *
 * Oculta, no protege: el backend ya responde 403 a un rol insuficiente. Este
 * componente solo evita que el usuario llegue a una pantalla que no le sirve y
 * le muestra un aviso en vez de una tabla vacia.
 */
export const RequireRole = ({ roles, children }: RequireRoleProps) => {
    const rol = useRol();

    if (!hasAnyRole(rol, roles)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
