import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Edit3, Save, X, Lock } from "lucide-react"
import { FaRegSave, FaRegUser, FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router"
import { z } from "zod"

import { apiMessage, getFieldErrors } from "@/services/api-error"
import { authChangePassword } from "@/services/auth/auth.service"
import { clearSessionSilently } from "@/services/auth/session"
import {
  PASSWORD_RULES,
  confirmPasswordSchema,
  lastNameSchema,
  nameSchema,
  passwordSchema,
  usernameSchema,
} from "@/lib/validation"
import { getMe, putProfile } from "@/services/users/user.service"
import type { ProfileBody } from "@/services/users/user.interface"
import { useAuthStore } from "@/store/auth.store"
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogHeader,
  StyledDialogTitle,
  StyledDialogDescription,
} from "@/components/StyledDialog/StyledDialog"

type ProfileForm = ProfileBody;

const emptyProfile: ProfileForm = { username: "", name: "", lastName: "" };

/** Mismas reglas que el DTO del backend, aplicadas antes de gastar la peticion. */
const profileSchema = z.object({
  username: usernameSchema,
  name: nameSchema,
  lastName: lastNameSchema,
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "La contraseña actual es requerida" }),
    newPassword: passwordSchema,
    confirmPassword: confirmPasswordSchema(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

/** Convierte los issues de zod en `{ campo: mensaje }` para pintarlos bajo el input. */
const issuesToFieldErrors = (error: z.ZodError): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !result[key]) result[key] = issue.message;
  }
  return result;
};

