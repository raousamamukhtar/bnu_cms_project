<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WasteGeneration extends Model
{
    use HasFactory;

    protected $table = 'waste_generation';
    protected $primaryKey = 'waste_id';
    public $timestamps = false;

    protected $fillable = [
        'period_id',
        'organic_kg',
        'recyclable_kg',
        'other_kg',
        'total_waste',
        'per_capita_waste'
    ];
}
