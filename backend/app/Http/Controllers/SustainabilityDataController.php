<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SustainabilityData;

class SustainabilityDataController extends Controller
{
    public function store(Request $request)
    {
        $data = SustainabilityData::create([
            'DATA_YEAR'     => $request->DATA_YEAR,
            'DATA_MONTH'    => $request->DATA_MONTH,
            'AQI_SCORE'     => $request->AQI_SCORE,
            'CARBON_QTY'    => $request->CARBON_QTY,
            'LOCATION_NAME'=> $request->LOCATION_NAME ?? 'Main Campus',
        ]);

        return response()->json([
            'message' => 'Data inserted successfully',
            'data' => $data
        ], 201);
    }
}