export const Profile = () => {
  const navigate = useNavigate();
  const storeUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [form, setForm] = useState<ProfileForm>(emptyProfile);
  const [correo, setCorreo] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [savingPassword, setSavingPassword] = useState(false);

  /**
   * `GET /api/users/me` no lleva id: lo toma del JWT. Asi que no puede haber
   * bucles por pasar parametros, y tampoco se puede consultar el perfil de
   * otra cuenta.
   */
  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setLoading(true);
      const response = await getMe();
      const data = response.data;

      if (active && response.success && data) {
        setForm({ username: data.username, name: data.name, lastName: data.lastName });
        setCorreo(data.correo);
      }

      if (active) setLoading(false);
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleCancel = () => {
    setIsEditing(false);
    setFormError("");
    setFieldErrors({});
    if (storeUser) {
      setForm({ username: storeUser.username, name: storeUser.name, lastName: storeUser.lastName });
    }
  }

  const handleInputChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  /**
   * `PUT /api/users/me` acepta SOLO username, name y lastName. Se manda un
   * objeto construido campo a campo y no el usuario completo, precisamente
   * para no colar el `correo` (o el `rol`, o el `id`), que la API rechaza con
   * 400 al estar `forbidNonWhitelisted` activo.
   */
  const updateUser = async () => {
    setFormError("");
    setFieldErrors({});

    // Validacion en cliente: sin esto el error llega del servidor y el usuario
    // ya pulso Guardar. El backend sigue validando igual.
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      setFieldErrors(issuesToFieldErrors(parsed.error));
      return;
    }

    setSaving(true);

    const payload: ProfileBody = {
      username: parsed.data.username,
      name: parsed.data.name,
      lastName: parsed.data.lastName,
    };

    const response = await putProfile(payload);

    if (response.success && response.data?.user) {
      const updated = response.data.user;
      setForm({ username: updated.username, name: updated.name, lastName: updated.lastName });
      setUser({
        id: updated.id,
        name: updated.name,
        lastName: updated.lastName,
        correo: updated.correo,
        username: updated.username,
        rol: updated.rol.rol,
      });
      setIsEditing(false);
    } else {
      setFormError(apiMessage(response, "No se pudo actualizar el perfil"));
      setFieldErrors(getFieldErrors(response));
    }

    setSaving(false);
  }

  const closeDialog = (value: boolean) => {
    setOpen(value);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordErrors({});
  }

  /**
   * Cambio de contraseña del propio usuario: `POST /api/auth/change-password`,
   * que exige la contraseña ACTUAL.
   *
   * Este 401 ("La contrasena actual es incorrecta") NO es un problema de token,
   * asi que el interceptor no intenta refrescar nada y el error se muestra
   * aqui, en este formulario.
   */
  const savePassword = async () => {
    setPasswordError("");
    setPasswordErrors({});

    const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!parsed.success) {
      setPasswordErrors(issuesToFieldErrors(parsed.error));
      return;
    }

    setSavingPassword(true);
    const response = await authChangePassword({
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
    });

    if (response.success) {
      closeDialog(false);

      // Tras el 200 se revocan TODAS las sesiones, incluida la actual, y el
      // refreshToken tambien quedo revocado: no se puede refrescar, se limpia
      // el store y la cache, y se vuelve al login.
      clearSessionSilently();
      navigate("/login", { replace: true });
      return;
    }

    setPasswordError(apiMessage(response, "No se pudo actualizar la contraseña"));
    setPasswordErrors(getFieldErrors(response));
    setSavingPassword(false);
  }

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-r from-[#024dae] to-[#3089FD] rounded-xl lg:w-[98%] w-[90%] mt-6 lg:mt-0 mx-auto flex items-center justify-start px-4 py-2  gap-4 text-white manrope">
        <FaRegUser size={50} />
        <div className="">
          <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-blue-100 text-sm">Fundación Wayu Tayaa - Gestión de Cuenta</p>
        </div>
      </div>

      <div className="p-3 space-y-4">
        <Card className="py-4">
          <CardHeader className="">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={"/placeholder.svg"} alt="Foto de perfil" />
                    <AvatarFallback className="bg-linear-to-r from-[#024dae] to-[#3089FD] text-white text-xl">
                      {storeUser && getInitials(storeUser.name, storeUser.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {storeUser ? `${storeUser.name} ${storeUser.lastName}` : ''}
                  </CardTitle>
                  <CardDescription className="text-base mt-1">{storeUser && storeUser.username}</CardDescription>
                  <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
                    {storeUser && storeUser.rol}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    disabled={loading}
                    className="bg-linear-to-r from-[#024dae] to-[#3089FD] hover:from-[#023a8a] hover:to-[#4bc5cc]"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={updateUser}
                      disabled={saving}
                      className="bg-linear-to-r from-[#024dae] to-[#3089FD] hover:from-[#023a8a] hover:to-[#4bc5cc]"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Personal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-[#024dae]" />
                  <span>Información Personal</span>
                </CardTitle>
                <CardDescription>
                  {isEditing ? "Edita tu información personal" : "Tu información personal actual"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={form.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Ingresa tu nombre"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md text-gray-800">{form.name}</div>
                    )}
                    {fieldErrors.name && <p className="text-sm text-red-600">{fieldErrors.name}</p>}
                  </div>

                  {/* Apellido */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Ingresa tu apellido"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md text-gray-800">{form.lastName}</div>
                    )}
                    {fieldErrors.lastName && <p className="text-sm text-red-600">{fieldErrors.lastName}</p>}
                  </div>
                </div>

                {/* Usuario */}
                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de Usuario *</Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="username"
                        value={form.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        placeholder="Ingresa tu nombre de usuario"
                      />
                      <p className="text-xs text-amber-700 manrope">
                        El usuario es con el que inicias sesión. Si lo cambias, tendrás que entrar con el nuevo.
                      </p>
                    </>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-gray-800">{form.username}</div>
                  )}
                  {fieldErrors.username && <p className="text-sm text-red-600">{fieldErrors.username}</p>}
                </div>

                {/* Correo Electrónico: solo lectura */}
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-800 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    {correo || storeUser?.correo}
                  </div>
                  <p className="text-xs text-gray-500 manrope">
                    El correo no se puede cambiar desde aquí: la API de perfil solo acepta nombre, apellido y usuario.
                  </p>
                </div>

                {formError && (
                  <p className="text-sm text-red-600 manrope" role="alert">
                    {formError}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Información Adicional */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-[#024dae]" />
                  <span>Seguridad</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <Button variant="animated" onClick={() => setOpen(true)} size="sm" className="w-full">
                  Cambiar Contraseña
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>


      <StyledDialog open={open} onOpenChange={closeDialog}>
        <StyledDialogContent className="w-120">
          <StyledDialogHeader>
            <StyledDialogTitle>Actualizar contraseña</StyledDialogTitle>
            <StyledDialogDescription>
              Al cambiarla se cerrarán todas las sesiones abiertas de tu cuenta, incluida esta.
            </StyledDialogDescription>
          </StyledDialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col items-start justify-start gap-2">
              <Label htmlFor="currentPassword">Contraseña actual *</Label>
              <div className="relative w-full">
                <Input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Tu contraseña actual"
                  className="bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-800 cursor-pointer"
                >
                  {showCurrent ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-600">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div className="flex flex-col items-start justify-start gap-2">
              <Label htmlFor="password">Nueva contraseña *</Label>
              <div className="relative w-full">
                <Input
                  id="password"
                  type={showNew ? "text" : "password"}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  className="bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-800 cursor-pointer"
                >
                  {showNew ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-600">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div className="flex flex-col items-start justify-start gap-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
              <div className="relative w-full">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-800 cursor-pointer"
                >
                  {showConfirm ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-600">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            <ul className="text-[0.7rem] text-gray-600 manrope">
              {PASSWORD_RULES.map((rule) => (
                <li key={rule}>• {rule}</li>
              ))}
            </ul>

            {passwordError && (
              <p className="text-red-500" role="alert">
                {passwordError}
              </p>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={savePassword} variant="animated" type="submit" disabled={savingPassword}>
                <FaRegSave className="self-center size-5" /> Actualizar contraseña
              </Button>
            </div>
          </div>
        </StyledDialogContent>
      </StyledDialog>
    </div>
  )
}
