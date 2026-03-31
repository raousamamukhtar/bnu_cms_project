<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\EnvironmentService;
use App\Http\Requests\Environment\StoreEnvironmentDataRequest;
use App\Http\Resources\EnvironmentDataResource;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponser;

class EnvironmentController extends Controller
{
    use ApiResponser;

    public function __construct(protected EnvironmentService $environmentService) {}

    public function index(): JsonResponse
    {
        $data = $this->environmentService->getAll();
        return $this->successResponse(EnvironmentDataResource::collection($data), 'Environment data retrieved successfully');
    }

    public function store(StoreEnvironmentDataRequest $request): JsonResponse
    {
        try {
            $entry = $this->environmentService->create($request->validated());
            return $this->successResponse(new EnvironmentDataResource($entry), 'Data recorded successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Oracle Error: ' . $e->getMessage(), 500);
        }
    }
}