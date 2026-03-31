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
            
            $totalWaste = $data['organic_kg'] + $data['recyclable_kg'] + $data['other_kg'];
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
            return CarbonMetric::updateOrCreate(
                ['period_id' => $periodId],
                $data
            );
        });
    }
}
