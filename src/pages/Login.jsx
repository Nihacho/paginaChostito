"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { logActivity, LOG_ACTIONS } from "../utils/logger"

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
  const [generalError, setGeneralError] = useState("")

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
    setGeneralError("")
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
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setGeneralError("")

    const result = await login(formData.email, formData.password)

    if (result.success) {
      // Obtener datos del usuario para comprobar rol
      try {
        const data = await getUserData(result.user.uid)
        if (data?.rol === "admin") {
          navigate("/admin", { replace: true })
        } else {
          navigate(from, { replace: true })
        }
      } catch (err) {
        // Si falla la obtención de datos, navegar a la ruta original
        navigate(from, { replace: true })
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
      }
      setGeneralError(errorMessage)
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido de nuevo!</h2>
            <p className="text-gray-600">Inicia sesión en Café Chostito</p>
            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-3"></div>
          </div>

          {/* Error Message */}
          {generalError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-xl">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-700 font-medium">{generalError}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors"
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
                  className={`w-full pl-12 pr-4 py-4 border ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50/50 focus:bg-white`}
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors"
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
                  type="password"
                  id="password"
                  className={`w-full pl-12 pr-4 py-4 border ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50/50 focus:bg-white`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login