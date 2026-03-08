<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnvironmentData extends Model
{
 protected $table = 'ENVIRONMENT_DATA';
protected $fillable = ['recorded_year', 'recorded_month', 'aqi_index', 'carbon_footprint'];
}
