<?php
/**
 * Visor de Logs - Café Chostito
 * Permite visualizar los logs guardados por el sistema
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=UTF-8");

$logDir = __DIR__ . '/logs/';
$selectedFile = $_GET['file'] ?? '';

// Obtener todos los archivos de log
$logFiles = [];
if (is_dir($logDir)) {
    $files = glob($logDir . '*.log');
    foreach ($files as $file) {
        $logFiles[] = basename($file);
    }
    rsort($logFiles); // Más recientes primero
}

// Leer contenido del archivo seleccionado
$logContent = '';
if ($selectedFile && file_exists($logDir . $selectedFile)) {
    $logContent = file_get_contents($logDir . $selectedFile);
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
            max-width: 1200px;
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
        }
        .stat-card h3 {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 5px;
        }
        .stat-card p {
            color: #16a34a;
            font-size: 1.5rem;
            font-weight: bold;
        }
        .log-content {
            padding: 20px;
            background: #1f2937;
            color: #10b981;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.6;
            overflow-x: auto;
            max-height: 600px;
            overflow-y: auto;
        }
        .log-line {
            padding: 5px 10px;
            margin: 2px 0;
            border-radius: 5px;
        }
        .log-line:hover {
            background: #374151;
        }
        .timestamp {
            color: #8b5cf6;
        }
        .action-reserva {
            color: #10b981;
            font-weight: bold;
        }
        .action-login {
            color: #3b82f6;
            font-weight: bold;
        }
        .action-error {
            color: #ef4444;
            font-weight: bold;
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #6b7280;
        }
        .empty-state svg {
            width: 100px;
            height: 100px;
            margin: 0 auto 20px;
            opacity: 0.5;
        }
        .footer {
            padding: 20px;
            text-align: center;
            background: #f9fafb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Sistema de Logs - Café Chostito</h1>
            <p>Monitoreo y auditoría de actividades del sistema</p>
        </div>

        <div class="controls">
            <form method="GET">
                <select name="file" onchange="this.form.submit()">
                    <option value="">Selecciona un archivo de log</option>
                    <?php foreach ($logFiles as $file): ?>
                        <option value="<?= htmlspecialchars($file) ?>" <?= $file === $selectedFile ? 'selected' : '' ?>>
                            <?= htmlspecialchars($file) ?> 
                            (<?= number_format(filesize($logDir . $file) / 1024, 2) ?> KB)
                        </option>
                    <?php endforeach; ?>
                </select>
            </form>
        </div>

        <?php if ($selectedFile && $logContent): ?>
            <?php
            $lines = explode("\n", $logContent);
            $totalLines = count($lines);
            $reservaCount = count(array_filter($lines, fn($l) => strpos($l, 'RESERVA_CREADA') !== false));
            $loginCount = count(array_filter($lines, fn($l) => strpos($l, 'LOGIN') !== false));
            $cancelCount = count(array_filter($lines, fn($l) => strpos($l, 'RESERVA_CANCELADA') !== false));
            ?>
            
            <div class="stats">
                <div class="stat-card">
                    <h3>Total de Eventos</h3>
                    <p><?= $totalLines ?></p>
                </div>
                <div class="stat-card">
                    <h3>Reservas Creadas</h3>
                    <p><?= $reservaCount ?></p>
                </div>
                <div class="stat-card">
                    <h3>Inicios de Sesión</h3>
                    <p><?= $loginCount ?></p>
                </div>
                <div class="stat-card">
                    <h3>Cancelaciones</h3>
                    <p><?= $cancelCount ?></p>
                </div>
            </div>

            <div class="log-content">
                <?php foreach ($lines as $line): ?>
                    <?php if (empty(trim($line))) continue; ?>
                    <div class="log-line">
                        <?php
                        $line = htmlspecialchars($line);
                        // Colorear timestamp
                        $line = preg_replace('/\[(.*?)\]/', '<span class="timestamp">[$1]</span>', $line, 1);
                        // Colorear acciones
                        if (strpos($line, 'RESERVA_CREADA') !== false || strpos($line, 'RESERVA_ACTUALIZADA') !== false) {
                            $line = preg_replace('/(RESERVA_CREADA|RESERVA_ACTUALIZADA)/', '<span class="action-reserva">$1</span>', $line);
                        } elseif (strpos($line, 'LOGIN') !== false || strpos($line, 'REGISTER') !== false) {
                            $line = preg_replace('/(LOGIN|REGISTER)/', '<span class="action-login">$1</span>', $line);
                        } elseif (strpos($line, 'ERROR') !== false || strpos($line, 'CANCELADA') !== false) {
                            $line = preg_replace('/(ERROR|RESERVA_CANCELADA)/', '<span class="action-error">$1</span>', $line);
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
                <h2>No hay logs disponibles</h2>
                <p>Selecciona un archivo de log del menú superior</p>
            </div>
        <?php endif; ?>

        <div class="footer">
            <p>Sistema de Auditoría PHP - Café Chostito © <?= date('Y') ?></p>
            <p>Última actualización: <?= date('d/m/Y H:i:s') ?></p>
        </div>
    </div>
</body>
</html>