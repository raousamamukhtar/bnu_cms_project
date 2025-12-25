# Oracle Database Connection Test

## Summary

I've set up tools to test your Oracle database connection. However, there's currently a segmentation fault (exit code 139) occurring when attempting to connect, which indicates an issue with the Oracle Instant Client libraries.

## What Has Been Set Up

### 1. Laravel Artisan Command
**Command:** `php artisan oracle:test`

This command provides:
- Configuration display
- Connection testing
- Database information retrieval
- Detailed error messages and troubleshooting tips

**Location:** `app/Console/Commands/TestOracleConnection.php`

### 2. API Route
**Endpoint:** `GET /api/test-db`

Tests Oracle connection via HTTP request and returns JSON response.

**Location:** `routes/api.php`

### 3. Web Route
**Endpoint:** `GET /test-db`

Simple web route for testing Oracle connection.

**Location:** `routes/web.php`

### 4. Standalone Test Script
**File:** `test_oracle_simple.php`

A simple PHP script that tests Oracle connection without Laravel framework.

**Usage:** `php test_oracle_simple.php`

## Current Issue

The connection attempts are resulting in a **segmentation fault (exit code 139)**, which typically indicates:

1. **Oracle Instant Client not properly installed**
2. **Library path issues** (LD_LIBRARY_PATH or DYLD_LIBRARY_PATH on macOS)
3. **Mismatched Oracle client version** with OCI8 extension
4. **Missing or corrupted Oracle libraries**

## Configuration

Your Oracle configuration is set up in:
- `config/database.php` (lines 65-89)
- `config/oracle.php`

Current settings (from .env):
- Host: 127.0.0.1
- Port: 1521
- Database/Service Name: FREEPDB1
- Username: ✓ Set
- Password: ✓ Set

## Troubleshooting Steps

### 1. Check Oracle Instant Client Installation

On macOS:
```bash
# Check if Oracle Instant Client is installed
ls -la /usr/local/lib/ | grep -i oracle
ls -la /opt/oracle/ | grep -i instant

# Check library paths
echo $DYLD_LIBRARY_PATH
echo $LD_LIBRARY_PATH
```

### 2. Verify OCI8 Extension

```bash
php -m | grep oci8
php -i | grep -i oci8
```

### 3. Check Oracle Client Libraries

The OCI8 extension needs Oracle Instant Client libraries. Common locations:
- `/usr/local/lib/`
- `/opt/oracle/instantclient_*/`
- `/usr/lib/oracle/`

### 4. Set Library Path (macOS)

If Oracle Instant Client is installed but not found:

```bash
# For current session
export DYLD_LIBRARY_PATH=/path/to/oracle/instantclient:$DYLD_LIBRARY_PATH

# Add to ~/.zshrc or ~/.bash_profile for persistence
echo 'export DYLD_LIBRARY_PATH=/path/to/oracle/instantclient:$DYLD_LIBRARY_PATH' >> ~/.zshrc
```

### 5. Verify Oracle Database is Running

```bash
# Check if Oracle listener is running
ps aux | grep -i oracle

# Test network connectivity
telnet 127.0.0.1 1521
# or
nc -zv 127.0.0.1 1521
```

### 6. Test with SQL*Plus (if available)

```bash
sqlplus username/password@//127.0.0.1:1521/FREEPDB1
```

### 7. Check PHP Error Logs

```bash
tail -f /path/to/php/error.log
# or Laravel logs
tail -f storage/logs/laravel.log
```

## Alternative Testing Methods

### Method 1: Use Laravel Tinker
```bash
php artisan tinker
>>> DB::connection('oracle')->getPdo();
```

### Method 2: Test via HTTP
If your Laravel server is running:
```bash
curl http://localhost:8000/api/test-db
# or
curl http://localhost:8000/test-db
```

### Method 3: Check Connection Without Executing Queries
```bash
php artisan tinker
>>> try { DB::connection('oracle')->getPdo(); echo "Connected"; } catch(Exception $e) { echo $e->getMessage(); }
```

## Next Steps

1. **Install/Reinstall Oracle Instant Client** if not installed
   - Download from: https://www.oracle.com/database/technologies/instant-client/downloads.html
   - Extract to a directory (e.g., `/opt/oracle/instantclient_21_1/`)
   - Set DYLD_LIBRARY_PATH to point to this directory

2. **Recompile OCI8 Extension** if needed
   - Ensure OCI8 extension matches Oracle client version
   - May need to reinstall: `pecl install oci8`

3. **Verify Network Connectivity**
   - Ensure Oracle database is accessible from your machine
   - Check firewall rules
   - Verify host, port, and service name

4. **Check Laravel OCI8 Package**
   - Package installed: `yajra/laravel-oci8` (version ^12.3)
   - Verify it's properly configured in `config/database.php`

## Files Created/Modified

1. ✅ `app/Console/Commands/TestOracleConnection.php` - Artisan command
2. ✅ `routes/api.php` - Updated to use 'oracle' connection explicitly
3. ✅ `test_oracle_simple.php` - Standalone test script
4. ✅ `ORACLE_CONNECTION_TEST.md` - This documentation

## Configuration Files

- `config/database.php` - Main database configuration (Oracle connection defined)
- `config/oracle.php` - Oracle-specific configuration
- `.env` - Environment variables (DB_HOST, DB_PORT, DB_DATABASE, DB_SERVICE_NAME, DB_USERNAME, DB_PASSWORD)

## Support

If the segmentation fault persists after checking the above:
1. Check system logs: `dmesg | tail` or `log show --predicate 'process == "php"' --last 5m`
2. Try running with strace/dtruss to see where it crashes
3. Consider using Docker with Oracle client pre-installed
4. Verify Oracle client and OCI8 extension compatibility

