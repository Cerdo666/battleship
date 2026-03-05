<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'nickname',
        'password',
        'total_points',
        'total_games',
        'level_easy',
        'level_classic',
        'level_tactical',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    // Relación: un usuario tiene muchas partidas
    public function games()
    {
        return $this->hasMany(Game::class);
    }
}