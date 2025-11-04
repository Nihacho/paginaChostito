<?php
/**
 * API PHP - Verificador de Disponibilidad de Reservas
 * Café Chostito
 * 
 * Este endpoint verifica si hay disponibilidad para una fecha y hora específica
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido. Use POST.'
    ]);
    exit();
}

// Leer datos JSON del body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validar datos recibidos
if (!isset($data['fecha']) || !isset($data['hora'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Faltan parámetros requeridos: fecha y hora'
    ]);
    exit();
}

$fecha = $data['fecha'];
$hora = $data['hora'];

// Configuración del restaurante
$CAPACIDAD_MAXIMA_POR_HORA = 30; // Máximo de personas por hora
$MESAS_DISPONIBLES_POR_HORA = 10; // Máximo de mesas

// Simular consulta a base de datos (en producción, consultarías Firebase o MySQL)
// Por ahora, simulamos una respuesta basada en lógica simple

$horaInt = (int)explode(':', $hora)[0];

// Horas pico (12:00 - 14:00 y 19:00 - 21:00)
$esHoraPico = ($horaInt >= 12 && $horaInt <= 14) || ($horaInt >= 19 && $horaInt <= 21);

// Simular ocupación (en producción consultarías la BD)
$reservasExistentes = rand(0, 8); // Simulación
$personasReservadas = rand(0, 25); // Simulación

$disponible = $reservasExistentes < $MESAS_DISPONIBLES_POR_HORA && 
              $personasReservadas < $CAPACIDAD_MAXIMA_POR_HORA;

// Calcular espacios disponibles
$mesasDisponibles = max(0, $MESAS_DISPONIBLES_POR_HORA - $reservasExistentes);
$espaciosDisponibles = max(0, $CAPACIDAD_MAXIMA_POR_HORA - $personasReservadas);

// Mensaje personalizado
$mensaje = '';
if (!$disponible) {
    $mensaje = 'Lo sentimos, no hay disponibilidad para esta fecha y hora.';
} elseif ($esHoraPico) {
    $mensaje = '¡Hora pico! Te recomendamos reservar pronto. Disponibilidad limitada.';
} elseif ($mesasDisponibles <= 3) {
    $mensaje = '¡Pocas mesas disponibles! Reserva ahora.';
} else {
    $mensaje = 'Disponibilidad confirmada. ¡Reserva con confianza!';
}

// Registrar en log (opcional)
$logEntry = sprintf(
    "[%s] Consulta: Fecha=%s, Hora=%s | Disponible=%s | Mesas=%d | Personas=%d\n",
    date('Y-m-d H:i:s'),
    $fecha,
    $hora,
    $disponible ? 'SI' : 'NO',
    $mesasDisponibles,
    $espaciosDisponibles
);
file_put_contents(__DIR__ . '/availability.log', $logEntry, FILE_APPEND);

// Respuesta JSON
echo json_encode([
    'success' => true,
    'disponible' => $disponible,
    'fecha' => $fecha,
    'hora' => $hora,
    'esHoraPico' => $esHoraPico,
    'mesasDisponibles' => $mesasDisponibles,
    'espaciosDisponibles' => $espaciosDisponibles,
    'mensaje' => $mensaje,
    'timestamp' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);