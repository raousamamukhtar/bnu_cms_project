<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Http\Resources\DashboardResource;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponser;

class ReportController extends Controller
{
    use ApiResponser;

    public function __construct(protected ReportService $reportService) {}

    public function dashboard(): JsonResponse
    {
        $periods = $this->reportService->getDashboardData();
        return $this->successResponse(DashboardResource::collection($periods), 'Dashboard data retrieved successfully');
    }
}
