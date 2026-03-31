<?php
namespace App\Http\Requests\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCarbonMetricRequest extends FormRequest
{
    public function authorize() { return true; }
    
    public function rules()
    {
        return [
            'aqi' => 'sometimes|numeric|min:0',
            'carbonFootprint' => 'sometimes|numeric|min:0',
        ];
    }
}
