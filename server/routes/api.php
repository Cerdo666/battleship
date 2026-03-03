<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocsController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\RankingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Battleship Game
|--------------------------------------------------------------------------
|
| PÚBLICAS  → No requieren token
| PRIVADAS  → Requieren header: Authorization: Bearer {token}
|
*/

// ==========================================================
// RUTAS PÚBLICAS
// ==========================================================

// Documentation
Route::get('/docs', [DocsController::class, 'index']);

// Health check rápido
Route::get('/status', function () {
    return response()->json([
        'status'  => 'ok',
        'app'     => 'Battleship Game API',
        'version' => '1.0',
    ]);
});

// Autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Ranking público (top 10 jugadores con puntos > 0)
Route::get('/ranking', [RankingController::class, 'index']);


// ==========================================================
// RUTAS PRIVADAS (requieren token Sanctum)
// ==========================================================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout',          [AuthController::class, 'logout']);
    Route::get('/profile',          [AuthController::class, 'profile']);
    Route::put('/change-password',  [AuthController::class, 'changePassword']);

    // Juego
    Route::post('/game/start',      [GameController::class, 'start']);
    Route::post('/game/shoot',      [GameController::class, 'shoot']);
    Route::delete('/game/abandon',  [GameController::class, 'abandon']);
    Route::get('/game/state',       [GameController::class, 'state']);
});