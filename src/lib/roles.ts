/**
 * Roles existentes. El campo `rol` del usuario es TEXTO y coincide con uno de
 * estos valores.
 *
 * OJO: puede quedar viejo hasta 15 minutos si un admin cambia el rol de
 * alguien, porque viaja en el JWT. Sirve para OCULTAR acciones, no para
 * autorizar: la API es la fuente de verdad y devuelve 403 si no alcanza.
 */
export const ROLES = ["Super Admin", "Administrador", "Usuarios"] as const;

export type Rol = (typeof ROLES)[number];

/** Gestion de cuentas: /api/users, /api/users/:id, /api/users/password/:id, /api/users/roles. */
export const ROLES_GESTION_USUARIOS: readonly string[] = ["Super Admin", "Administrador"];

/** /api/main-load/seed. */
export const ROLES_SUPER_ADMIN: readonly string[] = ["Super Admin"];

export const canManageUsers = (rol: string | null | undefined): boolean =>
    Boolean(rol) && ROLES_GESTION_USUARIOS.includes(rol as string);

export const isSuperAdmin = (rol: string | null | undefined): boolean =>
    Boolean(rol) && ROLES_SUPER_ADMIN.includes(rol as string);

export const hasAnyRole = (rol: string | null | undefined, allowed: readonly string[]): boolean =>
    Boolean(rol) && allowed.includes(rol as string);
