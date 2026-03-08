<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WaterConsumption extends Model
{
    use HasFactory;

    protected $table = 'water_consumption';
    protected $primaryKey = 'water_id';
    public $timestamps = false;

    protected $fillable = [
        'period_id',
        'units',
        'price_per_unit'
    ];
}
