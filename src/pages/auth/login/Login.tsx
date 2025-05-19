import { useState, useEffect } from "react"
import logo from "@/assets/img/logo.png"
import { LoginForm } from "./LoginForm"
import { PasswordForm } from "./PasswordForm"

export const Login = () => {
  // Estado para controlar qué formulario mostrar
  const [showLoginForm, setShowLoginForm] = useState(true)
  // Estado para controlar la animación
  const [isAnimating, setIsAnimating] = useState(false)
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
      // En desktop, activamos la animación
      setIsAnimating(true)
      // Después de un breve retraso, cambiamos el formulario
      setTimeout(() => {
        setShowLoginForm(false)
      }, 300) // Mitad del tiempo de la transición
    }
  }

  // Función para volver al formulario de login
  const handleBackToLogin = () => {
    if (isMobile) {
      // En móvil, simplemente cambiamos el formulario
      setShowLoginForm(true)
    } else {
      // En desktop, activamos la animación de vuelta
      setIsAnimating(true)
      // Después de un breve retraso, cambiamos el formulario
      setTimeout(() => {
        setShowLoginForm(true)
      }, 300) // Mitad del tiempo de la transición

      // Desactivamos la animación después de completarse
      setTimeout(() => {
        setIsAnimating(false)
      }, 600) // Tiempo completo de la transición
    }
  }

  // Cuando la animación termina y volvemos al login, resetear el estado
  useEffect(() => {
    if (showLoginForm && !isMobile) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [showLoginForm, isMobile])

  return (
    <div className="bg-gradient-to-tr from-[#3449D5] to-[#34A8D5] h-screen flex items-center justify-center font-sans">
      <div className="bg-white rounded-2xl shadow-2xl lg:w-full lg:max-w-4xl w-65 h-[23rem] lg:h-[32rem] flex overflow-hidden relative ">
        {/* Contenedor para el formulario de login (siempre presente en desktop) */}
        <div className="lg:w-1/2 w-full bg-gray-100 p-4">
          {/* Solo mostrar en móvil o en desktop cuando showLoginForm es true */}
          {(isMobile && showLoginForm) || !isMobile ? (
            <div className={`${!isMobile && !showLoginForm ? "invisible" : "visible"}`}>
              <div className="flex items-center w-full cursor-default -mb-3">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="logo"
                  className="w-12 m-2 lg:w-20 lg:h-20 drop-shadow-gray-500 drop-shadow-lg"
                />
                <div className="lg:ml-2 text-[1rem] mr-2 julius-sans-one-regular lg:text-[2.5rem] text-[#34A8D5] text-shadow2">
                  WAYUU TAYA
                </div>
              </div>

              <div className="text-center cursor-default lg:mb-4 space-y-3 text-[0.78rem]">
                <div className="text-[#34A8D5] manrope lg:text-xl mb-1">¡Bienvenido!</div>
                <div className="text-gray-500 manrope lg:text-xl opacity-70 ml-1">Ingresa tus datos....</div>
              </div>

              <LoginForm onForgotPassword={handleForgotPassword} />
            </div>
          ) : null}

          {/* Mostrar formulario de recuperación solo en móvil cuando showLoginForm es false */}
          {isMobile && !showLoginForm ? (
            <div>
              <div className="flex items-center w-full cursor-default -mb-3">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="logo"
                  className="w-12 m-2 lg:w-20 lg:h-20 drop-shadow-gray-500 drop-shadow-lg"
                />
                <div className="lg:ml-2 text-[1rem] mr-2 julius-sans-one-regular lg:text-[2.5rem] text-[#34A8D5] text-shadow2">
                  WAYUU TAYA
                </div>
              </div>

              <div className="text-center cursor-default lg:mb-4 space-y-3 text-[0.78rem]">
                <div className="text-gray-500 manrope lg:text-xl opacity-70 ml-1 mb-2">Recupera tu contraseña....</div>
              </div>

              <PasswordForm onBackToLogin={handleBackToLogin} />
            </div>
          ) : null}
        </div>

        {/* En desktop: Div azul que se desliza */}
        {!isMobile && (
          <div
            className={`
              w-1/2 p-8 bg-[#3449D5] rounded-xl flex flex-wrap items-center justify-start text-black
              absolute h-full z-10 transition-all duration-600 ease-in-out 
              ${showLoginForm ? "right-0 translate-x-0" : "left-0 translate-x-[-100]"}
              ${isAnimating && showLoginForm ? "animate-slide-right" : ""}
              ${isAnimating && !showLoginForm ? "animate-slide-left" : ""}
            `}
          >
            <img
              src={logo || "/placeholder.svg"}
              alt=""
              className="w-20 h-20 mt-[3rem] drop-shadow-black drop-shadow-lg"
            />
            <div className="flex flex-col text-center cursor-default">
              <span className="oswald font-normal text-4xl">FUNDACIÓN</span>
              <span className="julius-sans-one-regular text-[2.5rem] border-y-2 border-black">WAYUU TAYA</span>
            </div>
          </div>
        )}

        {/* En desktop: Contenedor para el formulario de recuperación (siempre presente) */}
        {!isMobile && (
          <div className="w-1/2 ml-auto bg-gray-100 p-4">
            <div className={`${!isMobile && showLoginForm ? "invisible" : "visible"}`}>
              <div className="flex items-center w-full cursor-default -mb-3">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="logo"
                  className="w-12 m-2 lg:w-20 lg:h-20 drop-shadow-gray-500 drop-shadow-lg"
                />
                <div className="lg:ml-2 text-[1rem] mr-2 julius-sans-one-regular lg:text-[2.5rem] text-[#34A8D5] text-shadow2">
                  WAYUU TAYA
                </div>
              </div>

              <div className="text-center cursor-default lg:mb-4 space-y-3 text-[0.78rem]">
                <div className="text-gray-500 manrope lg:text-xl opacity-70 ml-1">Recupera tu contraseña....</div>
              </div>

              <PasswordForm onBackToLogin={handleBackToLogin} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
