<?php

namespace App\Http\Controllers;

use App\Services\SustainabilityDataService;
use App\Http\Requests\SustainabilityData\StoreSustainabilityDataRequest;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponser;

class SustainabilityDataController extends Controller
{
    use ApiResponser;

    public function __construct(protected SustainabilityDataService $dataService) {}

    public function store(StoreSustainabilityDataRequest $request): JsonResponse
    {
        $data = $this->dataService->createData($request->validated());

        return $this->successResponse(new JsonResource($data), 'Data inserted successfully', 201);
    }
}
