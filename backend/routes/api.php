<?php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/test-db', function () {
    try {
        // This runs a simple query on Oracle's dual table
        $results = DB::select("SELECT USER, SYS_CONTEXT('USERENV', 'DB_NAME') as DB FROM dual");
        
        return response()->json([
            'status' => 'success',
            'message' => 'Connected to Oracle successfully!',
            'data' => $results[0]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});