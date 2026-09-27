import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PASSWORD_RULES, confirmPasswordSchema, passwordSchema } from "@/lib/validation";
import { apiMessage, getFieldErrors } from "@/services/api-error";
import { putUserPassword } from "@/services/users/user.service";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number | null;
  userName?: string;
}

const schema = z.object({
  newPassword: passwordSchema,
  confirmPassword: confirmPasswordSchema(),
});

/**
 * Cambio administrativo de la contrasena de otro usuario:
 * `PUT /api/users/password/:id` con `{ newPassword }`.
 *
 * Va en un dialogo aparte y NO dentro del formulario de edicion, porque ese
 * endpoint no acepta el campo `password` y la API responderia 400 por campo
 * desconocido.
 *
 * Cambiarla revoca todas las sesiones abiertas de ese usuario.
 */
export const ResetPasswordDialog = ({ open, onOpenChange, userId, userName }: ResetPasswordDialogProps) => {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ newPassword: string; confirmPassword: string }>({
    defaultValues: { newPassword: "", confirmPassword: "" },
    resolver: zodResolver(schema),
  });

  const close = () => {
    reset({ newPassword: "", confirmPassword: "" });
    setFormError("");
    setFieldErrors({});
    onOpenChange(false);
  };

  const onSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
    if (userId === null) return;

    setLoading(true);
    setFormError("");
    setFieldErrors({});

    const response = await putUserPassword(userId, { newPassword: values.newPassword });

    if (response.success) {
      close();
      return;
    }

    setFormError(apiMessage(response, "No se pudo restablecer la contraseña"));
    setFieldErrors(getFieldErrors(response));
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => (value ? onOpenChange(true) : close())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restablecer contraseña</DialogTitle>
          <DialogDescription>
            Se asignará una nueva contraseña a {userName ? `"${userName}"` : "este usuario"} y se cerrarán
            todas sus sesiones abiertas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="resetPassword">Nueva contraseña *</Label>
            <div className="relative">
              <Input
                id="resetPassword"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                className="bg-white pr-10"
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-800 cursor-pointer"
              >
                {show ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
            {errors.newPassword && <p className="text-sm text-red-600">{errors.newPassword.message}</p>}
            {fieldErrors.newPassword && <p className="text-sm text-red-600">{fieldErrors.newPassword}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resetConfirm">Confirmar contraseña *</Label>
            <div className="relative">
              <Input
                id="resetConfirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                className="bg-white pr-10"
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
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          <ul className="text-[0.7rem] text-gray-600 manrope">
            {PASSWORD_RULES.map((rule) => (
              <li key={rule}>• {rule}</li>
            ))}
          </ul>

          {formError && (
            <p className="text-sm text-red-600 manrope" role="alert">
              {formError}
            </p>
          )}

          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={close} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="animated" disabled={loading}>
              {loading ? "Guardando..." : "Restablecer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
