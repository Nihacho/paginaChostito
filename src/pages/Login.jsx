"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { logActivity, LOG_ACTIONS } from "../utils/logger"
import toast, { Toaster } from "react-hot-toast"

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, getUserData } = useAuth()
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Obtener la ruta a la que quería ir (si fue redirigido)
  const from = location.state?.from?.pathname || "/"

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingrese un email válido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Por favor corrige los errores del formulario")
      return
    }

    setIsSubmitting(true)

    const loadingToast = toast.loading("Iniciando sesión...")

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        // Log del login exitoso
        await logActivity(LOG_ACTIONS.LOGIN, result.user.email, {
          uid: result.user.uid,
          timestamp: new Date().toISOString()
        })

        toast.success("¡Bienvenido de nuevo!", { id: loadingToast })

        // Obtener datos del usuario para comprobar rol
        try {
          const data = await getUserData(result.user.uid)
          
          setTimeout(() => {
            if (data?.rol === "admin") {
              navigate("/admin-true", { replace: true })
            } else if (data?.rol === "empleado") {
              navigate("/admin", { replace: true })
            } else {
              navigate(from, { replace: true })
            }
          }, 800)
        } catch (err) {
          setTimeout(() => {
            navigate(from, { replace: true })
          }, 800)
        }
      } else {
        // Mensajes de error más amigables
        let errorMessage = "Error al iniciar sesión"
        
        if (result.error.includes("user-not-found")) {
          errorMessage = "No existe una cuenta con este email"
        } else if (result.error.includes("wrong-password")) {
          errorMessage = "Contraseña incorrecta"
        } else if (result.error.includes("invalid-credential")) {
          errorMessage = "Email o contraseña incorrectos"
        } else if (result.error.includes("too-many-requests")) {
          errorMessage = "Demasiados intentos. Intenta más tarde"
        } else if (result.error.includes("network-request-failed")) {
          errorMessage = "Error de conexión. Verifica tu internet"
        }

        toast.error(errorMessage, { id: loadingToast })

        // Log del error
        await logActivity(LOG_ACTIONS.ERROR, formData.email, {
          action: "login_failed",
          error: result.error
        })
      }
    } catch (error) {
      console.error("Error en login:", error)
      toast.error("Error inesperado. Intenta de nuevo", { id: loadingToast })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      
      <div className="login-page">
        <div className="login-container">
          {/* Card Principal */}
          <div className="login-card">
            {/* Header con degradado */}
            <div className="login-header">
              {/* Pattern de fondo */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>
              
              <div className="relative">
                <div className="login-avatar">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="login-title">Iniciar Sesión</h2>
                <p className="login-subtitle">Bienvenido de nuevo a Café Chostito ☕</p>
              </div>
            </div>

            {/* Formulario */}
            <div className="login-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="form-group">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-3 w-3 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      autoComplete="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center font-medium">
                      <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="form-group">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-3 w-3 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-green-600 hover:text-green-700 transition-colors"
                    >
                        {showPassword ? (
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center font-medium">
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="login-submit btn"
                  disabled={isSubmitting}
                >
                      <svg className="animate-spin h-3 w-3 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      Iniciando sesión...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Iniciar Sesión
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="login-divider">
                <span>¿No tienes cuenta?</span>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link to="/register" className="btn btn-white">
                  <svg className="w-3 h-3 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Crear cuenta nueva
                </Link>
              </div>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center text-base text-white hover:text-green-200 transition-colors font-medium"
            >
              <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login