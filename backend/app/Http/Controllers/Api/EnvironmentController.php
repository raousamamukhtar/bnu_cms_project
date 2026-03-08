<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EnvironmentData; // Ensure this model exists
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EnvironmentController extends Controller
{
    /**
     * Display a listing of environment data.
     */
    public function index()
    {
        // Fetch all records from Oracle
        $data = EnvironmentData::orderBy('recorded_year', 'desc')
                               ->orderBy('recorded_month', 'desc')
                               ->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    /**
     * Store a new environment record.
     */
    public function store(Request $request)
    {
        // 1. Validation
        $validator = Validator::make($request->all(), [
            'recorded_year'    => 'required|integer|min:2000|max:2099',
            'recorded_month'   => 'required|string',
            'aqi_index'        => 'required|integer',
            'carbon_footprint' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Save to Oracle
        try {
            $entry = EnvironmentData::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Data recorded successfully',
                'data' => $entry
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Oracle Error: ' . $e->getMessage()
            ], 500);
        }
    }
}