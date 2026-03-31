<?php

namespace App\Services;

use App\Models\CarbonMetric;
use App\Models\SustainabilityPeriod;
use Illuminate\Support\Facades\DB;

class CarbonService
{
    public function getAll()
    {
        return CarbonMetric::with('period')
            ->get()
            ->sortByDesc(fn ($metric) => $metric->period->data_year)
            ->sortByDesc(fn ($metric) => $metric->period->data_month)
            ->values();
    }

    public function createOrUpdateMetric(array $data, int $userId)
    {
        return DB::transaction(function () use ($data, $userId) {
            $monthNumber = date('n', strtotime($data['month']));

            $period = SustainabilityPeriod::firstOrCreate(
                [
                    'data_month' => $monthNumber,
                    'data_year' => $data['year'],
                ],
                [
                    'created_by' => $userId,
                    'students' => 0,
                    'employees' => 0,
                    'created_at' => now(),
                ]
            );

            return CarbonMetric::updateOrCreate(
                ['period_id' => $period->period_id],
                [
                    'aqi_score' => $data['aqi'],
                    'carbon_footprint' => $data['carbonFootprint'],
                    'entered_by' => $userId,
                    'created_at' => now(),
                ]
            );
        });
    }

    public function updateMetric(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $metric = CarbonMetric::findOrFail($id);
            $metric->update([
                'aqi_score' => $data['aqi'] ?? $metric->aqi_score,
                'carbon_footprint' => $data['carbonFootprint'] ?? $metric->carbon_footprint,
                'created_at' => now(),
            ]);
            return $metric;
        });
    }
}
