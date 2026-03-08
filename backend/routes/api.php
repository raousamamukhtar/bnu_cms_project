<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SustainabilityController;
use App\Http\Controllers\Api\EventController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make sure something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication routes
Route::post('/auth/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/auth/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);


Route::group([], function () {
    Route::get('/reports/dashboard', [\App\Http\Controllers\Api\ReportController::class, 'dashboard']);
});

// Sustainability Routes - Require Authentication
Route::middleware('auth:sanctum')->prefix('sustainability')->group(function () {
    // Sustainability Admin Period Management
    Route::post('/period', [SustainabilityController::class, 'period']);

    // Consumption Data Components
    Route::post('/paper', [SustainabilityController::class, 'paper']);
    Route::post('/electricity', [SustainabilityController::class, 'electricity']);
    Route::post('/waste', [SustainabilityController::class, 'waste']);
    Route::post('/generator', [SustainabilityController::class, 'generator']);

    Route::post('/water', [SustainabilityController::class, 'water']);

    // Carbon Accountant (Dedicated endpoints)
    Route::get('/carbon', [\App\Http\Controllers\Api\CarbonController::class, 'index']);
    Route::post('/carbon', [\App\Http\Controllers\Api\CarbonController::class, 'store']);
    Route::put('/carbon/{id}', [\App\Http\Controllers\Api\CarbonController::class, 'update']);
});

// Events (Accessible by coordinators, HR, marketing) - Requires Authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);
});
