<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class TestOracleConnection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'oracle:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Oracle database connection';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing Oracle Database Connection...');
        $this->newLine();

        // Display configuration
        $this->displayConfiguration();

        // Test connection
        $this->testConnection();

        return Command::SUCCESS;
    }

    /**
     * Display Oracle connection configuration
     */
    protected function displayConfiguration()
    {
        $this->info('Configuration:');
        $config = Config::get('database.connections.oracle');
        
        $this->table(
            ['Setting', 'Value'],
            [
                ['Driver', $config['driver'] ?? 'N/A'],
                ['Host', $config['host'] ?? 'N/A'],
                ['Port', $config['port'] ?? 'N/A'],
                ['Database', $config['database'] ?? 'N/A'],
                ['Service Name', $config['service_name'] ?? 'N/A'],
                ['Username', $config['username'] ? '***' : 'N/A'],
                ['Charset', $config['charset'] ?? 'N/A'],
                ['TNS', $config['tns'] ?: 'Not set'],
            ]
        );
        $this->newLine();
    }

    /**
     * Test the Oracle connection
     */
    protected function testConnection()
    {
        try {
            $this->info('Attempting to connect...');
            
            // First, test if we can get the connection object
            $connection = DB::connection('oracle');
            $this->info('✓ Connection object created');
            
            // Try to get PDO connection with timeout
            try {
                $pdo = $connection->getPdo();
                $this->info('✓ PDO connection established');
            } catch (\Exception $e) {
                $this->error('❌ Failed to establish PDO connection');
                $this->error("   {$e->getMessage()}");
                return Command::FAILURE;
            }
            
            // Get database name
            try {
                $dbName = $connection->getDatabaseName();
                $this->info("✓ Database Name: {$dbName}");
            } catch (\Exception $e) {
                $this->warn("⚠ Could not get database name: {$e->getMessage()}");
            }

            // Test simple query first
            $this->newLine();
            $this->info('Testing simple query (SELECT 1 FROM dual)...');
            try {
                $simpleResult = $connection->selectOne("SELECT 1 as test FROM dual");
                
                if ($simpleResult && (isset($simpleResult->test) || isset($simpleResult->TEST))) {
                    $testValue = $simpleResult->test ?? $simpleResult->TEST ?? null;
                    if ($testValue == 1) {
                        $this->info('✓ Simple query test passed');
                    } else {
                        $this->warn("⚠ Unexpected result: {$testValue}");
                    }
                } else {
                    $this->warn('⚠ Query returned unexpected format');
                }
            } catch (\Exception $e) {
                $this->error("❌ Simple query failed: {$e->getMessage()}");
                return Command::FAILURE;
            }

            // Test query - Get Oracle version and user info
            $this->newLine();
            $this->info('Running detailed query...');
            
            try {
                $results = $connection->select("
                    SELECT 
                        USER as current_user,
                        SYS_CONTEXT('USERENV', 'DB_NAME') as db_name,
                        SYS_CONTEXT('USERENV', 'SERVER_HOST') as server_host,
                        SYS_CONTEXT('USERENV', 'IP_ADDRESS') as ip_address,
                        (SELECT BANNER FROM v\$version WHERE ROWNUM = 1) as version
                    FROM dual
                ");
                
                if (!empty($results)) {
                    $result = (array) $results[0];
                    $this->info('✓ Detailed query executed successfully');
                    $this->newLine();
                    
                    $this->table(
                        ['Property', 'Value'],
                        [
                            ['Current User', $result['CURRENT_USER'] ?? ($result['current_user'] ?? 'N/A')],
                            ['Database Name', $result['DB_NAME'] ?? ($result['db_name'] ?? 'N/A')],
                            ['Server Host', $result['SERVER_HOST'] ?? ($result['server_host'] ?? 'N/A')],
                            ['IP Address', $result['IP_ADDRESS'] ?? ($result['ip_address'] ?? 'N/A')],
                            ['Oracle Version', $result['VERSION'] ?? ($result['version'] ?? 'N/A')],
                        ]
                    );
                }
            } catch (\Exception $e) {
                $this->warn("⚠ Detailed query failed: {$e->getMessage()}");
                $this->line('   (Simple query passed, so connection is working)');
            }

            $this->newLine();
            $this->info('✅ Oracle connection test completed successfully!');
            
        } catch (\PDOException $e) {
            $this->newLine();
            $this->error('❌ PDO Exception:');
            $this->error("   Code: {$e->getCode()}");
            $this->error("   Message: {$e->getMessage()}");
            
            // Provide helpful suggestions
            $this->newLine();
            $this->warn('Troubleshooting suggestions:');
            $this->line('   1. Check if Oracle client is installed (oci8 extension)');
            $this->line('   2. Verify database credentials in .env file');
            $this->line('   3. Ensure Oracle database is running and accessible');
            $this->line('   4. Check network connectivity to Oracle server');
            $this->line('   5. Verify TNS configuration if using TNS connection');
            $this->line('   6. Check Oracle Instant Client library paths');
            
            return Command::FAILURE;
            
        } catch (\Exception $e) {
            $this->newLine();
            $this->error('❌ Connection failed:');
            $this->error("   {$e->getMessage()}");
            $this->error("   File: {$e->getFile()}:{$e->getLine()}");
            
            if (strpos($e->getMessage(), 'oci_connect') !== false || strpos($e->getMessage(), 'OCI8') !== false) {
                $this->newLine();
                $this->warn('Oracle OCI8 related error. Check:');
                $this->line('   - Oracle Instant Client is installed');
                $this->line('   - Library paths are correctly set (LD_LIBRARY_PATH or DYLD_LIBRARY_PATH)');
                $this->line('   - OCI8 extension is properly compiled');
            }
            
            return Command::FAILURE;
        }
    }
}
