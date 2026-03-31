<?php
namespace App\Http\Requests\SustainabilityData;
use Illuminate\Foundation\Http\FormRequest;

class StoreSustainabilityDataRequest extends FormRequest
{
    public function authorize() { return true; }
    
    public function rules()
    {
        return [
            'DATA_YEAR' => 'required|integer',
            'DATA_MONTH' => 'required|integer|min:1|max:12',
            'AQI_SCORE'  => 'required|numeric',
            'CARBON_QTY' => 'required|numeric',
            'LOCATION_NAME' => 'nullable|string',
        ];
    }
}
