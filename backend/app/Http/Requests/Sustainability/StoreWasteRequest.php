<?php

namespace App\Http\Requests\Sustainability;

use Illuminate\Foundation\Http\FormRequest;

class StoreWasteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'period_id' => 'required|exists:sustainability_period,period_id',
            'organic_kg' => 'required|numeric|min:0',
            'recyclable_kg' => 'required|numeric|min:0',
            'other_kg' => 'required|numeric|min:0',
        ];
    }
}
