<?php

namespace App\Services;

use App\Models\SustainabilityPeriod;

class ReportService
{
    public function getDashboardData()
    {
        return SustainabilityPeriod::with([
            'paper', 'electricity', 'waste', 'generator', 'water', 'carbon'
        ])
        ->orderBy('data_year', 'desc')
        ->orderBy('data_month', 'desc')
        ->get();
    }
}
