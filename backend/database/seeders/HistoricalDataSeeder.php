<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\SustainabilityPeriod;
use App\Models\PaperConsumption;
use App\Models\ElectricityConsumption;
use App\Models\WasteGeneration;
use App\Models\GeneratorUsage;

class HistoricalDataSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('seeders/data_dump.json');
        if (!file_exists($jsonPath)) {
            $this->command->error("Data dump file not found at {$jsonPath}");
            return;
        }

        $data = json_decode(file_get_contents($jsonPath), true);
        if (!$data) {
            $this->command->error("Invalid JSON data in {$jsonPath}");
            return;
        }

        $this->command->info("Starting historical data seeding...");

        // Map old IDs to new IDs to maintain relationships if needed
        // But since we are seeding a fresh DB, we might want to just insert as is if possible
        // or recreate the relationships.
        
        $periodIdMap = [];

        // 1. Seed Periods
        foreach ($data['periods'] as $period) {
            $newPeriod = SustainabilityPeriod::create([
                'data_month' => $period['data_month'],
                'data_year' => $period['data_year'],
                'students' => $period['students'],
                'employees' => $period['employees'],
                'created_by' => 1, // Defaulting to first admin
                'created_at' => $period['created_at'],
            ]);
            $periodIdMap[$period['period_id']] = $newPeriod->period_id;
        }
        $this->command->info("Seeded " . count($periodIdMap) . " periods.");

        // 2. Seed Paper
        foreach ($data['paper'] as $item) {
            if (isset($periodIdMap[$item['period_id']])) {
                PaperConsumption::create([
                    'period_id' => $periodIdMap[$item['period_id']],
                    'paper_reams' => $item['paper_reams'],
                    'sheets_per_ream' => $item['sheets_per_ream'],
                    'per_capita_ream' => $item['per_capita_ream'],
                ]);
            }
        }
        $this->command->info("Seeded paper consumption records.");

        // 3. Seed Electricity
        foreach ($data['electricity'] as $item) {
            if (isset($periodIdMap[$item['period_id']])) {
                ElectricityConsumption::create([
                    'period_id' => $periodIdMap[$item['period_id']],
                    'units_kwh' => $item['units_kwh'],
                    'total_cost' => $item['total_cost'],
                    'kwh_solar_offset' => $item['kwh_solar_offset'],
                ]);
            }
        }
        $this->command->info("Seeded electricity consumption records.");

        // 4. Seed Waste
        foreach ($data['waste'] as $item) {
            if (isset($periodIdMap[$item['period_id']])) {
                WasteGeneration::create([
                    'period_id' => $periodIdMap[$item['period_id']],
                    'organic_kg' => $item['organic_kg'],
                    'recyclable_kg' => $item['recyclable_kg'],
                    'other_kg' => $item['other_kg'],
                    'total_waste' => $item['total_waste'],
                    'per_capita_waste' => $item['per_capita_waste'],
                ]);
            }
        }
        $this->command->info("Seeded waste generation records.");

        // 5. Seed Generator
        foreach ($data['generator'] as $item) {
            if (isset($periodIdMap[$item['period_id']])) {
                GeneratorUsage::create([
                    'period_id' => $periodIdMap[$item['period_id']],
                    'avg_running_hours' => $item['avg_running_hours'],
                    'fuel_litres' => $item['fuel_litres'],
                    'total_hours' => $item['total_hours'],
                    'diesel_litres' => $item['diesel_litres'],
                    'fuel_type' => $item['fuel_type'],
                    'cost' => $item['cost'],
                ]);
            }
        }
        $this->command->info("Seeded generator usage records.");

        $this->command->info("Historical data seeding completed successfully!");
    }
}
