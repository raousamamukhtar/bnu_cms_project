<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SustainabilityPeriod extends Model
{
    use HasFactory;

    protected $table = 'sustainability_period';
    protected $primaryKey = 'period_id';
    public $timestamps = false;

    protected $fillable = [
        'data_month',
        'data_year',
        'students',
        'employees',
        'created_by',
        'created_at'
    ];

    public function paper(): HasOne
    {
        return $this->hasOne(PaperConsumption::class, 'period_id');
    }

    public function electricity(): HasOne
    {
        return $this->hasOne(ElectricityConsumption::class, 'period_id');
    }

    public function waste(): HasOne
    {
        return $this->hasOne(WasteGeneration::class, 'period_id');
    }

    public function generator(): HasOne
    {
        return $this->hasOne(GeneratorUsage::class, 'period_id');
    }



    public function water(): HasOne
    {
        return $this->hasOne(WaterConsumption::class, 'period_id');
    }

    public function carbon(): HasOne
    {
        return $this->hasOne(CarbonMetric::class, 'period_id');
    }
}
