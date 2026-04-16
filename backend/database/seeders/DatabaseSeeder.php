<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Roles
        $roles = [
            ['ROLE_ID' => 1, 'ROLE_NAME' => 'Admin'],
            ['ROLE_ID' => 2, 'ROLE_NAME' => 'School Coordinator'],
            ['ROLE_ID' => 3, 'ROLE_NAME' => 'HR'],
            ['ROLE_ID' => 4, 'ROLE_NAME' => 'Student Affairs'],
            ['ROLE_ID' => 5, 'ROLE_NAME' => 'Marketing'],
            ['ROLE_ID' => 6, 'ROLE_NAME' => 'Carbon Accountant'],
            ['ROLE_ID' => 21, 'ROLE_NAME' => 'Management'],
        ];
        foreach ($roles as $role) {
            DB::table('ROLES')->updateOrInsert(['ROLE_ID' => $role['ROLE_ID']], $role);
        }

        // Schools
        $schools = [
            ['SCHOOL_ID' => 1, 'SCHOOL_NAME' => 'SCIT'],
            ['SCHOOL_ID' => 2, 'SCHOOL_NAME' => 'SB'],
            ['SCHOOL_ID' => 3, 'SCHOOL_NAME' => 'SLASS'],
            ['SCHOOL_ID' => 4, 'SCHOOL_NAME' => 'SVAD'],
        ];
        foreach ($schools as $school) {
            DB::table('SCHOOLS')->updateOrInsert(['SCHOOL_ID' => $school['SCHOOL_ID']], $school);
        }

        // Users - Using EMAIL as unique key to match production IDs
        $users = [
            ['FULL_NAME' => 'System Admin', 'EMAIL' => 'admin@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 1, 'SCHOOL_ID' => null],
            
            // Map common production coordinations to specific schools
            ['FULL_NAME' => 'SCIT Coord 1', 'EMAIL' => 'coordinator1@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 2, 'SCHOOL_ID' => 1],
            ['FULL_NAME' => 'SCIT Coord 2', 'EMAIL' => 'coordinator2@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 2, 'SCHOOL_ID' => 1],
            ['FULL_NAME' => 'SB Coord 1', 'EMAIL' => 'coordinator3@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 2, 'SCHOOL_ID' => 2],
            ['FULL_NAME' => 'SB Coord 2', 'EMAIL' => 'coordinator4@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 2, 'SCHOOL_ID' => 2],
            
            // Add remaining school coordinators
            ['FULL_NAME' => 'SLASS Coord 1', 'EMAIL' => 'slass1@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 2, 'SCHOOL_ID' => 3],
            ['FULL_NAME' => 'SLASS Coord 2', 'EMAIL' => 'slass2@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 2, 'SCHOOL_ID' => 3],
            ['FULL_NAME' => 'SVAD Coord 1', 'EMAIL' => 'svad1@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 2, 'SCHOOL_ID' => 4],
            ['FULL_NAME' => 'SVAD Coord 2', 'EMAIL' => 'svad2@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 2, 'SCHOOL_ID' => 4],

            // HR team
            ['FULL_NAME' => 'HR Manager 1', 'EMAIL' => 'hr1@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 3, 'SCHOOL_ID' => null],
            ['FULL_NAME' => 'HR Manager 2', 'EMAIL' => 'hr2@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 3, 'SCHOOL_ID' => null],
            ['FULL_NAME' => 'General HR Account', 'EMAIL' => 'hr@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 3, 'SCHOOL_ID' => null],
            
            // Department Heads
            ['FULL_NAME' => 'Marketing Head', 'EMAIL' => 'marketing@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 5, 'SCHOOL_ID' => null],
            ['FULL_NAME' => 'Carbon Accountant', 'EMAIL' => 'carbon@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 6, 'SCHOOL_ID' => null],
            ['FULL_NAME' => 'Management User', 'EMAIL' => 'management@bnu.edu.pk', 'PASSWORD' => Hash::make('password'), 'ROLE_ID' => 21, 'SCHOOL_ID' => null],
        ];

        foreach ($users as $user) {
            $user['CREATED_AT'] = Carbon::now();
            // Match by email to avoid PK sequence conflicts
            DB::table('USERS')->updateOrInsert(['EMAIL' => $user['EMAIL']], $user);
        }
    }
}
