<?php

namespace App\Http\Requests\Sustainability;

use Illuminate\Foundation\Http\FormRequest;

class StoreWaterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'period_id' => 'required|exists:sustainability_period,period_id',
            'units' => 'required|numeric|min:0',
            'price_per_unit' => 'required|numeric|min:0',
        ];
    }
}
