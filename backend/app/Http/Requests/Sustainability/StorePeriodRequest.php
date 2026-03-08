<?php

namespace App\Http\Requests\Sustainability;

use Illuminate\Foundation\Http\FormRequest;

class StorePeriodRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only SUSTAINABILITY_ADMIN can create periods
        // return $this->user()->role?->role_name === 'SUSTAINABILITY_ADMIN';
        return true; 
    }

    public function rules(): array
    {
        return [
            'data_month' => 'required|integer|min:1|max:12',
            'data_year' => 'required|integer|min:2020|max:2100',
            'students' => 'nullable|integer|min:0',
            'employees' => 'nullable|integer|min:0',
        ];
    }
}
