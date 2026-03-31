<?php
namespace App\Http\Requests\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreCarbonMetricRequest extends FormRequest
{
    public function authorize() { return true; }
    
    public function rules()
    {
        return [
            'month' => 'required|string',
            'year' => 'required|integer',
            'aqi' => 'required|numeric|min:0',
            'carbonFootprint' => 'required|numeric|min:0',
        ];
    }
}
