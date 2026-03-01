<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ships',
        'shots',
        'hits',
        'status',
        'total_shots',
        'points',
    ];

    protected $casts = [
        'ships' => 'array',
        'shots' => 'array',
        'hits'  => 'array',
    ];

    // Relación: una partida pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}