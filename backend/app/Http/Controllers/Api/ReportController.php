<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SustainabilityPeriod;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $periods = SustainabilityPeriod::with([
            'paper', 'electricity', 'waste', 'generator', 'water', 'carbon'
        ])
        ->orderBy('data_year', 'desc')
        ->orderBy('data_month', 'desc')
        ->get();

        $formatted = $periods->map(function ($period) {
            // Map month number to name
            $monthName = date("F", mktime(0, 0, 0, $period->data_month, 10));
            
            // Hardcoded personnel for now or add to database schema if needed
            // The prompt schema didn't have students/employees in sustainability_period table, 
            // but the frontend form asks for it (Step 1). 
            // I will return 0 or mock it if not in DB.
            // Actually, I should probably add these columns to the period table or a 'campus_population' table.
            // For now, let's look at the models I created. SustainabilityPeriod only has month/year.
            // I will assume 0 for distinct calculation or add migration if critical. 
            // Let's assume we return 0 total people for now to avoid errors, or update schema later.
            
            // Wait, looking at the frontend code `data.step1.students`, it seems this is entered every month.
            // To support this, I should add 'students' and 'employees' columns to `sustainability_period` table.
            
            $students = $period->students;
            $employees = $period->employees;
            $totalPeople = ($students !== null && $employees !== null) ? ($students + $employees) : 0;

            return [
                'period' => [
                    'month' => $monthName,
                    'year' => (int) $period->data_year,
                ],
                'personnel' => [
                    'students' => $students,
                    'employees' => $employees,
                    'total' => $totalPeople,
                ],
                'paper' => $period->paper ? [
                    'reams' => (float) $period->paper->paper_reams,
                    'sheetsPerReam' => (int) $period->paper->sheets_per_ream,
                    'totalSheets' => $period->paper->paper_reams * $period->paper->sheets_per_ream,
                    'perCapitaReams' => $totalPeople > 0 ? round($period->paper->paper_reams / $totalPeople, 3) : 0,
                ] : null,
                'electricity' => $period->electricity ? [
                    'units' => (float) $period->electricity->units_kwh,
                    'totalCost' => (float) $period->electricity->total_cost,
                    'kwh_solar_offset' => (float) ($period->electricity->kwh_solar_offset ?? 0),
                    'perUnitRate' => $period->electricity->units_kwh > 0 ? round($period->electricity->total_cost / $period->electricity->units_kwh) : 0,
                    'perCapitaConsumption' => $totalPeople > 0 ? round($period->electricity->units_kwh / $totalPeople) : 0,
                ] : null,
                'waste' => $period->waste ? [
                    'organic' => (float) $period->waste->organic_kg,
                    'recyclables' => (float) $period->waste->recyclable_kg,
                    'others' => (float) $period->waste->other_kg,
                    'total' => (float) ($period->waste->organic_kg + $period->waste->recyclable_kg + $period->waste->other_kg),
                    'perCapitaGeneration' => $totalPeople > 0 ? round(($period->waste->organic_kg + $period->waste->recyclable_kg + $period->waste->other_kg) / $totalPeople, 3) : 0,
                ] : null,
                'generator' => $period->generator ? [
                    'avgRunningHours' => (float) $period->generator->avg_running_hours,
                    'fuelLitres' => (float) $period->generator->fuel_litres,
                    'total_hours' => (float) ($period->generator->total_hours ?? 0),
                    'diesel_litres' => (float) ($period->generator->diesel_litres ?? 0),
                    'fuel_type' => $period->generator->fuel_type ?? '',
                    'cost' => (float) ($period->generator->cost ?? 0),
                ] : null,

                'water' => $period->water ? [
                    'units' => (float) $period->water->units,
                    'pricePerUnit' => (float) $period->water->price_per_unit,
                    'totalCost' => $period->water->units * $period->water->price_per_unit,
                ] : null,
                'carbon' => $period->carbon ? [
                    'aqi' => (float) $period->carbon->aqi_score,
                    'carbonFootprint' => (float) $period->carbon->carbon_footprint,
                ] : null,
                'submittedAt' => $period->created_at,
                'submittedBy' => 'admin', // Placeholder or relation
            ];
        });

        return response()->json($formatted);
    }
}
