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
    echo json_encode(['success' => false, 'message' => 'Método no permitido. Use POST']);
    exit();
}

// Leer datos
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Log de debug (temporal)
error_log("📥 Logger recibió: " . print_r($data, true));

// Validar datos
if (!isset($data['action']) || !isset($data['user'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Faltan parámetros requeridos',
        'received' => $data
    ]);
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
    substr($userAgent, 0, 100) // Truncar user agent
);

// Definir ruta de logs
$logDir = __DIR__ . '/logs';
$logFile = $logDir . '/activity_' . date('Y-m') . '.log';

// Crear directorio si no existe
if (!is_dir($logDir)) {
    $created = mkdir($logDir, 0777, true);
    if (!$created) {
        error_log("❌ No se pudo crear directorio: $logDir");
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al crear directorio de logs',
            'path' => $logDir
        ]);
        exit();
    }
    chmod($logDir, 0777); // Dar permisos completos
}

// Escribir log
$success = file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);

if ($success === false) {
    error_log("❌ Error escribiendo en: $logFile");
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al escribir log',
        'file' => $logFile
    ]);
    exit();
}

// También guardar logs críticos
if (in_array($action, ['RESERVA_CREADA', 'RESERVA_CANCELADA', 'LOGIN', 'REGISTER'])) {
    $criticalLog = $logDir . '/critical_' . date('Y-m') . '.log';
    file_put_contents($criticalLog, $logLine, FILE_APPEND | LOCK_EX);
}

// Respuesta exitosa
echo json_encode([
    'success' => true,
    'message' => 'Log registrado correctamente',
    'timestamp' => $timestamp,
    'action' => $action,
    'file' => basename($logFile),
    'bytes_written' => $success
], JSON_PRETTY_PRINT);

// Función para limpiar logs antiguos
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

// Ejecutar limpieza ocasionalmente
if (rand(1, 100) === 1) {
    cleanOldLogs();
}
?>
