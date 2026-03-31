<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarbonMetricResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Using object syntax rather than associative array depending on relation load
        $monthName = null;
        $year = null;

        if ($this->relationLoaded('period') && $this->period) {
            $monthName = date("F", mktime(0, 0, 0, $this->period->data_month, 10));
            $year = (string) $this->period->data_year;
        }

        return [
            'id' => $this->carbon_id,
            'year' => $year,
            'month' => $monthName,
            'aqi' => (float) $this->aqi_score,
            'carbonFootprint' => (float) $this->carbon_footprint,
            'submittedAt' => $this->created_at,
        ];
    }
}
