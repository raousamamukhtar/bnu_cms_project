<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Role IDs:
     * 1 = SUSTAINABILITY_ADMIN
     * 2 = SCHOOL_COORDINATOR  
     * 3 = HR
     * 4 = STUDENT_AFFAIRS
     * 5 = MARKETING
     * 6 = CARBON_ACCOUNTANT
     */
    public function run(): void
    {
        $users = [
            ['USER_ID'=>100, 'FULL_NAME' => 'System Admin', 'EMAIL' => 'admin@bnu.edu.pk', 'ROLE_ID' => 1],
            ['USER_ID'=>101, 'FULL_NAME' => 'School Coordinator CS', 'EMAIL' => 'coordinator1@bnu.edu.pk', 'ROLE_ID' => 2],
            ['USER_ID'=>102, 'FULL_NAME' => 'School Coordinator Engineering', 'EMAIL' => 'coordinator2@bnu.edu.pk', 'ROLE_ID' => 2],
            ['USER_ID'=>103, 'FULL_NAME' => 'School Coordinator Business', 'EMAIL' => 'coordinator3@bnu.edu.pk', 'ROLE_ID' => 2],
            ['USER_ID'=>104, 'FULL_NAME' => 'School Coordinator Arts', 'EMAIL' => 'coordinator4@bnu.edu.pk', 'ROLE_ID' => 2],
            ['USER_ID'=>105, 'FULL_NAME' => 'HR Manager', 'EMAIL' => 'hr@bnu.edu.pk', 'ROLE_ID' => 3],
            ['USER_ID'=>106, 'FULL_NAME' => 'Marketing Head', 'EMAIL' => 'marketing@bnu.edu.pk', 'ROLE_ID' => 5],
            ['USER_ID'=>107, 'FULL_NAME' => 'Carbon Accountant', 'EMAIL' => 'carbon@bnu.edu.pk', 'ROLE_ID' => 6],
            ['USER_ID'=>108, 'FULL_NAME' => 'Management User', 'EMAIL' => 'management@bnu.edu.pk', 'ROLE_ID' => 21],
        ];

        // Ensure roles 3, 5, 6 exist if they're used. 
        // Based on my previous output, they were NOT in the ROLES list (1, 2, 4, 21).
        // Let's add them first just in case.
        $roles_to_ensure = [
            ['ROLE_ID' => 3, 'ROLE_NAME' => 'HR'],
            ['ROLE_ID' => 5, 'ROLE_NAME' => 'Marketing'],
            ['ROLE_ID' => 6, 'ROLE_NAME' => 'Carbon Accountant'],
        ];

        foreach ($roles_to_ensure as $r) {
            try {
                DB::table('ROLES')->insert($r);
            } catch (\Exception $e) {}
        }

        $password = Hash::make('password');

        foreach ($users as $u) {
            try {
                $existing = DB::table('USERS')->where('EMAIL', $u['EMAIL'])->first();
                if ($existing) {
                    DB::table('USERS')->where('EMAIL', $u['EMAIL'])->update([
                        'FULL_NAME' => $u['FULL_NAME'],
                        'PASSWORD' => $password,
                        'ROLE_ID' => $u['ROLE_ID'],
                        'CREATED_AT' => \Carbon\Carbon::now(),
                    ]);
                } else {
                    DB::table('USERS')->insert([
                        'USER_ID' => $u['USER_ID'],
                        'FULL_NAME' => $u['FULL_NAME'],
                        'EMAIL' => $u['EMAIL'],
                        'PASSWORD' => $password,
                        'ROLE_ID' => $u['ROLE_ID'],
                        'SCHOOL_ID' => null,
                        'CREATED_AT' => \Carbon\Carbon::now(),
                    ]);
                }
            } catch (\Exception $e) {
                $this->command->error("Failed to seed {$u['EMAIL']}: " . $e->getMessage());
            }
        }
        $this->command->info('Successfully seeded admin, coordinators and other users!');
        $this->command->info('Default password for all users: password');
    }
}

