<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

echo "--------------------------------------------------------\n";
echo "Starting Manual Migration from schema.sql...\n";
echo "--------------------------------------------------------\n";

$sql = file_get_contents(__DIR__.'/schema.sql');
$statements = array_filter(array_map('trim', explode(';', $sql)));

foreach ($statements as $statement) {
    if (empty($statement)) continue;
    try {
        DB::statement($statement);
        echo "SUCCESS: " . substr($statement, 0, 60) . "...\n";
    } catch (\Exception $e) {
        $msg = $e->getMessage();
        if (strpos($msg, 'ORA-00955') !== false || strpos($msg, 'ORA-01430') !== false) {
             echo "ALREADY EXISTS (Skipped): " . substr($statement, 0, 60) . "...\n";
             continue;
        }
        if (strpos($msg, 'Select') !== false || strpos(strtolower($statement), 'select ') === 0) {
             continue;
        }
        if (strpos($msg, 'ORA-01031') !== false) {
             echo "\n[CRITICAL ERROR] ORA-01031: INSUFFICIENT PRIVILEGES!\n";
             echo "--------------------------------------------------------\n";
             echo "You cannot run CREATE SEQUENCE or CREATE TRIGGER.\n";
             echo "I noticed you tried to run `GRANT CREATE SEQUENCE TO BNUCMS;` in your Mac Terminal.\n";
             echo "That command is a SQL query, it MUST be run inside an Oracle Database Client (like SQL Developer, DBeaver) while logged in as the Oracle SysDBA/Admin, NOT in the macOS zsh terminal!\n";
             echo "--------------------------------------------------------\n";
             exit(1);
        }
        if (strpos($msg, 'ORA-02289') !== false || strpos($msg, 'ORA-04081') !== false) {
             echo "ALREADY EXISTS (Skipped): " . substr($statement, 0, 60) . "...\n";
             continue;
        }
        
        echo "ERROR running: " . substr($statement, 0, 50) . "...\nError: " . $msg . "\n";
    }
}

echo "--------------------------------------------------------\n";
echo "Migration finished. Starting Database Seeding...\n";
echo "--------------------------------------------------------\n";

try {
    // 1. Seed Roles
    DB::table('SUS_ROLES')->insert([
        ['ROLE_ID' => 1, 'ROLE_NAME' => 'Admin'],
        ['ROLE_ID' => 2, 'ROLE_NAME' => 'School Coordinator'],
        ['ROLE_ID' => 4, 'ROLE_NAME' => 'Student Affairs'],
        ['ROLE_ID' => 21, 'ROLE_NAME' => 'Management'],
    ]);
    echo "Seeded Roles successfully.\n";
} catch (\Exception $e) {
    echo "Seed Roles: " . (strpos($e->getMessage(), 'ORA-00001') !== false ? "Already exists" : $e->getMessage()) . "\n";
}

try {
    // 2. Seed Schools
    DB::table('SUS_SCHOOLS')->insert([
        ['SCHOOL_ID' => 1, 'SCHOOL_NAME' => 'School of Computer Science'],
        ['SCHOOL_ID' => 2, 'SCHOOL_NAME' => 'School of Business'],
    ]);
    echo "Seeded Schools successfully.\n";
} catch (\Exception $e) {
    echo "Seed Schools: " . (strpos($e->getMessage(), 'ORA-00001') !== false ? "Already exists" : $e->getMessage()) . "\n";
}

try {
    // 3. Seed Users
    DB::table('SUS_USERS')->insert([
        'USER_ID' => 1,
        'FULL_NAME' => 'System Admin',
        'EMAIL' => 'admin@bnu.edu.pk',
        'PASSWORD' => Hash::make('password'),
        'ROLE_ID' => 1,
        'SCHOOL_ID' => null,
        'CREATED_AT' => Carbon::now(),
    ]);
    
    DB::table('SUS_USERS')->insert([
        'USER_ID' => 2,
        'FULL_NAME' => 'CS Coordinator',
        'EMAIL' => 'cs_coord@bnu.edu.pk',
        'PASSWORD' => Hash::make('password'),
        'ROLE_ID' => 2,
        'SCHOOL_ID' => 1,
        'CREATED_AT' => Carbon::now(),
    ]);
    echo "Seeded Users successfully.\n";
} catch (\Exception $e) {
    echo "Seed Users: " . (strpos($e->getMessage(), 'ORA-00001') !== false ? "Already exists" : $e->getMessage()) . "\n";
}

try {
    // 4. Seed basic Period
    DB::table('SUS_SUSTAINABILITY_PERIOD')->insert([
        'PERIOD_ID' => 1,
        'DATA_MONTH' => Carbon::now()->month,
        'DATA_YEAR' => Carbon::now()->year,
        'STUDENTS' => 500,
        'EMPLOYEES' => 50,
        'CREATED_BY' => 1,
        'CREATED_AT' => Carbon::now(),
    ]);
    echo "Seeded Sustainability Period successfully.\n";
} catch (\Exception $e) {
    echo "Seed Period: " . (strpos($e->getMessage(), 'ORA-00001') !== false ? "Already exists" : $e->getMessage()) . "\n";
}

echo "--------------------------------------------------------\n";
echo "Database Seeding Completed!\n";
echo "--------------------------------------------------------\n";
