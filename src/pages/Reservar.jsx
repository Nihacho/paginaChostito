"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { db } from "../firebase/config"
import { useAuth } from "../context/AuthContext"
import { logActivity, LOG_ACTIONS } from "../utils/logger"

function Reservar() {
  const navigate = useNavigate()
  const { user, userData } = useAuth()

  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    personas: "2",
    comentarios: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availabilityInfo, setAvailabilityInfo] = useState(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  const CAPACIDAD_MAXIMA = 30
  const MESAS_MAXIMAS = 10

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

  // Verificar disponibilidad en Firestore
  const checkAvailability = async () => {
    if (!formData.fecha || !formData.hora) {
      setAvailabilityInfo(null)
      return
    }

    setCheckingAvailability(true)

    try {
      // Consultar reservas en la misma fecha y hora
      const q = query(
        collection(db, "reservas"),
        where("fecha", "==", formData.fecha),
        where("hora", "==", formData.hora),
        where("estado", "==", "confirmada")
      )

      const snapshot = await getDocs(q)
      const reservasExistentes = snapshot.docs.map(doc => doc.data())

      // Calcular ocupación
      const numReservas = reservasExistentes.length
      const personasReservadas = reservasExistentes.reduce((total, r) => {
        const personas = parseInt(r.personas) || 0
        return total + personas
      }, 0)

      const mesasDisponibles = MESAS_MAXIMAS - numReservas
      const espaciosDisponibles = CAPACIDAD_MAXIMA - personasReservadas
      const disponible = mesasDisponibles > 0 && espaciosDisponibles > 0

      // Verificar si es hora pico
      const horaInt = parseInt(formData.hora.split(':')[0])
      const esHoraPico = (horaInt >= 12 && horaInt <= 14) || (horaInt >= 19 && horaInt <= 21)

      let mensaje = ''
      let tipo = 'success'

      if (!disponible) {
        mensaje = '⚠️ Lo sentimos, no hay disponibilidad para esta fecha y hora.'
        tipo = 'error'
      } else if (mesasDisponibles <= 2) {
        mensaje = `⚡ ¡Solo ${mesasDisponibles} mesa(s) disponible(s)! Reserva ahora.`
        tipo = 'warning'
      } else if (esHoraPico) {
        mensaje = '🔥 Hora pico - Alta demanda. ¡Reserva pronto!'
        tipo = 'warning'
      } else {
        mensaje = `✅ Disponibilidad confirmada - ${mesasDisponibles} mesas libres`
        tipo = 'success'
      }

      setAvailabilityInfo({
        disponible,
        mesasDisponibles,
        espaciosDisponibles,
        mensaje,
        tipo,
        esHoraPico
      })

    } catch (error) {
      console.error("Error verificando disponibilidad:", error)
    } finally {
      setCheckingAvailability(false)
    }
  }

  // Verificar disponibilidad cuando cambien fecha u hora
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAvailability()
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.fecha, formData.hora])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fecha) {
      newErrors.fecha = "La fecha es obligatoria"
    } else {
      const selectedDate = new Date(formData.fecha)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        newErrors.fecha = "La fecha no puede ser en el pasado"
      }
    }

    if (!formData.hora) {
      newErrors.hora = "La hora es obligatoria"
    }

    // Verificar disponibilidad
    if (availabilityInfo && !availabilityInfo.disponible) {
      newErrors.hora = "No hay disponibilidad para esta fecha y hora"
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

    try {
      const reservaData = {
        userId: user.uid,
        nombre: userData?.nombre || user.displayName || "Usuario",
        email: user.email,
        telefono: userData?.telefono || "",
        fecha: formData.fecha,
        hora: formData.hora,
        personas: formData.personas,
        comentarios: formData.comentarios,
        estado: "confirmada",
        createdAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "reservas"), reservaData)
      console.log("✅ Reserva creada con ID:", docRef.id)

      navigate("/confirmacion-reserva", { state: { reservaId: docRef.id } })
    } catch (error) {
      console.error("Error al crear reserva:", error)
      alert("Error al crear la reserva. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const horasDisponibles = []
  for (let i = 9; i <= 21; i++) {
    horasDisponibles.push(`${i}:00`)
    if (i < 21) {
      horasDisponibles.push(`${i}:30`)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <br />
        <br /> <br /><br />
        <h1 className="section-title">Reserva tu Mesa</h1>
        <div className="section-divider"></div>
        <p className="section-subtitle">Completa el formulario para reservar tu mesa en Café Chostito</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Info del usuario */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">
                {userData?.nombre?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{userData?.nombre || "Usuario"}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fecha" className="form-label">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="fecha"
                  className={`form-input ${errors.fecha ? "border-red-500" : ""}`}
                  min={today}
                  value={formData.fecha}
                  onChange={handleChange}
                />
                {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>}
              </div>

              <div>
                <label htmlFor="hora" className="form-label">
                  Hora <span className="text-red-500">*</span>
                </label>
                <select
                  id="hora"
                  className={`form-input ${errors.hora ? "border-red-500" : ""}`}
                  value={formData.hora}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una hora</option>
                  {horasDisponibles.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
                {errors.hora && <p className="text-red-500 text-sm mt-1">{errors.hora}</p>}
                
                {/* Indicador de verificación */}
                {checkingAvailability && (
                  <div className="mt-2 flex items-center text-blue-600 text-sm">
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando disponibilidad...
                  </div>
                )}

                {/* Mensaje de disponibilidad */}
                {availabilityInfo && !checkingAvailability && (
                  <div className={`mt-2 p-3 rounded-lg text-sm font-medium ${
                    availabilityInfo.tipo === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                    availabilityInfo.tipo === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                    'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {availabilityInfo.mensaje}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="personas" className="form-label">
                Número de personas <span className="text-red-500">*</span>
              </label>
              <select id="personas" className="form-input" value={formData.personas} onChange={handleChange}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "persona" : "personas"}
                  </option>
                ))}
                <option value="9+">9+ personas</option>
              </select>
            </div>

            <div>
              <label htmlFor="comentarios" className="form-label">
                Comentarios adicionales
              </label>
              <textarea
                id="comentarios"
                rows={4}
                className="form-input"
                placeholder="Peticiones especiales, alergias, etc."
                value={formData.comentarios}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="text-center">
              <button 
                type="submit" 
                className="btn w-full md:w-auto px-8" 
                disabled={isSubmitting || (availabilityInfo && !availabilityInfo.disponible)}
              >
                {isSubmitting ? "Procesando..." : "Confirmar Reserva"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg border-l-4 border-green-600 overflow-hidden">
          <div className="bg-green-600 text-white p-4">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Información Importante</h3>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="bg-yellow-500 rounded-full p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-bold text-yellow-800">Tiempo Mínimo</span>
                </div>
                <p className="text-yellow-700 text-sm font-medium">
                  Reserva con <strong>2 horas</strong> de anticipación
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-500 rounded-full p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <span className="font-bold text-blue-800">Grupos Grandes</span>
                </div>
                <p className="text-blue-700 text-sm font-medium">
                  <strong>+8 personas:</strong> llámanos al <br />
                  <span className="font-bold">(01) 234-5678</span>
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="bg-red-500 rounded-full p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-bold text-red-800">Tiempo de Espera</span>
                </div>
                <p className="text-red-700 text-sm font-medium">
                  Mantenemos tu mesa <strong>15 min</strong> después de la hora
                </p>
              </div>
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">💡</span>
                <span className="font-bold text-green-800">Consejo Especial</span>
              </div>
              <p className="text-green-700 font-medium">
                ¡Llega <strong>5 minutos antes</strong> para disfrutar mejor tu experiencia en Café Chostito!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reservar