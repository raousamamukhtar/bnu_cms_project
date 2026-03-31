<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnvironmentDataResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id ?? $this->environment_id,
            'recorded_year' => $this->recorded_year,
            'recorded_month' => $this->recorded_month,
            'aqi_index' => $this->aqi_index,
            'carbon_footprint' => $this->carbon_footprint,
            'created_at' => $this->created_at,
        ];
    }
}
