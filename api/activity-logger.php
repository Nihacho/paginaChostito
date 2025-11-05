<?php
/**
 * Sistema de Logs y Auditoría - Café Chostito
 * Registra todas las actividades importantes del sistema
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

// Leer datos
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validar datos
if (!isset($data['action']) || !isset($data['user'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Faltan parámetros']);
    exit();
}

// Datos del log
$timestamp = date('Y-m-d H:i:s');
$action = $data['action'];
$user = $data['user'];
$details = $data['details'] ?? '';
$ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

// Crear línea de log
$logLine = sprintf(
    "[%s] | IP: %s | Usuario: %s | Acción: %s | Detalles: %s | UserAgent: %s\n",
    $timestamp,
    $ip,
    $user,
    $action,
    $details,
    $userAgent
);

// Guardar en archivo
$logFile = __DIR__ . '/logs/activity_' . date('Y-m') . '.log';
$logDir = dirname($logFile);

// Crear directorio si no existe
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

// Escribir log
$success = file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);

// También guardar logs críticos en un archivo especial
if (in_array($action, ['RESERVA_CREADA', 'RESERVA_CANCELADA', 'LOGIN', 'REGISTER'])) {
    $criticalLog = __DIR__ . '/logs/critical_' . date('Y-m') . '.log';
    file_put_contents($criticalLog, $logLine, FILE_APPEND | LOCK_EX);
}

// Respuesta
if ($success !== false) {
    echo json_encode([
        'success' => true,
        'message' => 'Log registrado correctamente',
        'timestamp' => $timestamp,
        'action' => $action
    ], JSON_PRETTY_PRINT);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al guardar el log'
    ]);
}

// BONUS: Función para limpiar logs antiguos (más de 6 meses)
function cleanOldLogs() {
    $logDir = __DIR__ . '/logs/';
    if (!is_dir($logDir)) return;
    
    $files = glob($logDir . '*.log');
    $sixMonthsAgo = strtotime('-6 months');
    
    foreach ($files as $file) {
        if (filemtime($file) < $sixMonthsAgo) {
            unlink($file);
        }
    }
}

// Ejecutar limpieza 1 de cada 100 requests (1%)
if (rand(1, 100) === 1) {
    cleanOldLogs();
}