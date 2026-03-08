<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SustainabilityData extends Model
{
    protected $table = 'SUSTAINABILITY_DATA';

    protected $primaryKey = 'ID';
    public $incrementing = true;
    protected $keyType = 'int';

    public $timestamps = true;

    const CREATED_AT = 'CREATED_AT';
    const UPDATED_AT = 'UPDATED_AT';

    protected $fillable = [
        'DATA_YEAR',
        'DATA_MONTH',
        'AQI_SCORE',
        'CARBON_QTY',
        'LOCATION_NAME',
    ];
}
