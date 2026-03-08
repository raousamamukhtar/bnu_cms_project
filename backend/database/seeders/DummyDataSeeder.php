<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SustainabilityPeriod;
use App\Models\PaperConsumption;
use App\Models\ElectricityConsumption;
use App\Models\WasteGeneration;
use App\Models\GeneratorUsage;

use App\Models\WaterConsumption;
use App\Models\CarbonMetric;
use App\Models\User;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // Get Admin User
        $admin = User::where('email', 'admin@bnu.edu.pk')->first() ?? User::first();
        if (!$admin) {
            $this->command->error("No admin user found. Run DataEntrySeeder first.");
            return;
        }

        // Cleanup existing data
        SustainabilityPeriod::query()->delete();

        $years = [2025];
        // Generate data for all 12 months of 2025
        $months = range(1, 12);

        foreach ($years as $year) {
            foreach ($months as $month) {

                $period = SustainabilityPeriod::create(
                    [
                        'data_month' => $month,
                        'data_year' => $year,
                        'created_by' => $admin->user_id,
                        'students' => rand(4800, 5200),
                        'employees' => rand(480, 520),
                        'created_at' => now()->setYear($year)->setMonth($month)->startOfMonth(),
                    ]
                );

                // 2. Paper
                PaperConsumption::create(
                    [
                        'period_id' => $period->period_id,
                        'paper_reams' => rand(50, 150),
                        'sheets_per_ream' => 500,
                    ]
                );

                // 3. Electricity
                ElectricityConsumption::create(
                    [
                        'period_id' => $period->period_id,
                        'units_kwh' => rand(40000, 60000),
                        'total_cost' => rand(1500000, 2500000),
                    ]
                );

                // 4. Water
                WaterConsumption::create(
                    [
                        'period_id' => $period->period_id,
                        'units' => rand(1000, 3000), // gallons or m3
                        'price_per_unit' => 250,
                    ]
                );

                // 5. Waste
                WasteGeneration::create(
                    [
                        'period_id' => $period->period_id,
                        'organic_kg' => rand(200, 400),
                        'recyclable_kg' => rand(100, 300),
                        'other_kg' => rand(50, 150),
                    ]
                );

                // 6. Generator
                GeneratorUsage::create(
                    [
                        'period_id' => $period->period_id,
                        'avg_running_hours' => rand(10, 50),
                        'fuel_litres' => rand(200, 800),
                    ]
                );


                // 8. Carbon Metric
                CarbonMetric::create(
                    [
                        'period_id' => $period->period_id,
                        'aqi_score' => rand(50, 150),
                        'carbon_footprint' => rand(100, 300), // tonnes CO2e
                        'entered_by' => $admin->user_id,
                        'created_at' => now()->setYear($year)->setMonth($month)->startOfMonth(),
                    ]
                );
            }
        }
    }
}
