<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class MasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * This seeder prepares the project for production/delivery.
     */
    public function run(): void
    {
        $this->command->info("Starting Master Seeder for Production...");

        // 1. Core Infrastructure (Roles, Schools, Initial Users)
        $this->call(DataEntrySeeder::class);
        
        // 2. Additional Users (if needed for testing/demonstration)
        // $this->call(MultipleUsersSeeder::class);

        // 3. Historical Data
        $this->call(HistoricalDataSeeder::class);

        $this->command->info("Master Seeder completed! All data is coming from the database.");
    }
}
