import { useState, useEffect } from "react"
import logoNuevo from "@/assets/img/FWT_logo_blanco.png"
import { LoginForm } from "./LoginForm"
import { PasswordForm } from "./PasswordForm"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"

export const Login = () => {
  const [loading, setLoading] = useState<boolean>(false)

  // Estado para controlar qué formulario mostrar
  const [showLoginForm, setShowLoginForm] = useState(true)
  // Estado para detectar si estamos en versión móvil
  const [isMobile, setIsMobile] = useState(true)

  // Detectar si estamos en versión móvil o desktop
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Comprobar al cargar
    checkIfMobile()

    // Comprobar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Función para cambiar al formulario de recuperación
  const handleForgotPassword = () => {
    if (isMobile) {
      // En móvil, simplemente cambiamos el formulario
      setShowLoginForm(false)
    } else {
      // Después de un breve retraso, cambiamos el formulario
      setTimeout(() => {
        setShowLoginForm(false)
      }, 300) // Mitad del tiempo de la transición
    }
  }

  // Función para volver al formulario de login
  const handleBackToLogin = () => {
    setShowLoginForm(true)
  }

  // Cuando la animación termina y volvemos al login, resetear el estado
  // useEffect(() => {
  //   if (showLoginForm && !isMobile) {
  //     const timer = setTimeout(() => {
  //       setIsAnimating(false)
  //     }, 600)
  //     return () => clearTimeout(timer)
  //   }
  // }, [showLoginForm, isMobile])

  return (
    <div className="bg-linear-to-tr from-blue-900 to-[#3089FD] h-screen flex items-center justify-center font-sans">

      {loading && (
        <ScreenLoader />
      )}
      <div className="bg-gray-100 rounded-2xl shadow-2xl lg:w-4xl w-[90%] h-1/2 lg:h-128 flex overflow-hidden relative ">
        {/* Contenedor para el formulario de login (siempre presente en desktop) */}
        <div className="lg:w-1/2 w-full  p-4 my-auto">
          {/* Solo mostrar en móvil o en desktop cuando showLoginForm es true */}
          {(isMobile && showLoginForm) || !isMobile ? (
            <div className={`${!isMobile && !showLoginForm ? "" : "visible"}`}>

              <div className="text-center cursor-default mb-4 space-y-3 text-[0.78rem]">
                <div className="bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent manrope text-2xl font-bold mb-1">¡Bienvenido!</div>
                <div className="text-gray-600 manrope text-lg ml-1">Sistema de Gestión de Procesos Wayu Taya</div>
              </div>

              <LoginForm onForgotPassword={handleForgotPassword} setLoading={setLoading} loading={loading} />
            </div>
          ) : null}

          {/* Mostrar formulario de recuperación solo en móvil cuando showLoginForm es false */}
          {isMobile && !showLoginForm ? (
            <div className="my-auto">

              <div className="text-center cursor-default mb-4 space-y-3 text-[0.78rem]">
                <div className="text-gray-800 manrope text-xl ml-1 mb-2">Recupera tu contraseña....</div>
              </div>

              <PasswordForm onBackToLogin={handleBackToLogin} />
            </div>
          ) : null}
        </div>

        {/* En desktop: Div azul que se desliza */}
        {!isMobile && (
          <div
            className={`
              w-1/2 p-8 bg-linear-to-br from-[#024dae] to-[#3089FD] rounded-xl flex flex-wrap items-center justify-start text-white
              absolute h-full z-10 transition-all duration-600 ease-in-out  
              ${showLoginForm ? 'right-0 animate-slide-left' : 'right-0 animate-slide-right'}
            `}
          >
            <img
              src={logoNuevo || "/placeholder.svg"}
              alt=""
              className=""
            />
            {/* <div className="flex flex-col text-center cursor-default w-full ">
              <span className="oswald font-normal text-4xl">FUNDACIÓN</span>
              <span className="julius-sans-one-regular text-[2.5rem] border-y-2 border-white">WAYUU TAYA</span>
            </div> */}
          </div>
        )}


        {/* En desktop: Contenedor para el formulario de recuperación (siempre presente) */}
        {!isMobile && (
          <div className="w-1/2 ml-auto my-auto bg-gray-100 p-4">
            <div className={`${!isMobile && showLoginForm ? "" : "visible"}`}>

              <div className="text-center cursor-default lg:mb-4 space-y-3 text-[0.78rem]">
                <div className="text-slate-800 manrope lg:text-xl ml-1">Recupera tu contraseña....</div>
              </div>

              <PasswordForm onBackToLogin={handleBackToLogin} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
