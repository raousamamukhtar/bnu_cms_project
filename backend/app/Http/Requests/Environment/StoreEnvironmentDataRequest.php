<?php
namespace App\Http\Requests\Environment;
use Illuminate\Foundation\Http\FormRequest;

class StoreEnvironmentDataRequest extends FormRequest
{
    public function authorize() { return true; }
    
    public function rules()
    {
        return [
            'recorded_year'    => 'required|integer|min:2000|max:2099',
            'recorded_month'   => 'required|string',
            'aqi_index'        => 'required|integer',
            'carbon_footprint' => 'required|numeric',
        ];
    }
}
