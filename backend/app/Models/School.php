<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory;

    protected $table = 'schools';
    protected $primaryKey = 'school_id';
    public $timestamps = false;

    protected $fillable = [
        'school_name',
        // Add other fields as per schema if known, keeping it minimal/safe
    ];
}
