<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\School;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DataEntrySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Roles Exist
        $roles = [
            'SCHOOL_COORDINATOR',
            'HR',
            'STUDENT_AFFAIRS',
            'MARKETING',
            'MANAGEMENT',
            'SUSTAINABILITY_ADMIN',
            'CARBON_ACCOUNTANT'
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['role_name' => $roleName]);
        }

        // 2. Ensure Schools Exist
        $schools = [
            'SLASS',
            'SVAD',
            'SMC',
            'SMS',
            'SCIT'
        ];

        foreach ($schools as $schoolName) {
            School::firstOrCreate(['school_name' => $schoolName]);
        }

        // 3. Create Users for each role
        $users = [
            [
                'role' => 'SUSTAINABILITY_ADMIN',
                'name' => 'Sustainability Admin',
                'email' => 'admin@bnu.edu.pk',
                'school' => null
            ],
            [
                'role' => 'CARBON_ACCOUNTANT',
                'name' => 'Carbon Accountant',
                'email' => 'carbon@bnu.edu.pk',
                'school' => null
            ],
            [
                'role' => 'HR',
                'name' => 'HR Manager',
                'email' => 'hr@bnu.edu.pk',
                'school' => null
            ],
            [
                'role' => 'STUDENT_AFFAIRS',
                'name' => 'Student Affairs Officer',
                'email' => 'sa@bnu.edu.pk',
                'school' => null
            ],
            [
                'role' => 'MARKETING',
                'name' => 'Marketing Head',
                'email' => 'marketing@bnu.edu.pk',
                'school' => null
            ],
            [
                'role' => 'SCHOOL_COORDINATOR',
                'name' => 'SLA Coordinator',
                'email' => 'sla@bnu.edu.pk',
                'school' => 'SLASS'
            ],
            [
                'role' => 'MANAGEMENT',
                'name' => 'Management Council',
                'email' => 'council@bnu.edu.pk',
                'school' => null
            ]
        ];

        foreach ($users as $userData) {
            $role = Role::where('role_name', $userData['role'])->first();
            $schoolId = null;
            if ($userData['school']) {
                $school = School::where('school_name', $userData['school'])->first();
                $schoolId = $school?->school_id;
            }

            User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'full_name' => $userData['name'],
                    'password' => Hash::make('password'), // standard password
                    'role_id' => $role->role_id,
                    'school_id' => $schoolId,
                    'created_at' => now(),
                ]
            );
        }
    }
}
