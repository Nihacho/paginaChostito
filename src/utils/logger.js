// src/utils/logger.js
/**
 * Utilidad para enviar logs al servidor PHP
 * Café Chostito - Sistema de Auditoría
 */

// Endpoint del logger PHP - AJUSTA ESTA URL A TU CONFIGURACIÓN
const PHP_API_URL = "http://localhost/paginaChostito/api/activity-logger.php"

/**
 * Envía un log de actividad al servidor PHP
 * @param {string} action - Tipo de acción (RESERVA_CREADA, LOGIN, etc.)
 * @param {string} user - Email o UID del usuario
 * @param {object|string} details - Detalles adicionales (puede ser objeto o string)
 * @returns {Promise<boolean>} - true si se registró exitosamente
 */
export const logActivity = async (action, user, details = "") => {
  try {
    // Preparar datos
    const logData = {
      action: action,
      user: user,
      details: typeof details === 'object' ? details : { message: details }
    }

    console.log("📤 Enviando log:", logData)

    const response = await fetch(PHP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logData),
    })

    // Intentar parsear respuesta JSON
    let data = null
    const contentType = response.headers.get("content-type")
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      const textResponse = await response.text()
      console.warn("⚠️ Logger: respuesta no es JSON:", textResponse.substring(0, 200))
      return false
    }

    if (response.ok && data?.success) {
      console.log(`✅ Log registrado: ${action} - ${data.message}`)
      return true
    } else {
      console.warn("⚠️ Logger: error desde endpoint", {
        status: response.status,
        data: data
      })
      return false
    }
  } catch (error) {
    // Silencioso - no queremos que falle la app si el log falla
    console.warn("⚠️ No se pudo enviar log:", {
      error: error.message,
      action: action,
      user: user
    })
    return false
  }
}

/**
 * Versión simplificada para logs rápidos
 */
export const quickLog = (action, user) => {
  logActivity(action, user).catch(() => {
    // Silencioso
  })
}

// Acciones predefinidas para consistencia
export const LOG_ACTIONS = {
  // Reservas
  RESERVA_CREADA: "RESERVA_CREADA",
  RESERVA_CANCELADA: "RESERVA_CANCELADA",
  RESERVA_ACTUALIZADA: "RESERVA_ACTUALIZADA",
  
  // Autenticación
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  REGISTER: "REGISTER",
  
  // Perfil
  PERFIL_ACTUALIZADO: "PERFIL_ACTUALIZADO",
  PERFIL_VISTO: "PERFIL_VISTO",
  
  // Sistema
  ERROR: "ERROR",
  PAGE_VIEW: "PAGE_VIEW",
}

export default logActivity