"use client"

import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useReservas } from "../context/ReservasContext"

function ConfirmacionReserva() {
  const { currentReserva } = useReservas()
  const navigate = useNavigate()

  // Si no hay reserva actual, redirigir a la página de reservas
  useEffect(() => {
    if (!currentReserva) {
      navigate("/reservar")
    }
  }, [currentReserva, navigate])

  if (!currentReserva) {
    return null // No renderizar nada mientras se redirige
  }

  // Formatear la fecha para mostrarla
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">¡Reserva Confirmada!</h1>
            <p className="text-gray-600 mb-6">Gracias por reservar con nosotros. Esperamos verte pronto.</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Detalles de tu reserva</h2>
            <div className="space-y-3 text-left">
              <p>
                <span className="font-semibold">Nombre:</span> {currentReserva.nombre}
              </p>
              <p>
                <span className="font-semibold">Fecha:</span> {formatearFecha(currentReserva.fecha)}
              </p>
              <p>
                <span className="font-semibold">Hora:</span> {currentReserva.hora}
              </p>
              <p>
                <span className="font-semibold">Personas:</span> {currentReserva.personas}
              </p>
              {currentReserva.comentarios && (
                <p>
                  <span className="font-semibold">Comentarios:</span> {currentReserva.comentarios}
                </p>
              )}
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Hemos enviado un correo electrónico con los detalles de tu reserva.
              <br />
              Si necesitas modificar o cancelar tu reserva, por favor contáctanos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn">
                Volver al Inicio
              </Link>
              <Link to="/menu" className="btn btn-secondary">
                Ver Menú
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmacionReserva
