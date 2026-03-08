<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaperConsumption extends Model
{
    use HasFactory;

    protected $table = 'paper_consumption';
    protected $primaryKey = 'paper_id';
    public $timestamps = false;

    protected $fillable = [
        'period_id',
        'paper_reams',
        'sheets_per_ream',
        'per_capita_ream'
    ];
}
