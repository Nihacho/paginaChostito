"use client"

import { createContext, useState, useContext, useEffect } from "react"

const ReservasContext = createContext()

export const useReservas = () => {
  const context = useContext(ReservasContext)
  if (!context) {
    throw new Error("useReservas debe ser usado dentro de ReservasProvider")
  }
  return context
}

export const ReservasProvider = ({ children }) => {
  const [reservas, setReservas] = useState([])
  const [currentReserva, setCurrentReserva] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar reservas del localStorage al iniciar
  useEffect(() => {
    try {
      console.log("🔄 Cargando reservas del localStorage...")
      const storedReservas = localStorage.getItem("cafe-chostito-reservas")

      if (storedReservas && storedReservas !== "undefined") {
        const parsedReservas = JSON.parse(storedReservas)
        console.log("✅ Reservas encontradas:", parsedReservas)
        setReservas(Array.isArray(parsedReservas) ? parsedReservas : [])
      } else {
        console.log("ℹ️ No hay reservas guardadas, iniciando con array vacío")
        setReservas([])
      }
    } catch (error) {
      console.error("❌ Error al cargar reservas:", error)
      setReservas([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Guardar reservas en localStorage cuando cambian
  useEffect(() => {
    if (!isLoading && reservas.length >= 0) {
      try {
        console.log("💾 Guardando reservas:", reservas)
        localStorage.setItem("cafe-chostito-reservas", JSON.stringify(reservas))

        // Disparar evento personalizado para notificar cambios
        window.dispatchEvent(
          new CustomEvent("reservasUpdated", {
            detail: { reservas },
          }),
        )
      } catch (error) {
        console.error("❌ Error al guardar reservas:", error)
      }
    }
  }, [reservas, isLoading])

  // Escuchar cambios en localStorage desde otras pestañas/ventanas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "cafe-chostito-reservas") {
        try {
          const newReservas = JSON.parse(e.newValue || "[]")
          console.log("🔄 Reservas actualizadas desde otra pestaña:", newReservas)
          setReservas(newReservas)
        } catch (error) {
          console.error("❌ Error al sincronizar reservas:", error)
        }
      }
    }

    const handleCustomEvent = (e) => {
      console.log("🔄 Evento personalizado recibido:", e.detail)
      setReservas(e.detail.reservas)
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("reservasUpdated", handleCustomEvent)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("reservasUpdated", handleCustomEvent)
    }
  }, [])

  // Añadir una nueva reserva
  const addReserva = (nuevaReserva) => {
    const reservaConId = {
      ...nuevaReserva,
      id: `reserva_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("➕ Añadiendo nueva reserva:", reservaConId)

    setReservas((prevReservas) => {
      const nuevasReservas = [...prevReservas, reservaConId]
      console.log("📋 Lista actualizada de reservas:", nuevasReservas)
      return nuevasReservas
    })

    setCurrentReserva(reservaConId)
    return reservaConId
  }

  // Eliminar una reserva
  const deleteReserva = (id) => {
    console.log("🗑️ Eliminando reserva:", id)
    setReservas((prevReservas) => {
      const nuevasReservas = prevReservas.filter((reserva) => reserva.id !== id)
      console.log("📋 Reservas después de eliminar:", nuevasReservas)
      return nuevasReservas
    })
  }

  // Actualizar una reserva
  const updateReserva = (id, datosActualizados) => {
    console.log("✏️ Actualizando reserva:", id, datosActualizados)
    setReservas((prevReservas) =>
      prevReservas.map((reserva) =>
        reserva.id === id ? { ...reserva, ...datosActualizados, updatedAt: new Date().toISOString() } : reserva,
      ),
    )
  }

  // Función para refrescar reservas manualmente
  const refreshReservas = () => {
    try {
      const storedReservas = localStorage.getItem("cafe-chostito-reservas")
      if (storedReservas) {
        const parsedReservas = JSON.parse(storedReservas)
        console.log("🔄 Refrescando reservas:", parsedReservas)
        setReservas(parsedReservas)
      }
    } catch (error) {
      console.error("❌ Error al refrescar reservas:", error)
    }
  }

  const contextValue = {
    reservas,
    addReserva,
    deleteReserva,
    updateReserva,
    currentReserva,
    setCurrentReserva,
    refreshReservas,
    isLoading,
  }

  console.log("🔍 Estado actual del contexto:", contextValue)

  return <ReservasContext.Provider value={contextValue}>{children}</ReservasContext.Provider>
}
