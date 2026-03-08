<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnnualMetric extends Model
{
    protected $fillable = [
        'year',
        'solar_offset_kwh'
    ];
}
