<?php

namespace App\Http\Requests\Sustainability;

use Illuminate\Foundation\Http\FormRequest;

class StoreCarbonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'period_id' => 'required|exists:sustainability_period,period_id',
            'aqi_score' => 'required|numeric|min:0',
            'carbon_footprint' => 'required|numeric|min:0',
        ];
    }
}
