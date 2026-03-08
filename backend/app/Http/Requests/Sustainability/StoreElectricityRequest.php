<?php

namespace App\Http\Requests\Sustainability;

use Illuminate\Foundation\Http\FormRequest;

class StoreElectricityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'period_id' => 'required|exists:sustainability_period,period_id',
            'units_kwh' => 'required|numeric|min:0',
            'total_cost' => 'required|numeric|min:0',
            'kwh_solar_offset' => 'nullable|numeric|min:0',
        ];
    }
}
