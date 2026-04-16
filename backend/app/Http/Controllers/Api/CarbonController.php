<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CarbonService;
use App\Http\Requests\Carbon\StoreCarbonMetricRequest;
use App\Http\Requests\Carbon\UpdateCarbonMetricRequest;
use App\Http\Resources\CarbonMetricResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Traits\ApiResponser;

class CarbonController extends Controller
{
    use ApiResponser;

    public function __construct(protected CarbonService $carbonService) {}

    public function index(): JsonResponse
    {
        $metrics = $this->carbonService->getAll();
        return $this->successResponse(CarbonMetricResource::collection($metrics), 'Carbon metrics retrieved successfully');
    }

    public function store(StoreCarbonMetricRequest $request): JsonResponse
    {
        $metric = $this->carbonService->createOrUpdateMetric($request->validated(), $request->user()->user_id);
        return $this->successResponse(new CarbonMetricResource($metric), 'Carbon data saved successfully', 201);
    }

    public function update(UpdateCarbonMetricRequest $request, $id): JsonResponse
    {
        $metric = $this->carbonService->updateMetric($id, $request->validated());
        return $this->successResponse(new CarbonMetricResource($metric), 'Carbon data updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->carbonService->deleteMetric($id);
        return $this->successResponse(null, 'Carbon data deleted successfully');
    }
}
