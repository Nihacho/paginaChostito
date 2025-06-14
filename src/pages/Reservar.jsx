"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useReservas } from "../context/ReservasContext"

function Reservar() {
  const navigate = useNavigate()
  const { addReserva } = useReservas()

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    fecha: "",
    hora: "",
    personas: "2",
    comentarios: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Limpiar error cuando el usuario comienza a escribir
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio"
    } else if (!/^\d{8}$/.test(formData.telefono.trim())) {
      newErrors.telefono = "Ingrese un número de teléfono de 8 cifras"
    }

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simular un tiempo de procesamiento
    setTimeout(() => {
      const nuevaReserva = {
        ...formData,
        estado: "confirmada",
      }

      addReserva(nuevaReserva)
      navigate("/confirmacion-reserva")
      setIsSubmitting(false)
    }, 1000)
  }

  // Generar opciones de horas disponibles (9:00 AM - 9:00 PM)
  const horasDisponibles = []
  for (let i = 9; i <= 21; i++) {
    horasDisponibles.push(`${i}:00`)
    if (i < 21) {
      horasDisponibles.push(`${i}:30`)
    }
  }

  // Obtener la fecha mínima (hoy)
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="section-title">Reserva tu Mesa</h1>
        <div className="section-divider"></div>
        <p className="section-subtitle">Completa el formulario para reservar tu mesa en Café Chostito</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nombre" className="form-label">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  className={`form-input ${errors.nombre ? "border-red-500" : ""}`}
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>

              <div>
                <label htmlFor="telefono" className="form-label">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="telefono"
                  className={`form-input ${errors.telefono ? "border-red-500" : ""}`}
                  placeholder="12345678"
                  value={formData.telefono}
                  onChange={handleChange}
                />
                {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
              </div>
            </div>

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
              <button type="submit" className="btn w-full md:w-auto px-8" disabled={isSubmitting}>
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
