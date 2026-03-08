<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SustainabilityPeriod;
use App\Models\PaperConsumption;
use App\Models\ElectricityConsumption;
use App\Models\WaterConsumption;
use App\Models\WasteGeneration;
use App\Models\GeneratorUsage;
use App\Models\CarbonMetric;
use App\Models\User;
use Carbon\Carbon;

class Year2025DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Use Sustainability Admin (admin@bnu.edu.pk) as creator
        $admin = User::where('email', 'admin@bnu.edu.pk')->first();
        if (!$admin) {
            $this->command->error('Sustainability Admin not found. Please run DataEntrySeeder first.');
            return;
        }

        $creatorId = $admin->user_id;

        $data = [
            ['month' => 1, 'paper' => 50, 'sheets' => 25000, 'elec_kwh' => 1200, 'elec_cost' => 0.07, 'water' => 450, 'waste' => 120, 'fuel' => 25, 'aqi' => 280, 'carbon' => 1.15],
            ['month' => 2, 'paper' => 48, 'sheets' => 24000, 'elec_kwh' => 1100, 'elec_cost' => 0.07, 'water' => 420, 'waste' => 115, 'fuel' => 20, 'aqi' => 240, 'carbon' => 1.05],
            ['month' => 3, 'paper' => 55, 'sheets' => 27500, 'elec_kwh' => 1500, 'elec_cost' => 0.09, 'water' => 500, 'waste' => 135, 'fuel' => 30, 'aqi' => 180, 'carbon' => 1.40],
            ['month' => 4, 'paper' => 52, 'sheets' => 26000, 'elec_kwh' => 3200, 'elec_cost' => 0.20, 'water' => 800, 'waste' => 130, 'fuel' => 50, 'aqi' => 120, 'carbon' => 2.90],
            ['month' => 5, 'paper' => 60, 'sheets' => 30000, 'elec_kwh' => 5800, 'elec_cost' => 0.37, 'water' => 1200, 'waste' => 150, 'fuel' => 180, 'aqi' => 95, 'carbon' => 5.40],
            ['month' => 6, 'paper' => 45, 'sheets' => 22500, 'elec_kwh' => 7500, 'elec_cost' => 0.48, 'water' => 1600, 'waste' => 145, 'fuel' => 250, 'aqi' => 80, 'carbon' => 7.10],
            ['month' => 7, 'paper' => 42, 'sheets' => 21000, 'elec_kwh' => 7200, 'elec_cost' => 0.46, 'water' => 1550, 'waste' => 155, 'fuel' => 220, 'aqi' => 70, 'carbon' => 6.80],
            ['month' => 8, 'paper' => 48, 'sheets' => 24000, 'elec_kwh' => 6500, 'elec_cost' => 0.42, 'water' => 1400, 'waste' => 140, 'fuel' => 190, 'aqi' => 85, 'carbon' => 6.10],
            ['month' => 9, 'paper' => 52, 'sheets' => 26000, 'elec_kwh' => 4800, 'elec_cost' => 0.31, 'water' => 950, 'waste' => 135, 'fuel' => 110, 'aqi' => 140, 'carbon' => 4.50],
            ['month' => 10, 'paper' => 58, 'sheets' => 29000, 'elec_kwh' => 2800, 'elec_cost' => 0.18, 'water' => 700, 'waste' => 145, 'fuel' => 45, 'aqi' => 320, 'carbon' => 2.60],
            ['month' => 11, 'paper' => 55, 'sheets' => 27500, 'elec_kwh' => 1600, 'elec_cost' => 0.10, 'water' => 500, 'waste' => 130, 'fuel' => 30, 'aqi' => 410, 'carbon' => 1.55],
            ['month' => 12, 'paper' => 50, 'sheets' => 25000, 'elec_kwh' => 1300, 'elec_cost' => 0.08, 'water' => 450, 'waste' => 125, 'fuel' => 35, 'aqi' => 460, 'carbon' => 1.25],
        ];

        foreach ($data as $row) {
            // 1. Create Sustainability Period
            $period = SustainabilityPeriod::updateOrCreate(
                ['data_month' => $row['month'], 'data_year' => 2025],
                [
                    'created_by' => $creatorId,
                    'created_at' => now(),
                    'students' => 1500, // Dummy value
                    'employees' => 200,   // Dummy value
                ]
            );

            $periodId = $period->period_id;

            // 2. Paper Consumption
            PaperConsumption::updateOrCreate(
                ['period_id' => $periodId],
                [
                    'paper_reams' => $row['paper'],
                    'sheets_per_ream' => 500,
                ]
            );

            // 3. Electricity Consumption
            ElectricityConsumption::updateOrCreate(
                ['period_id' => $periodId],
                [
                    'units_kwh' => $row['elec_kwh'],
                    'total_cost' => $row['elec_cost'] * 1000000,
                ]
            );

            // 4. Water Consumption
            WaterConsumption::updateOrCreate(
                ['period_id' => $periodId],
                [
                    'units' => $row['water'],
                    'price_per_unit' => 0,
                ]
            );

            // 5. Waste Generation
            WasteGeneration::updateOrCreate(
                ['period_id' => $periodId],
                [
                    'organic_kg' => 0,
                    'recyclable_kg' => 0,
                    'other_kg' => $row['waste'],
                ]
            );

            // 6. Generator Usage
            GeneratorUsage::updateOrCreate(
                ['period_id' => $periodId],
                [
                    'avg_running_hours' => 0,
                    'fuel_litres' => $row['fuel'],
                ]
            );

            // 7. Carbon Metric
            CarbonMetric::updateOrCreate(
                ['period_id' => $periodId],
                [
                    'aqi_score' => $row['aqi'],
                    'carbon_footprint' => $row['carbon'],
                    'entered_by' => $creatorId,
                    'created_at' => now(),
                ]
            );
        }

        $this->command->info('2025 Dummy Data Seeded Successfully!');
    }
}
