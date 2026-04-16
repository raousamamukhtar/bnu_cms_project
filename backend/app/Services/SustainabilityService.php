<?php

namespace App\Services;

use App\Models\SustainabilityPeriod;
use App\Models\PaperConsumption;
use App\Models\ElectricityConsumption;
use App\Models\WasteGeneration;
use App\Models\GeneratorUsage;
use App\Models\WaterConsumption;
use App\Models\CarbonMetric;
use Illuminate\Support\Facades\DB;

class SustainabilityService
{
    public function getOrCreatePeriod(array $data, int $userId)
    {
        return DB::transaction(function () use ($data, $userId) {
            $period = SustainabilityPeriod::where('data_month', $data['data_month'])
                ->where('data_year', $data['data_year'])
                ->first();

            if ($period) {
                if (isset($data['students']) && isset($data['employees'])) {
                    $period->update([
                        'students' => $data['students'],
                        'employees' => $data['employees'],
                    ]);
                    
                    // Trigger sync for all dependent metrics since personnel changed
                    $this->syncDependentMetrics($period->period_id);
                }
            } else {
                $period = SustainabilityPeriod::create([
                    'data_month' => $data['data_month'],
                    'data_year' => $data['data_year'],
                    'students' => $data['students'] ?? 0,
                    'employees' => $data['employees'] ?? 0,
                    'created_by' => $userId,
                    'created_at' => now(),
                ]);
            }

            return $period;
        });
    }

    public function retrievePeriodAndCalculatePersonnel(int $periodId)
    {
        $period = SustainabilityPeriod::findOrFail($periodId);
        return [
            'period' => $period,
            'totalPersonnel' => $period->students + $period->employees,
        ];
    }

    public function savePaperConsumption(array $data, int $periodId)
    {
        return DB::transaction(function () use ($data, $periodId) {
            $info = $this->retrievePeriodAndCalculatePersonnel($periodId);
            
            // Ensure required inputs are present
            $data['paper_reams'] = $data['paper_reams'] ?? 0;
            $data['sheets_per_ream'] = $data['sheets_per_ream'] ?? 500;

            if ($info['totalPersonnel'] > 0) {
                $totalSheets = $data['paper_reams'] * $data['sheets_per_ream'];
                $data['per_capita_ream'] = $totalSheets / $info['totalPersonnel'];
            } else {
                $data['per_capita_ream'] = 0;
            }

            return PaperConsumption::updateOrCreate(
                ['period_id' => $periodId],
                $data
            );
        });
    }

    public function saveElectricityConsumption(array $data, int $periodId)
    {
        return DB::transaction(function () use ($data, $periodId) {
            return ElectricityConsumption::updateOrCreate(
                ['period_id' => $periodId],
                $data
            );
        });
    }

    public function saveWasteGeneration(array $data, int $periodId)
    {
        return DB::transaction(function () use ($data, $periodId) {
            $info = $this->retrievePeriodAndCalculatePersonnel($periodId);
            
            // Fallback to 0 if metrics are missing
            $organic = $data['organic_kg'] ?? 0;
            $recyclable = $data['recyclable_kg'] ?? 0;
            $other = $data['other_kg'] ?? 0;
            
            $totalWaste = $organic + $recyclable + $other;
            $data['total_waste'] = $totalWaste;

            if ($info['totalPersonnel'] > 0) {
                $data['per_capita_waste'] = $totalWaste / $info['totalPersonnel'];
            } else {
                $data['per_capita_waste'] = 0;
            }

            return WasteGeneration::updateOrCreate(
                ['period_id' => $periodId],
                $data
            );
        });
    }

    public function saveGeneratorUsage(array $data, int $periodId)
    {
        return DB::transaction(function () use ($data, $periodId) {
            // Populate dependent columns for consistency
            if (isset($data['avg_running_hours']) && !isset($data['total_hours'])) {
                $data['total_hours'] = $data['avg_running_hours'];
            }
            if (isset($data['fuel_litres']) && !isset($data['diesel_litres'])) {
                $data['diesel_litres'] = $data['fuel_litres'];
            }
            
            return GeneratorUsage::updateOrCreate(
                ['period_id' => $periodId],
                $data
            );
        });
    }

    public function saveWaterConsumption(array $data, int $periodId)
    {
        return DB::transaction(function () use ($data, $periodId) {
            return WaterConsumption::updateOrCreate(
                ['period_id' => $periodId],
                $data
            );
        });
    }

    public function saveCarbonMetrics(array $data, int $periodId, int $userId)
    {
        return DB::transaction(function () use ($data, $periodId, $userId) {
            $data['entered_by'] = $userId;
            $data['created_at'] = $data['created_at'] ?? now();
            
            return CarbonMetric::updateOrCreate(
                ['period_id' => $periodId],
                $data
            );
        });
    }

    /**
     * Recalculates all dependent metrics when a period's data changed
     */
    public function syncDependentMetrics(int $periodId)
    {
        $info = $this->retrievePeriodAndCalculatePersonnel($periodId);
        $totalPersonnel = $info['totalPersonnel'];

        // Sync Paper Consumption
        $paper = PaperConsumption::where('period_id', $periodId)->first();
        if ($paper && $totalPersonnel > 0) {
            $paper->update([
                'per_capita_ream' => ($paper->paper_reams * $paper->sheets_per_ream) / $totalPersonnel
            ]);
        }

        // Sync Waste Generation
        $waste = WasteGeneration::where('period_id', $periodId)->first();
        if ($waste) {
            $totalWaste = $waste->organic_kg + $waste->recyclable_kg + $waste->other_kg;
            $updates = ['total_waste' => $totalWaste];
            if ($totalPersonnel > 0) {
                $updates['per_capita_waste'] = $totalWaste / $totalPersonnel;
            }
            $waste->update($updates);
        }
        
        return true;
    }
}
