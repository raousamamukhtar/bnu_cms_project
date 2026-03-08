<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SustainabilityPeriod;
use App\Models\PaperConsumption;
use App\Models\ElectricityConsumption;
use App\Models\WasteGeneration;
use App\Models\GeneratorUsage;

use App\Models\WaterConsumption;
use App\Models\CarbonMetric;
use App\Http\Requests\Sustainability\StorePeriodRequest;
use App\Http\Requests\Sustainability\StorePaperRequest;
use App\Http\Requests\Sustainability\StoreElectricityRequest;
use App\Http\Requests\Sustainability\StoreWasteRequest;
use App\Http\Requests\Sustainability\StoreGeneratorRequest;

use App\Http\Requests\Sustainability\StoreWaterRequest;
use App\Http\Requests\Sustainability\StoreCarbonRequest;
use Illuminate\Http\JsonResponse;

use App\Traits\ApiResponser;

class SustainabilityController extends Controller
{
    use ApiResponser;

    public function period(StorePeriodRequest $request): JsonResponse
    {
        $userId = $request->user()->user_id;

        // Check if period already exists
        $period = SustainabilityPeriod::where('data_month', $request->data_month)
            ->where('data_year', $request->data_year)
            ->first();

        if ($period) {
            // Period exists - only update if students/employees are provided
            if ($request->has('students') && $request->has('employees')) {
                $period->update([
                    'students' => $request->students,
                    'employees' => $request->employees,
                ]);
            }
        } else {
            // Create new period - require students and employees
            $period = SustainabilityPeriod::create([
                'data_month' => $request->data_month,
                'data_year' => $request->data_year,
                'students' => $request->students ?? 0,
                'employees' => $request->employees ?? 0,
                'created_by' => $userId,
                'created_at' => now(),
            ]);
        }

        return $this->successResponse($period, 'Sustainability period retrieved or created successfully');
    }

    public function paper(StorePaperRequest $request): JsonResponse
    {
        // Calculate per capita based on period
        $period = SustainabilityPeriod::findOrFail($request->period_id);
        $totalPersonnel = $period->students + $period->employees;
        
        $dataToSave = $request->validated();
        
        // Calculate per capita ream if personnel > 0
        // Formula: sheets / (avg student + employees)
        // Note: request has paper_reams and sheets_per_ream
        if ($totalPersonnel > 0) {
            $totalSheets = $request->paper_reams * $request->sheets_per_ream;
            $dataToSave['per_capita_ream'] = $totalSheets / $totalPersonnel;
        } else {
             $dataToSave['per_capita_ream'] = 0;
        }

        $data = PaperConsumption::updateOrCreate(
            ['period_id' => $request->period_id],
            $dataToSave
        );

        return $this->successResponse($data, 'Paper consumption saved');
    }

    public function electricity(StoreElectricityRequest $request): JsonResponse
    {
        // Just save the validated data including kwh_solar_offset
        $data = ElectricityConsumption::updateOrCreate(
            ['period_id' => $request->period_id],
            $request->validated()
        );

        return $this->successResponse($data, 'Electricity consumption saved');
    }

    public function waste(StoreWasteRequest $request): JsonResponse
    {
        $period = SustainabilityPeriod::findOrFail($request->period_id);
        $totalPersonnel = $period->students + $period->employees;

        $dataToSave = $request->validated();
        
        // Calculate total waste
        $totalWaste = $request->organic_kg + $request->recyclable_kg + $request->other_kg;
        $dataToSave['total_waste'] = $totalWaste;

        // Calculate per capita waste
        if ($totalPersonnel > 0) {
            $dataToSave['per_capita_waste'] = $totalWaste / $totalPersonnel;
        } else {
             $dataToSave['per_capita_waste'] = 0;
        }

        $data = WasteGeneration::updateOrCreate(
            ['period_id' => $request->period_id],
            $dataToSave
        );

        return $this->successResponse($data, 'Waste generation saved');
    }

    public function generator(StoreGeneratorRequest $request): JsonResponse
    {
        // For generator, we might receive new fields not yet in validated rules if we haven't updated Request yet.
        // But assuming Request validation will be updated too.
        // We need to map diesel_litres to fuel_litres for backward compatibility or just use new fields.
        
        $dataToSave = $request->validated();
        
        $data = GeneratorUsage::updateOrCreate(
            ['period_id' => $request->period_id],
            $dataToSave
        );

        return $this->successResponse($data, 'Generator usage saved');
    }



    public function water(StoreWaterRequest $request): JsonResponse
    {
        $data = WaterConsumption::updateOrCreate(
            ['period_id' => $request->period_id],
            $request->validated()
        );

        return $this->successResponse($data, 'Water consumption saved');
    }

    public function carbon(StoreCarbonRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['entered_by'] = $request->user()->user_id;

        $data = CarbonMetric::updateOrCreate(
            ['period_id' => $request->period_id],
            $validated
        );

        return $this->successResponse($data, 'Carbon metrics saved');
    }
}
