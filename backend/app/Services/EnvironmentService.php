<?php

namespace App\Services;

use App\Models\EnvironmentData;
use Illuminate\Support\Facades\DB;

class EnvironmentService
{
    public function getAll()
    {
        return EnvironmentData::orderBy('recorded_year', 'desc')
            ->orderBy('recorded_month', 'desc')
            ->get();
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            return EnvironmentData::create($data);
        });
    }
}
