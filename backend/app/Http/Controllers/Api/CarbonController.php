<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CarbonMetric;
use App\Models\SustainabilityPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CarbonController extends Controller
{
    /**
     * Get all carbon metrics with period information
     */
    public function index(): JsonResponse
    {
        $metrics = CarbonMetric::with('period')
            ->join('sustainability_period', 'carbon_metrics.period_id', '=', 'sustainability_period.period_id')
            ->orderBy('sustainability_period.data_year', 'desc')
            ->orderBy('sustainability_period.data_month', 'desc')
            ->select('carbon_metrics.*')
            ->get()
            ->map(function ($metric) {
                $monthName = date("F", mktime(0, 0, 0, $metric->period->data_month, 10));
                
                return [
                    'id' => $metric->carbon_id,
                    'year' => (string) $metric->period->data_year,
                    'month' => $monthName,
                    'aqi' => (float) $metric->aqi_score,
                    'carbonFootprint' => (float) $metric->carbon_footprint,
                    'submittedAt' => $metric->created_at,
                ];
            });

        return response()->json($metrics);
    }

    /**
     * Store or update carbon metric
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'month' => 'required|string',
            'year' => 'required|integer',
            'aqi' => 'required|numeric|min:0',
            'carbonFootprint' => 'required|numeric|min:0',
        ]);

        // Convert month name to number
        $monthNumber = date('n', strtotime($validated['month']));

        // Find or create period
        $period = SustainabilityPeriod::firstOrCreate(
            [
                'data_month' => $monthNumber,
                'data_year' => $validated['year'],
            ],
            [
                'created_by' => $request->user()->user_id,
                'students' => 0,
                'employees' => 0,
                'created_at' => now(),
            ]
        );

        // Update or create carbon metric
        $metric = CarbonMetric::updateOrCreate(
            ['period_id' => $period->period_id],
            [
                'aqi_score' => $validated['aqi'],
                'carbon_footprint' => $validated['carbonFootprint'],
                'entered_by' => $request->user()->user_id,
                'created_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Carbon data saved successfully',
            'data' => [
                'id' => $metric->carbon_id,
                'year' => (string) $period->data_year,
                'month' => $validated['month'],
                'aqi' => (float) $metric->aqi_score,
                'carbonFootprint' => (float) $metric->carbon_footprint,
            ]
        ], 201);
    }

    /**
     * Update existing carbon metric
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'aqi' => 'required|numeric|min:0',
            'carbonFootprint' => 'required|numeric|min:0',
        ]);

        $metric = CarbonMetric::findOrFail($id);
        
        $metric->update([
            'aqi_score' => $validated['aqi'],
            'carbon_footprint' => $validated['carbonFootprint'],
            'created_at' => now(),
        ]);

        $monthName = date("F", mktime(0, 0, 0, $metric->period->data_month, 10));

        return response()->json([
            'message' => 'Carbon data updated successfully',
            'data' => [
                'id' => $metric->carbon_id,
                'year' => (string) $metric->period->data_year,
                'month' => $monthName,
                'aqi' => (float) $metric->aqi_score,
                'carbonFootprint' => (float) $metric->carbon_footprint,
            ]
        ]);
    }
}
