<?php

namespace App\Services;

use App\Models\CarbonMetric;
use App\Models\SustainabilityPeriod;
use Illuminate\Support\Facades\DB;

class CarbonService
{
    /**
     * Retrieve all carbon metrics with their associated sustainability periods.
     * Sorted chronologically (Year desc, then Month desc).
     * 
     * @return \Illuminate\Support\Collection
     */
    public function getAll()
    {
        return CarbonMetric::with('period')
            ->get()
            ->sortByDesc(fn ($metric) => $metric->period?->data_year)
            ->sortByDesc(fn ($metric) => $metric->period?->data_month)
            ->values();
    }

    /**
     * Create or update a carbon metric for a specific month/year.
     * Automatically handles the lookup/creation of the underlying SustainabilityPeriod.
     * 
     * @param array $data Contains 'month' (string), 'year', 'aqi', 'carbonFootprint'
     * @param int $userId ID of the user performing the action
     * @return CarbonMetric
     */
    public function createOrUpdateMetric(array $data, int $userId): CarbonMetric
    {
        return DB::transaction(function () use ($data, $userId) {
            // Convert month name to numeric (e.g. "January" -> 1)
            $monthNumber = date('n', strtotime($data['month']));

            // Ensure a parent period exists for this data
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

            // Create or update the specific carbon metrics for that period
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

    /**
     * Update an existing carbon metric by ID.
     * 
     * @param int $id
     * @param array $data Updated metrics
     * @return CarbonMetric
     */
    public function updateMetric(int $id, array $data): CarbonMetric
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

    /**
     * Permanently delete a carbon metric record.
     * 
     * @param int $id
     * @return bool|null
     */
    public function deleteMetric(int $id)
    {
        return DB::transaction(function () use ($id) {
            $metric = CarbonMetric::findOrFail($id);
            return $metric->delete();
        });
    }
}
