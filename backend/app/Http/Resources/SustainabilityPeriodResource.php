<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SustainabilityPeriodResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'period_id' => $this->period_id,
            'data_month' => $this->data_month,
            'data_year' => $this->data_year,
            'students' => $this->students,
            'employees' => $this->employees,
            'created_at' => $this->created_at,
        ];
    }
}
