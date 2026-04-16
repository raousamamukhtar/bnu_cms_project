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
    
    /**
     * Get or create a sustainability period.
     * 
     * @param StorePeriodRequest $request
     * @return JsonResponse
     */
    public function period(StorePeriodRequest $request): JsonResponse
    {
        try {
            $period = $this->sustainabilityService->getOrCreatePeriod(
                $request->validated(), 
                $request->user()->user_id
            );

            return $this->successResponse(
                new SustainabilityPeriodResource($period), 
                'Sustainability period synchronized successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to manage period: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Save paper consumption data.
     * 
     * @param StorePaperRequest $request
     * @return JsonResponse
     */
    public function paper(StorePaperRequest $request): JsonResponse
    {
        try {
            $data = $this->sustainabilityService->savePaperConsumption(
                $request->validated(), 
                $request->period_id
            );

            return $this->successResponse(new JsonResource($data), 'Paper consumption saved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to save paper data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Save electricity consumption data.
     * 
     * @param StoreElectricityRequest $request
     * @return JsonResponse
     */
    public function electricity(StoreElectricityRequest $request): JsonResponse
    {
        try {
            $data = $this->sustainabilityService->saveElectricityConsumption(
                $request->validated(), 
                $request->period_id
            );

            return $this->successResponse(new JsonResource($data), 'Electricity consumption saved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to save electricity data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Save waste generation data.
     * 
     * @param StoreWasteRequest $request
     * @return JsonResponse
     */
    public function waste(StoreWasteRequest $request): JsonResponse
    {
        try {
            $data = $this->sustainabilityService->saveWasteGeneration(
                $request->validated(), 
                $request->period_id
            );

            return $this->successResponse(new JsonResource($data), 'Waste generation saved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to save waste data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Save generator usage data.
     * 
     * @param StoreGeneratorRequest $request
     * @return JsonResponse
     */
    public function generator(StoreGeneratorRequest $request): JsonResponse
    {
        try {
            $data = $this->sustainabilityService->saveGeneratorUsage(
                $request->validated(), 
                $request->period_id
            );

            return $this->successResponse(new JsonResource($data), 'Generator usage saved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to save generator data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Save water consumption data.
     * 
     * @param StoreWaterRequest $request
     * @return JsonResponse
     */
    public function water(StoreWaterRequest $request): JsonResponse
    {
        try {
            $data = $this->sustainabilityService->saveWaterConsumption(
                $request->validated(), 
                $request->period_id
            );

            return $this->successResponse(new JsonResource($data), 'Water consumption saved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to save water data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Save carbon metrics data.
     * 
     * @param StoreCarbonRequest $request
     * @return JsonResponse
     */
    public function carbon(StoreCarbonRequest $request): JsonResponse
    {
        try {
            $data = $this->sustainabilityService->saveCarbonMetrics(
                $request->validated(), 
                $request->period_id, 
                $request->user()->user_id
            );

            return $this->successResponse(new JsonResource($data), 'Carbon metrics saved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to save carbon data: ' . $e->getMessage(), 500);
        }
    }
}
