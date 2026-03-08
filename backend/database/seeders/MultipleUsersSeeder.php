<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MultipleUsersSeeder extends Seeder
{
    public function run()
    {
        $users = [
            // Multiple Admins
            [
                'email' => 'admin1@bnu.edu.pk',
                'password' => Hash::make('password'),
                'full_name' => 'Admin User 1',
                'role_id' => 1, // SUSTAINABILITY_ADMIN
                'school_id' => 1,
                'created_at' => now(),
            ],
            [
                'email' => 'admin2@bnu.edu.pk',
                'password' => Hash::make('password'),
                'full_name' => 'Admin User 2',
                'role_id' => 1,
                'school_id' => 1,
                'created_at' => now(),
            ],
            
            // Multiple Coordinators
            [
                'email' => 'coordinator5@bnu.edu.pk',
                'password' => Hash::make('password'),
                'full_name' => 'Coordinator User 5',
                'role_id' => 2, // SCHOOL_COORDINATOR
                'school_id' => 1,
                'created_at' => now(),
            ],
            [
                'email' => 'coordinator6@bnu.edu.pk',
                'password' => Hash::make('password'),
                'full_name' => 'Coordinator User 6',
                'role_id' => 2,
                'school_id' => 1,
                'created_at' => now(),
            ],
            
            // Multiple HR Staff
            [
                'email' => 'hr1@bnu.edu.pk',
                'password' => Hash::make('password'),
                'full_name' => 'HR Staff 1',
                'role_id' => 3, // HR
                'school_id' => 1,
                'created_at' => now(),
            ],
            [
                'email' => 'hr2@bnu.edu.pk',
                'password' => Hash::make('password'),
                'full_name' => 'HR Staff 2',
                'role_id' => 3,
                'school_id' => 1,
                'created_at' => now(),
            ],
            
            // Multiple Management Users
            [
                'email' => 'management1@bnu.edu.pk',
                'password' => Hash::make('password'),
                'full_name' => 'Management User 1',
                'role_id' => 4, // STUDENT_AFFAIRS
                'school_id' => 1,
                'created_at' => now(),
            ],
            [
                'email' => 'management2@bnu.edu.pk',
                'password' => Hash::make('password'),
                'full_name' => 'Management User 2',
                'role_id' => 4,
                'school_id' => 1,
                'created_at' => now(),
            ],
            
            // Multiple Marketing Staff
            [
                'email' => 'marketing1@bnu.edu.pk',
                'password' => Hash::make('password'),
                'full_name' => 'Marketing Staff 1',
                'role_id' => 5, // MARKETING
                'school_id' => 1,
                'created_at' => now(),
            ],
            [
                'email' => 'marketing2@bnu.edu.pk',
                'password' => Hash::make('password'),
                'full_name' => 'Marketing Staff 2',
                'role_id' => 5,
                'school_id' => 1,
                'created_at' => now(),
            ],
            
            // Multiple Carbon Accountants
            [
                'email' => 'carbon1@bnu.edu.pk',
                'password' => Hash::make('password'),
                'full_name' => 'Carbon Accountant 1',
                'role_id' => 6, // CARBON_ACCOUNTANT
                'school_id' => 1,
                'created_at' => now(),
            ],
            [
                'email' => 'carbon2@bnu.edu.pk',
                'password' => Hash::make('password'),
                'full_name' => 'Carbon Accountant 2',
                'role_id' => 6,
                'school_id' => 1,
                'created_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            DB::table('users')->insert($user);
        }

        $this->command->info('Multiple users created successfully!');
    }
}
