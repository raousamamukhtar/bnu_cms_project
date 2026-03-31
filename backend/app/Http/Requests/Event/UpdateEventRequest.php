<?php
namespace App\Http\Requests\Event;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize() { return true; }
    
    public function rules()
    {
        return [
            'event_month' => 'sometimes|integer|min:1|max:12',
            'event_year' => 'sometimes|integer',
            'event_name' => 'sometimes|string|max:255',
            'event_type' => 'sometimes|string|max:255',
            'event_date' => 'sometimes|date',
            'description' => 'sometimes|string',
            'attachment_path' => 'nullable|string',
        ];
    }
}
