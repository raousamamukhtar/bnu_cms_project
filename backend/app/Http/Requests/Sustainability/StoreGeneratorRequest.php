<?php

namespace App\Http\Requests\Sustainability;

use Illuminate\Foundation\Http\FormRequest;

class StoreGeneratorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'period_id' => 'required|exists:sustainability_period,period_id',
            'avg_running_hours' => 'nullable|numeric|min:0', // Made nullable for backward compatibility
            'fuel_litres' => 'nullable|numeric|min:0',       // Made nullable
            'total_hours' => 'nullable|numeric|min:0',
            'diesel_litres' => 'nullable|numeric|min:0',
            'fuel_type' => 'nullable|string|in:Diesel,Petrol',
            'cost' => 'nullable|numeric|min:0',
        ];
    }
}
