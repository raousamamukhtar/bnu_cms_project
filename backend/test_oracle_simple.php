<?php
/**
 * Simple Oracle Connection Test Script
 * This script tests Oracle connection without Laravel framework
 */

echo "Oracle Connection Test\n";
echo "=====================\n\n";

// Check if OCI8 extension is loaded
if (!extension_loaded('oci8')) {
    echo "❌ ERROR: OCI8 extension is not loaded!\n";
    echo "Please install and enable the OCI8 PHP extension.\n";
    exit(1);
}

echo "✓ OCI8 extension is loaded\n";
echo "  Version: " . phpversion('oci8') . "\n\n";

// Try to load .env file
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue; // Skip comments
        if (strpos($line, '=') === false) continue;
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        if (!isset($_ENV[$key])) {
            $_ENV[$key] = $value;
            putenv("$key=$value");
        }
    }
}

// Get connection parameters from environment or use defaults
$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '1521';
$service_name = getenv('DB_SERVICE_NAME') ?: 'FREEPDB1';
$username = getenv('DB_USERNAME') ?: '';
$password = getenv('DB_PASSWORD') ?: '';

echo "Connection Parameters:\n";
echo "  Host: {$host}\n";
echo "  Port: {$port}\n";
echo "  Service Name: {$service_name}\n";
echo "  Username: " . ($username ? '***' : 'NOT SET') . "\n\n";

if (empty($username) || empty($password)) {
    echo "❌ ERROR: DB_USERNAME or DB_PASSWORD not set!\n";
    echo "Please set these environment variables or update this script.\n";
    exit(1);
}

// Build connection string
$connection_string = "//{$host}:{$port}/{$service_name}";

echo "Attempting to connect...\n";
echo "Connection String: {$connection_string}\n\n";

try {
    // Attempt connection
    $conn = oci_connect($username, $password, $connection_string);
    
    if (!$conn) {
        $error = oci_error();
        echo "❌ Connection failed!\n";
        echo "  Code: " . ($error['code'] ?? 'N/A') . "\n";
        echo "  Message: " . ($error['message'] ?? 'Unknown error') . "\n";
        exit(1);
    }
    
    echo "✅ Connection successful!\n\n";
    
    // Test query
    echo "Running test query...\n";
    $stid = oci_parse($conn, "SELECT USER as current_user, SYS_CONTEXT('USERENV', 'DB_NAME') as db_name FROM dual");
    
    if (!$stid) {
        $error = oci_error($conn);
        echo "❌ Query parse failed!\n";
        echo "  Message: " . ($error['message'] ?? 'Unknown error') . "\n";
        oci_close($conn);
        exit(1);
    }
    
    $r = oci_execute($stid);
    if (!$r) {
        $error = oci_error($stid);
        echo "❌ Query execution failed!\n";
        echo "  Message: " . ($error['message'] ?? 'Unknown error') . "\n";
        oci_free_statement($stid);
        oci_close($conn);
        exit(1);
    }
    
    $row = oci_fetch_array($stid, OCI_ASSOC);
    if ($row) {
        echo "✅ Query executed successfully!\n\n";
        echo "Results:\n";
        foreach ($row as $key => $value) {
            echo "  {$key}: {$value}\n";
        }
    }
    
    oci_free_statement($stid);
    oci_close($conn);
    
    echo "\n✅ All tests passed!\n";
    
} catch (Exception $e) {
    echo "❌ Exception occurred:\n";
    echo "  " . $e->getMessage() . "\n";
    exit(1);
}

