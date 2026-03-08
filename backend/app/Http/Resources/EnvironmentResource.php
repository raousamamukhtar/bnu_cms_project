<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnvironmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
   public function toArray($request)
{
    return [
        'id' => $this->id,
        'year' => $this->recorded_year,
        'month' => $this->recorded_month,
        'aqi' => (int) $this->aqi_index,
        'carbon' => (float) $this->carbon_footprint,
    ];
}
}
