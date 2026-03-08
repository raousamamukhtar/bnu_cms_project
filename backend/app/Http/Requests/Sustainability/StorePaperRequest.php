<?php

namespace App\Http\Requests\Sustainability;

use Illuminate\Foundation\Http\FormRequest;

class StorePaperRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'period_id' => 'required|exists:sustainability_period,period_id',
            'paper_reams' => 'required|numeric|min:0',
            'sheets_per_ream' => 'required|integer|min:1',
        ];
    }
}
