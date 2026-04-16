<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';
    protected $primaryKey = 'event_id';
    public $timestamps = false; // 'created_at' exists but 'updated_at' usually doesn't in this schema pattern, so manual or default

    protected $fillable = [
        'school_id',
        'event_month',
        'event_year',
        'event_name',
        'event_type',
        'event_date',
        'description',
        'event_link',
        'entered_by',
        'created_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'entered_by', 'user_id');
    }

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id', 'school_id');
    }
}
