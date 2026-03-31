<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $monthName = date("F", mktime(0, 0, 0, $this->data_month, 10));
        
        $students = $this->students;
        $employees = $this->employees;
        $totalPeople = ($students !== null && $employees !== null) ? ($students + $employees) : 0;

        return [
            'period' => [
                'month' => $monthName,
                'year' => (int) $this->data_year,
            ],
            'personnel' => [
                'students' => $students,
                'employees' => $employees,
                'total' => $totalPeople,
            ],
            'paper' => $this->relationLoaded('paper') && $this->paper ? [
                'reams' => (float) $this->paper->paper_reams,
                'sheetsPerReam' => (int) $this->paper->sheets_per_ream,
                'totalSheets' => $this->paper->paper_reams * $this->paper->sheets_per_ream,
                'perCapitaReams' => $totalPeople > 0 ? round($this->paper->paper_reams / $totalPeople, 3) : 0,
            ] : null,
            'electricity' => $this->relationLoaded('electricity') && $this->electricity ? [
                'units' => (float) $this->electricity->units_kwh,
                'totalCost' => (float) $this->electricity->total_cost,
                'kwh_solar_offset' => (float) ($this->electricity->kwh_solar_offset ?? 0),
                'perUnitRate' => $this->electricity->units_kwh > 0 ? round($this->electricity->total_cost / $this->electricity->units_kwh) : 0,
                'perCapitaConsumption' => $totalPeople > 0 ? round($this->electricity->units_kwh / $totalPeople) : 0,
            ] : null,
            'waste' => $this->relationLoaded('waste') && $this->waste ? [
                'organic' => (float) $this->waste->organic_kg,
                'recyclables' => (float) $this->waste->recyclable_kg,
                'others' => (float) $this->waste->other_kg,
                'total' => (float) ($this->waste->organic_kg + $this->waste->recyclable_kg + $this->waste->other_kg),
                'perCapitaGeneration' => $totalPeople > 0 ? round(($this->waste->organic_kg + $this->waste->recyclable_kg + $this->waste->other_kg) / $totalPeople, 3) : 0,
            ] : null,
            'generator' => $this->relationLoaded('generator') && $this->generator ? [
                'avgRunningHours' => (float) $this->generator->avg_running_hours,
                'fuelLitres' => (float) $this->generator->fuel_litres,
                'total_hours' => (float) ($this->generator->total_hours ?? 0),
                'diesel_litres' => (float) ($this->generator->diesel_litres ?? 0),
                'fuel_type' => $this->generator->fuel_type ?? '',
                'cost' => (float) ($this->generator->cost ?? 0),
            ] : null,
            'water' => $this->relationLoaded('water') && $this->water ? [
                'units' => (float) $this->water->units,
                'pricePerUnit' => (float) $this->water->price_per_unit,
                'totalCost' => $this->water->units * $this->water->price_per_unit,
            ] : null,
            'carbon' => $this->relationLoaded('carbon') && $this->carbon ? [
                'aqi' => (float) $this->carbon->aqi_score,
                'carbonFootprint' => (float) $this->carbon->carbon_footprint,
            ] : null,
            'submittedAt' => $this->created_at,
            'submittedBy' => 'admin', 
        ];
    }
}
