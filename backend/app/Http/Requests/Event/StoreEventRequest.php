<?php
namespace App\Http\Requests\Event;
use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize() { return true; }
    
    public function rules()
    {
        return [
            'event_month' => 'required|integer|min:1|max:12',
            'event_year' => 'required|integer',
            'event_name' => 'required|string|max:255',
            'event_type' => 'required|string|max:255',
            'event_date' => 'required|date',
            'description' => 'required|string',
            'attachment_path' => 'nullable|string',
            'school_id' => 'nullable|integer',
        ];
    }
}
