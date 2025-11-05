// src/utils/logger.js
/**
 * Utilidad para enviar logs al servidor PHP
 * Café Chostito - Sistema de Auditoría
 */

const PHP_API_URL = "http://localhost/cafe-chostito-api/activity-logger.php"

/**
 * Envía un log de actividad al servidor PHP
 * @param {string} action - Tipo de acción (RESERVA_CREADA, LOGIN, etc.)
 * @param {string} user - Email o nombre del usuario
 * @param {string} details - Detalles adicionales
 */
export const logActivity = async (action, user, details = "") => {
  try {
    const response = await fetch(PHP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: action,
        user: user,
        details: details,
      }),
    })

    const data = await response.json()
    
    if (data.success) {
      console.log(`📝 Log registrado: ${action}`)
    }
  } catch (error) {
    // Silencioso - no queremos que falle la app si el log falla
    console.warn("⚠️ No se pudo enviar log:", error.message)
  }
}

// Acciones predefinidas para consistencia
export const LOG_ACTIONS = {
  RESERVA_CREADA: "RESERVA_CREADA",
  RESERVA_CANCELADA: "RESERVA_CANCELADA",
  RESERVA_ACTUALIZADA: "RESERVA_ACTUALIZADA",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  REGISTER: "REGISTER",
  PERFIL_ACTUALIZADO: "PERFIL_ACTUALIZADO",
  ERROR: "ERROR",
}

export default logActivity