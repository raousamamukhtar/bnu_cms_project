<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElectricityConsumption extends Model
{
    use HasFactory;

    protected $table = 'electricity_consumption';
    protected $primaryKey = 'electricity_id';
    public $timestamps = false;

    protected $fillable = [
        'period_id',
        'units_kwh',
        'total_cost',
        'kwh_solar_offset'
    ];
}
