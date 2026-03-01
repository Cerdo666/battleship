<?php

namespace App\Http\Controllers;

use App\Models\User;

class RankingController extends Controller
{
    // GET /api/ranking  (pública)
    public function index()
    {
        // Solo usuarios con al menos 1 partida completada y puntos > 0
        $ranking = User::where('total_points', '>', 0)
            ->where('total_games', '>', 0)
            ->orderByDesc('total_points')
            ->limit(10)
            ->get(['id', 'nickname', 'total_points', 'total_games', 'created_at']);

        return response()->json([
            'ranking' => $ranking
        ]);
    }
}