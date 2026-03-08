<?php

namespace App\Http\Requests\Sustainability;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Allow all roles for testing
        return true;
    }

    public function rules(): array
    {
        return [
            'school_id' => 'required|exists:schools,school_id',
            'event_month' => 'required|integer|min:1|max:12',
            'event_year' => 'required|integer|min:2020|max:2100',
            'event_name' => 'required|string|max:255',
            'event_type' => 'required|string|max:255',
            'event_date' => 'required|date',
            'description' => 'required|string',
            'attachment_path' => 'nullable|string',
        ];
    }
}
