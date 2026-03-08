<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneratorUsage extends Model
{
    use HasFactory;

    protected $table = 'generator_usage';
    protected $primaryKey = 'generator_id';
    public $timestamps = false;

    protected $fillable = [
        'period_id',
        'avg_running_hours',
        'fuel_litres', // Keeping for backward compatibility if needed, or we can map diesel_litres to this
        'total_hours',
        'diesel_litres',
        'fuel_type',
        'cost'
    ];
}
