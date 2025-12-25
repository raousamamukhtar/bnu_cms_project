<?php

use Illuminate\Support\Facades\DB;

Route::get('/test-db', function () {
    try {
        DB::connection('oracle')->getPdo();
        return "Successfully connected to Oracle: " . DB::connection('oracle')->getDatabaseName();
    } catch (\Exception $e) {
        return "Connection failed: " . $e->getMessage();
    }
});