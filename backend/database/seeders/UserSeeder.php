<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
        // Clear existing users
        User::query()->delete();

        $users = [
            // Coordinator Dashboard Users (4 coordinators)
            [
                'full_name' => 'Coordinator 1 - Computer Science',
                'email' => 'coordinator1@bnu.edu.pk',
                'password' => Hash::make('password'),
                'role_id' => 2, // SCHOOL_COORDINATOR
                'school_id' => null,
                'created_at' => now(),
            ],
            [
                'full_name' => 'Coordinator 2 - Engineering',
                'email' => 'coordinator2@bnu.edu.pk',
                'password' => Hash::make('password'),
                'role_id' => 2, // SCHOOL_COORDINATOR
                'school_id' => null,
                'created_at' => now(),
            ],
            [
                'full_name' => 'Coordinator 3 - Business',
                'email' => 'coordinator3@bnu.edu.pk',
                'password' => Hash::make('password'),
                'role_id' => 2, // SCHOOL_COORDINATOR
                'school_id' => null,
                'created_at' => now(),
            ],
            [
                'full_name' => 'Coordinator 4 - Arts',
                'email' => 'coordinator4@bnu.edu.pk',
                'password' => Hash::make('password'),
                'role_id' => 2, // SCHOOL_COORDINATOR
                'school_id' => null,
                'created_at' => now(),
            ],
            
            // HR Manager
            [
                'full_name' => 'HR Manager',
                'email' => 'hr@bnu.edu.pk',
                'password' => Hash::make('password'),
                'role_id' => 3, // HR
                'school_id' => null,
                'created_at' => now(),
            ],
            
            // Marketing Head
            [
                'full_name' => 'Marketing Head',
                'email' => 'marketing@bnu.edu.pk',
                'password' => Hash::make('password'),
                'role_id' => 5, // MARKETING
                'school_id' => null,
                'created_at' => now(),
            ],
            
            // Admin User
            [
                'full_name' => 'Admin User',
                'email' => 'admin@bnu.edu.pk',
                'password' => Hash::make('password'),
                'role_id' => 1, // SUSTAINABILITY_ADMIN
                'school_id' => null,
                'created_at' => now(),
            ],
            
            // Carbon Accountant
            [
                'full_name' => 'Carbon Accountant',
                'email' => 'carbon@bnu.edu.pk',
                'password' => Hash::make('password'),
                'role_id' => 6, // CARBON_ACCOUNTANT
                'school_id' => null,
                'created_at' => now(),
            ],
            
            // Management User (using STUDENT_AFFAIRS role as closest match)
            [
                'full_name' => 'Management User',
                'email' => 'management@bnu.edu.pk',
                'password' => Hash::make('password'),
                'role_id' => 4, // STUDENT_AFFAIRS (repurposed as management)
                'school_id' => null,
                'created_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        $this->command->info('Created 9 users successfully!');
        $this->command->info('Default password for all users: password');
    }
}

