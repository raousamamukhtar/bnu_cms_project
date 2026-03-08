<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarbonMetric extends Model
{
    use HasFactory;

    protected $table = 'carbon_metrics';
    protected $primaryKey = 'carbon_id';
    public $timestamps = false;

    protected $fillable = [
        'period_id',
        'aqi_score',
        'carbon_footprint',
        'entered_by',
        'created_at'
    ];

    public function period()
    {
        return $this->belongsTo(SustainabilityPeriod::class, 'period_id', 'period_id');
    }
}
