<?php
/**
 * Visor de Logs - Café Chostito
 * Permite visualizar los logs guardados por el sistema
 * Ruta: /paginaChostito/api/view-logs.php
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=UTF-8");

$logDir = __DIR__ . '/logs/';
$selectedFile = $_GET['file'] ?? '';

// Verificar si el directorio existe
if (!is_dir($logDir)) {
    echo "<h1>Error: Directorio de logs no encontrado</h1>";
    echo "<p>Ruta: " . htmlspecialchars($logDir) . "</p>";
    echo "<p>Asegúrate de que el sistema haya generado al menos un log.</p>";
    exit();
}

// Obtener todos los archivos de log
$logFiles = [];
$files = glob($logDir . '*.log');
if ($files) {
    foreach ($files as $file) {
        $logFiles[] = basename($file);
    }
    rsort($logFiles); // Más recientes primero
}

// Leer contenido del archivo seleccionado
$logContent = '';
$fileSize = 0;
if ($selectedFile && file_exists($logDir . $selectedFile)) {
    $logContent = file_get_contents($logDir . $selectedFile);
    $fileSize = filesize($logDir . $selectedFile);
    $lines = explode("\n", trim($logContent));
    $lines = array_reverse($lines); // Más recientes primero
    $logContent = implode("\n", $lines);
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visor de Logs - Café Chostito</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2rem;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .header p {
            opacity: 0.9;
        }
        .controls {
            padding: 20px;
            background: #f9fafb;
            border-bottom: 2px solid #e5e7eb;
        }
        .controls select {
            width: 100%;
            padding: 12px 20px;
            border: 2px solid #d1d5db;
            border-radius: 10px;
            font-size: 16px;
            background: white;
            cursor: pointer;
            transition: all 0.3s;
        }
        .controls select:hover {
            border-color: #16a34a;
        }
        .controls select:focus {
            outline: none;
            border-color: #16a34a;
            box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            padding: 20px;
            background: #f9fafb;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .stat-card h3 {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .stat-card p {
            color: #16a34a;
            font-size: 2rem;
            font-weight: bold;
        }
        .stat-card.critical p {
            color: #dc2626;
        }
        .stat-card.info p {
            color: #3b82f6;
        }
        .log-content {
            padding: 20px;
            background: #1f2937;
            color: #10b981;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.8;
            overflow-x: auto;
            max-height: 600px;
            overflow-y: auto;
        }
        .log-content::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        .log-content::-webkit-scrollbar-track {
            background: #111827;
        }
        .log-content::-webkit-scrollbar-thumb {
            background: #374151;
            border-radius: 5px;
        }
        .log-content::-webkit-scrollbar-thumb:hover {
            background: #4b5563;
        }
        .log-line {
            padding: 8px 12px;
            margin: 2px 0;
            border-radius: 5px;
            border-left: 3px solid transparent;
        }
        .log-line:hover {
            background: #374151;
            border-left-color: #10b981;
        }
        .timestamp {
            color: #a78bfa;
            font-weight: bold;
        }
        .ip {
            color: #60a5fa;
        }
        .user {
            color: #fbbf24;
        }
        .action-reserva {
            color: #10b981;
            font-weight: bold;
            text-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
        }
        .action-login {
            color: #3b82f6;
            font-weight: bold;
            text-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
        }
        .action-error {
            color: #ef4444;
            font-weight: bold;
            text-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
        }
        .action-cancel {
            color: #f59e0b;
            font-weight: bold;
            text-shadow: 0 0 5px rgba(245, 158, 11, 0.5);
        }
        .empty-state {
            text-align: center;
            padding: 80px 20px;
            color: #6b7280;
        }
        .empty-state svg {
            width: 120px;
            height: 120px;
            margin: 0 auto 20px;
            opacity: 0.3;
        }
        .empty-state h2 {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: #374151;
        }
        .footer {
            padding: 20px;
            text-align: center;
            background: #f9fafb;
            color: #6b7280;
            font-size: 14px;
            border-top: 2px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
        }
        .info-banner {
            background: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 15px 20px;
            margin: 20px;
            border-radius: 8px;
        }
        .info-banner p {
            color: #1e40af;
            margin: 5px 0;
        }
        .info-banner strong {
            color: #1e3a8a;
        }
        .refresh-btn {
            background: #16a34a;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
            transition: background 0.3s;
        }
        .refresh-btn:hover {
            background: #15803d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>
                <span>📊</span>
                <span>Sistema de Logs - Café Chostito</span>
            </h1>
            <p>Monitoreo y auditoría de actividades del sistema en tiempo real</p>
        </div>

        <?php if (empty($logFiles)): ?>
            <div class="info-banner">
                <p><strong>ℹ️ Información:</strong> No se han encontrado archivos de log.</p>
                <p><strong>Directorio:</strong> <?= htmlspecialchars($logDir) ?></p>
                <p><strong>Solución:</strong> Realiza alguna acción en el sistema (login, crear reserva) para generar logs.</p>
            </div>
        <?php endif; ?>

        <div class="controls">
            <form method="GET" style="display: flex; align-items: center;">
                <select name="file" onchange="this.form.submit()" style="flex: 1;">
                    <option value="">📁 Selecciona un archivo de log (<?= count($logFiles) ?> disponibles)</option>
                    <?php foreach ($logFiles as $file): ?>
                        <option value="<?= htmlspecialchars($file) ?>" <?= $file === $selectedFile ? 'selected' : '' ?>>
                            📄 <?= htmlspecialchars($file) ?> 
                            (<?= number_format(filesize($logDir . $file) / 1024, 2) ?> KB - <?= date('d/m/Y H:i', filemtime($logDir . $file)) ?>)
                        </option>
                    <?php endforeach; ?>
                </select>
                <button type="submit" class="refresh-btn">🔄 Actualizar</button>
            </form>
        </div>

        <?php if ($selectedFile && $logContent): ?>
            <?php
            $lines = array_filter(explode("\n", $logContent), 'trim');
            $totalLines = count($lines);
            $reservaCount = count(array_filter($lines, fn($l) => strpos($l, 'RESERVA_CREADA') !== false));
            $loginCount = count(array_filter($lines, fn($l) => strpos($l, 'LOGIN') !== false));
            $cancelCount = count(array_filter($lines, fn($l) => strpos($l, 'RESERVA_CANCELADA') !== false));
            $errorCount = count(array_filter($lines, fn($l) => strpos($l, 'ERROR') !== false));
            ?>
            
            <div class="stats">
                <div class="stat-card">
                    <h3>📊 Total de Eventos</h3>
                    <p><?= number_format($totalLines) ?></p>
                </div>
                <div class="stat-card">
                    <h3>✅ Reservas Creadas</h3>
                    <p><?= number_format($reservaCount) ?></p>
                </div>
                <div class="stat-card info">
                    <h3>🔐 Inicios de Sesión</h3>
                    <p><?= number_format($loginCount) ?></p>
                </div>
                <div class="stat-card critical">
                    <h3>❌ Cancelaciones</h3>
                    <p><?= number_format($cancelCount) ?></p>
                </div>
                <div class="stat-card critical">
                    <h3>⚠️ Errores</h3>
                    <p><?= number_format($errorCount) ?></p>
                </div>
                <div class="stat-card">
                    <h3>💾 Tamaño del Archivo</h3>
                    <p><?= number_format($fileSize / 1024, 2) ?> KB</p>
                </div>
            </div>

            <div class="log-content">
                <?php foreach ($lines as $line): ?>
                    <?php if (empty(trim($line))) continue; ?>
                    <div class="log-line">
                        <?php
                        $line = htmlspecialchars($line);
                        
                        // Colorear componentes
                        $line = preg_replace('/\[(.*?)\]/', '<span class="timestamp">[$1]</span>', $line, 1);
                        $line = preg_replace('/IP: ([\d\.]+)/', 'IP: <span class="ip">$1</span>', $line);
                        $line = preg_replace('/Usuario: ([^\|]+)/', 'Usuario: <span class="user">$1</span>', $line);
                        
                        // Colorear acciones
                        if (strpos($line, 'RESERVA_CREADA') !== false || strpos($line, 'RESERVA_ACTUALIZADA') !== false) {
                            $line = preg_replace('/(RESERVA_CREADA|RESERVA_ACTUALIZADA)/', '<span class="action-reserva">$1</span>', $line);
                        } elseif (strpos($line, 'RESERVA_CANCELADA') !== false) {
                            $line = preg_replace('/(RESERVA_CANCELADA)/', '<span class="action-cancel">$1</span>', $line);
                        } elseif (strpos($line, 'LOGIN') !== false || strpos($line, 'REGISTER') !== false) {
                            $line = preg_replace('/(LOGIN|REGISTER)/', '<span class="action-login">$1</span>', $line);
                        } elseif (strpos($line, 'ERROR') !== false) {
                            $line = preg_replace('/(ERROR)/', '<span class="action-error">$1</span>', $line);
                        }
                        
                        echo $line;
                        ?>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <div class="empty-state">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2>No hay logs para mostrar</h2>
                <p>Selecciona un archivo de log del menú superior para ver su contenido</p>
            </div>
        <?php endif; ?>

        <div class="footer">
            <p><strong>Sistema de Auditoría PHP - Café Chostito</strong> © <?= date('Y') ?></p>
            <p>📂 Directorio de logs: <?= htmlspecialchars($logDir) ?></p>
            <p>🕐 Última actualización: <?= date('d/m/Y H:i:s') ?></p>
        </div>
    </div>

    <script>
        // Auto-refresh cada 30 segundos si hay un archivo seleccionado
        <?php if ($selectedFile): ?>
        setTimeout(() => {
            location.reload();
        }, 30000);
        <?php endif; ?>
    </script>
</body>
</html>