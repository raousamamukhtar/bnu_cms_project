<?php

namespace App\Services;

use App\Models\SustainabilityData;
use Illuminate\Support\Facades\DB;

class SustainabilityDataService
{
    public function createData(array $data)
    {
        return DB::transaction(function () use ($data) {
            return SustainabilityData::create([
                'DATA_YEAR'     => $data['DATA_YEAR'],
                'DATA_MONTH'    => $data['DATA_MONTH'],
                'AQI_SCORE'     => $data['AQI_SCORE'],
                'CARBON_QTY'    => $data['CARBON_QTY'],
                'LOCATION_NAME' => $data['LOCATION_NAME'] ?? 'Main Campus',
            ]);
        });
    }
}
