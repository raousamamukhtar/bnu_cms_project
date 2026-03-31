<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SustainabilityService;
use App\Http\Requests\Sustainability\StorePeriodRequest;
use App\Http\Requests\Sustainability\StorePaperRequest;
use App\Http\Requests\Sustainability\StoreElectricityRequest;
use App\Http\Requests\Sustainability\StoreWasteRequest;
use App\Http\Requests\Sustainability\StoreGeneratorRequest;
use App\Http\Requests\Sustainability\StoreWaterRequest;
use App\Http\Requests\Sustainability\StoreCarbonRequest;
use App\Http\Resources\SustainabilityPeriodResource;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponser;

class SustainabilityController extends Controller
{
    use ApiResponser;

    public function __construct(protected SustainabilityService $sustainabilityService) {}

    public function period(StorePeriodRequest $request): JsonResponse
    {
        $period = $this->sustainabilityService->getOrCreatePeriod(
            $request->validated(), 
            $request->user()->user_id
        );

        return $this->successResponse(new SustainabilityPeriodResource($period), 'Sustainability period retrieved or created successfully');
    }

    public function paper(StorePaperRequest $request): JsonResponse
    {
        $data = $this->sustainabilityService->savePaperConsumption(
            $request->validated(), 
            $request->period_id
        );

        return $this->successResponse(new JsonResource($data), 'Paper consumption saved');
    }

    public function electricity(StoreElectricityRequest $request): JsonResponse
    {
        $data = $this->sustainabilityService->saveElectricityConsumption(
            $request->validated(), 
            $request->period_id
        );

        return $this->successResponse(new JsonResource($data), 'Electricity consumption saved');
    }

    public function waste(StoreWasteRequest $request): JsonResponse
    {
        $data = $this->sustainabilityService->saveWasteGeneration(
            $request->validated(), 
            $request->period_id
        );

        return $this->successResponse(new JsonResource($data), 'Waste generation saved');
    }

    public function generator(StoreGeneratorRequest $request): JsonResponse
    {
        $data = $this->sustainabilityService->saveGeneratorUsage(
            $request->validated(), 
            $request->period_id
        );

        return $this->successResponse(new JsonResource($data), 'Generator usage saved');
    }

    public function water(StoreWaterRequest $request): JsonResponse
    {
        $data = $this->sustainabilityService->saveWaterConsumption(
            $request->validated(), 
            $request->period_id
        );

        return $this->successResponse(new JsonResource($data), 'Water consumption saved');
    }

    public function carbon(StoreCarbonRequest $request): JsonResponse
    {
        $data = $this->sustainabilityService->saveCarbonMetrics(
            $request->validated(), 
            $request->period_id, 
            $request->user()->user_id
        );

        return $this->successResponse(new JsonResource($data), 'Carbon metrics saved');
    }
}
