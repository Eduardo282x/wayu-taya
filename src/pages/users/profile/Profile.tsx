import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
import { User, Mail, Edit3, Save, X, Lock } from "lucide-react"
import { FaRegSave, FaRegUser } from "react-icons/fa"
import { UserToken } from "@/services/auth/auth.interfaces"
import { baseUser } from "./profile.data"
import { putPassword, putProfile } from "@/services/users/user.service"
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogHeader,
  StyledDialogTitle,
  StyledDialogDescription,
} from "@/components/StyledDialog/StyledDialog"

export const Profile = () => {
  const [userData, setUserData] = useState<UserToken | null>(null);
  const [editUserData, setEditUserData] = useState<UserToken>(baseUser);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('token') as string);
    setUserData(localUser);
    setEditUserData(localUser);
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setNewPassword("")
    setConfirmPassword("")
  }

  const updateUser = async () => {
    const response = await putProfile(Number(userData?.id), editUserData);
    localStorage.setItem('token', response.token);
    setUserData(JSON.parse(response.token));
    setIsEditing(false);
  }

  const savePassword = () => {
    if (newPassword == '' || confirmPassword == '') {
      setShowAlert(true)
      setMessageAlert('Las contraseña no pueden estar vacias.')
    }
    if (newPassword === confirmPassword) {
      updatePassword();
    } else {
      setShowAlert(true)
      setMessageAlert('Las contraseña no coinciden.')
    }
  }

  const closeDialog = (value: boolean) => {
    setOpen(value);
    setShowAlert(false)
    setMessageAlert('')
  }

  const updatePassword = async () => {
    await putPassword(Number(userData?.id), { newPassword });
    closeDialog(false);
  }

  const handleInputChange = (field: keyof UserToken, value: string) => {
    setEditUserData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-r from-[#024dae] to-[#5cdee5] rounded-xl w-full flex items-center justify-start px-4 py-2  gap-4 text-white manrope">
        <FaRegUser size={50} />
        <div className="">
          <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-blue-100 text-sm">Fundación Wayu Tayaa - Gestión de Cuenta</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <Card className="py-4">
          <CardHeader className="">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={"/placeholder.svg"} alt="Foto de perfil" />
                    <AvatarFallback className="bg-gradient-to-r from-[#024dae] to-[#5cdee5] text-white text-xl">
                      {userData && getInitials(userData.name, userData.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {userData ? `${userData.name} ${userData.lastName}` : ''}
                  </CardTitle>
                  <CardDescription className="text-base mt-1">{userData && userData.username}</CardDescription>
                  <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
                    {userData && userData.rol.rol}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button
                    onClick={handleEdit}
                    className="bg-gradient-to-r from-[#024dae] to-[#5cdee5] hover:from-[#023a8a] hover:to-[#4bc5cc]"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={updateUser}
                      className="bg-gradient-to-r from-[#024dae] to-[#5cdee5] hover:from-[#023a8a] hover:to-[#4bc5cc]"
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
                        value={editUserData ? editUserData.name : ''}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Ingresa tu nombre"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md text-gray-800">{userData && userData.name}</div>
                    )}
                  </div>

                  {/* Apellido */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editUserData ? editUserData.lastName : ''}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Ingresa tu apellido"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md text-gray-800">{userData && userData.lastName}</div>
                    )}
                  </div>
                </div>

                {/* Usuario */}
                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de Usuario *</Label>
                  {isEditing ? (
                    <Input
                      id="username"
                      value={editUserData ? editUserData.username : ''}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      placeholder="Ingresa tu nombre de usuario"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-gray-800">{userData && userData.username}</div>
                  )}
                </div>

                {/* Correo Electrónico */}
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editUserData ? editUserData.correo : ''}
                      onChange={(e) => handleInputChange("correo", e.target.value)}
                      placeholder="Ingresa tu correo electrónico"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-gray-800 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      {userData && userData.correo}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información Adicional */}
          <div className="space-y-6">
            {/* Estadísticas de Cuenta */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-[#024dae]" />
                  <span>Información de Cuenta</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Miembro desde</p>
                    <p className="text-sm text-gray-600">{userData.joinDate}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Ubicación</p>
                    <p className="text-sm text-gray-600">{userData.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

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
        <StyledDialogContent className="w-[30rem] ">
          <StyledDialogHeader>
            <StyledDialogTitle>Actualizar contraseña</StyledDialogTitle>
            <StyledDialogDescription>
              Actualiza tu nueva contraseña
            </StyledDialogDescription>
          </StyledDialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col items-start justify-start gap-2">
              <Label>
                Nueva contraseña
              </Label>
              <Input
                id="password"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                className="bg-white"
              />
            </div>

            <div className="flex flex-col items-start justify-start gap-2">
              <Label>
                Confirmar contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="text"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
                className="bg-white"
              />
            </div>

            {showAlert && (
              <p className="text-red-500">{messageAlert}</p>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                onClick={savePassword}
                variant="animated"
                type="submit"
              >
                <FaRegSave className="self-center size-5" /> Actualizar contraseña
              </Button>
            </div>
          </div>
        </StyledDialogContent>
      </StyledDialog>
    </div>
  )
}
