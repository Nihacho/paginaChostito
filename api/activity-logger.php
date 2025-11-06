<?php
/**
 * Sistema de Logs y Auditoría - Café Chostito
 * Registra todas las actividades importantes del sistema
 * Ruta: /paginaChostito/api/activity-logger.php
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
        'message' => 'Faltan parámetros requeridos (action, user)',
        'received' => $data
    ]);
    exit();
}

// Datos del log
$timestamp = date('Y-m-d H:i:s');
$action = $data['action'];
$user = $data['user'];
$details = isset($data['details']) ? json_encode($data['details']) : '';
$ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

// Crear línea de log mejorada
$logLine = sprintf(
    "[%s] | IP: %s | Usuario: %s | Acción: %s | Detalles: %s | UserAgent: %s\n",
    $timestamp,
    $ip,
    $user,
    $action,
    $details,
    substr($userAgent, 0, 100) // Truncar user agent
);

// Definir ruta de logs (relativa al archivo PHP)
$logDir = __DIR__ . '/logs';
$logFile = $logDir . '/activity_' . date('Y-m') . '.log';

// Crear directorio si no existe
if (!is_dir($logDir)) {
    $created = @mkdir($logDir, 0777, true);
    if (!$created) {
        error_log("❌ No se pudo crear directorio: $logDir");
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al crear directorio de logs',
            'path' => $logDir,
            'parent_writable' => is_writable(dirname($logDir))
        ]);
        exit();
    }
    @chmod($logDir, 0777);
}

// Verificar si el directorio es escribible
if (!is_writable($logDir)) {
    error_log("❌ Directorio no escribible: $logDir");
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Directorio de logs no es escribible',
        'path' => $logDir,
        'permissions' => substr(sprintf('%o', fileperms($logDir)), -4)
    ]);
    exit();
}

// Escribir log
$success = @file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);

if ($success === false) {
    $error = error_get_last();
    error_log("❌ Error escribiendo en: $logFile - " . print_r($error, true));
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al escribir log',
        'file' => $logFile,
        'error' => $error['message'] ?? 'Unknown error'
    ]);
    exit();
}

// También guardar logs críticos
if (in_array($action, ['RESERVA_CREADA', 'RESERVA_CANCELADA', 'LOGIN', 'REGISTER'])) {
    $criticalLog = $logDir . '/critical_' . date('Y-m') . '.log';
    @file_put_contents($criticalLog, $logLine, FILE_APPEND | LOCK_EX);
}

// Respuesta exitosa
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Log registrado correctamente',
    'timestamp' => $timestamp,
    'action' => $action,
    'file' => basename($logFile),
    'bytes_written' => $success,
    'log_path' => $logFile
], JSON_PRETTY_PRINT);

/**
 * Función para limpiar logs antiguos (más de 6 meses)
 */
function cleanOldLogs($logDir) {
    if (!is_dir($logDir)) return;
    
    $files = glob($logDir . '/*.log');
    $sixMonthsAgo = strtotime('-6 months');
    
    foreach ($files as $file) {
        if (filemtime($file) < $sixMonthsAgo) {
            @unlink($file);
        }
    }
}

// Ejecutar limpieza ocasionalmente (1% de probabilidad)
if (rand(1, 100) === 1) {
    cleanOldLogs($logDir);
}
?>