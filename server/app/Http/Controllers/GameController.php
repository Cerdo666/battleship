<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    // -------------------------------------------------------
    // POST /api/game/start
    // Inicia una nueva partida: genera el tablero aleatoriamente
    // Acepta difficulty: 'easy' (100 shots), 'classic' (60 shots), 'tactical' (30 shots)
    // -------------------------------------------------------
    public function start(Request $request)
    {
        $request->validate([
            'difficulty' => 'nullable|in:easy,classic,tactical',
        ]);

        $user = $request->user();

        // Si ya tiene una partida activa, no puede iniciar otra
        $existing = $user->games()->where('status', 'active')->first();
        if ($existing) {
            return response()->json([
                'message' => 'Ya tienes una partida en curso',
                'game_id' => $existing->id,
            ], 409);
        }

        // Determine difficulty and max_shots
        $difficulty = $request->input('difficulty', 'classic');
        $maxShots = match($difficulty) {
            'easy' => 100,
            'tactical' => 30,
            default => 60, // classic
        };

        // Generar barcos aleatoriamente en el tablero 10x10
        $ships = $this->generateShips();

        $game = Game::create([
            'user_id' => $user->id,
            'ships'   => $ships,
            'shots'   => [],
            'hits'    => [],
            'status'  => 'active',
            'difficulty' => $difficulty,
            'total_shots' => 0,
            'max_shots' => $maxShots,
            'points'  => 0,
        ]);

        return response()->json([
            'message' => 'Partida iniciada',
            'game_id' => $game->id,
            'difficulty' => $difficulty,
            'max_shots' => $maxShots,
            'board_size' => 10,
        ], 201);
    }

    // -------------------------------------------------------
    // POST /api/game/shoot
    // El jugador dispara a una celda: { row: 3, col: 4 }
    // -------------------------------------------------------
    public function shoot(Request $request)
    {
        $request->validate([
            'row' => 'required|integer|min:0|max:9',
            'col' => 'required|integer|min:0|max:9',
        ]);

        $user = $request->user();
        $game = $user->games()->where('status', 'active')->first();

        if (!$game) {
            return response()->json([
                'message' => 'No tienes ninguna partida activa'
            ], 404);
        }

        $row = $request->row;
        $col = $request->col;
        $cellKey = "{$row},{$col}";

        // Comprobar que no haya disparado ya a esa celda
        $shots = $game->shots ?? [];
        if (in_array($cellKey, $shots)) {
            return response()->json([
                'message' => 'Ya disparaste a esa celda',
                'result'  => 'repeated',
            ], 422);
        }

        // Comprobar si ya alcanzó el límite de disparos
        $maxShots = $game->max_shots ?? 60;
        if ($game->total_shots >= $maxShots) {
            return response()->json([
                'message' => "¡Perdiste! Ya alcanzaste el límite de {$maxShots} disparos.",
                'game_over' => true,
                'status' => 'lost',
            ], 422);
        }

        // Registrar el disparo
        $shots[] = $cellKey;

        // Comprobar si hay un barco en esa celda
        $hits    = $game->hits ?? [];
        $ships   = $game->ships;
        $isHit   = false;
        $sunkShip = null;

        foreach ($ships as &$ship) {
            foreach ($ship['cells'] as $cell) {
                if ($cell[0] === $row && $cell[1] === $col) {
                    $isHit = true;
                    $hits[] = $cellKey;

                    // Marcar la celda como golpeada dentro del barco
                    $ship['hits'][] = $cellKey;

                    // Comprobar si el barco entero fue hundido
                    if (count($ship['hits']) === count($ship['cells'])) {
                        $ship['sunk'] = true;
                        $sunkShip = $ship['name'];
                    }
                    break 2;
                }
            }
        }

        $totalShots = $game->total_shots + 1;

        // Comprobar si ganó: todos los barcos hundidos
        $allSunk = collect($ships)->every(fn($s) => $s['sunk'] === true);

        $gameStatus = 'active';
        $points     = 0;
        $message    = $isHit ? 'Tocado!' : 'Agua!';

        if ($allSunk) {
            $gameStatus = 'won';
            // Cuantos menos disparos, más puntos. Máximo 100, mínimo 10.
            // Con 17 disparos (mínimo teórico) = 100 pts
            // Con 45 disparos = 55 pts
            // Con 100+ = 10 pts
            $points = max(0, 100 - $totalShots);
            $message = "¡Ganaste! Todos los barcos encontrados en {$totalShots} disparos.";

            // Actualizar estadísticas del usuario
            $user->increment('total_games');
            $user->increment('total_points', $points);
        }

        // Guardar estado actualizado
        $game->update([
            'ships'       => $ships,
            'shots'       => $shots,
            'hits'        => $hits,
            'total_shots' => $totalShots,
            'status'      => $gameStatus,
            'points'      => $points,
        ]);

        return response()->json([
            'message'    => $message,
            'result'     => $isHit ? 'hit' : 'miss',
            'cell'       => ['row' => $row, 'col' => $col],
            'sunk_ship'  => $sunkShip,
            'total_shots'=> $totalShots,
            'hits'       => $hits,
            'shots'      => $shots,
            'max_shots'  => $maxShots,
            'game_over'  => $allSunk,
            'status'     => $gameStatus,
            'points'     => $points,
        ]);
    }

    // -------------------------------------------------------
    // DELETE /api/game/abandon
    // El jugador abandona la partida (no puntúa, se borra)
    // -------------------------------------------------------
    public function abandon(Request $request)
    {
        $user = $request->user();
        $game = $user->games()->where('status', 'active')->first();

        if (!$game) {
            return response()->json([
                'message' => 'No tienes ninguna partida activa'
            ], 404);
        }

        $game->update(['status' => 'abandoned']);
        // Borramos los datos de la partida (no puntúa)
        $game->delete();

        return response()->json([
            'message' => 'Partida abandonada'
        ]);
    }

    // -------------------------------------------------------
    // GET /api/game/state
    // Devuelve el estado actual de la partida activa
    // (útil para recuperar partida si el usuario refresca la página)
    // -------------------------------------------------------
    public function state(Request $request)
    {
        $user = $request->user();
        $game = $user->games()->where('status', 'active')->first();

        if (!$game) {
            return response()->json([
                'message'     => 'No hay partida activa',
                'active_game' => false,
            ]);
        }

        return response()->json([
            'active_game' => true,
            'game_id'     => $game->id,
            'total_shots' => $game->total_shots,
            'max_shots'   => $game->max_shots ?? 60,
            'difficulty'  => $game->difficulty ?? 'classic',
            'hits'        => $game->hits,
            'shots'       => $game->shots,
            'status'      => $game->status,
            // Número de barcos hundidos (sin revelar posiciones)
            'ships_sunk'  => collect($game->ships)->filter(fn($s) => $s['sunk'])->count(),
            'total_ships' => count($game->ships),
        ]);
    }

    // -------------------------------------------------------
    // LÓGICA PRIVADA: Generar barcos aleatorios en el tablero
    // Barcos: 1x(1x2), 2x(1x3), 1x(1x4), 1x(1x5)
    // -------------------------------------------------------
    private function generateShips(): array
    {
        $boardSize = 10;
        $shipDefs  = [
            ['name' => 'Destroyer',   'size' => 2],
            ['name' => 'Submarine',   'size' => 3],
            ['name' => 'Cruiser',     'size' => 3],
            ['name' => 'Battleship',  'size' => 4],
            ['name' => 'Carrier',     'size' => 5],
        ];

        $occupied = []; // celdas ya ocupadas
        $ships    = [];

        foreach ($shipDefs as $def) {
            $placed = false;
            $attempts = 0;

            while (!$placed && $attempts < 1000) {
                $attempts++;
                $horizontal = rand(0, 1) === 1;

                if ($horizontal) {
                    $row = rand(0, $boardSize - 1);
                    $col = rand(0, $boardSize - $def['size']);
                } else {
                    $row = rand(0, $boardSize - $def['size']);
                    $col = rand(0, $boardSize - 1);
                }

                // Calcular las celdas que ocuparía este barco
                $cells = [];
                for ($i = 0; $i < $def['size']; $i++) {
                    $r = $horizontal ? $row : $row + $i;
                    $c = $horizontal ? $col + $i : $col;
                    $cells[] = [$r, $c];
                }

                // Comprobar colisiones (incluyendo celdas adyacentes para dejar espacio)
                $collision = false;
                foreach ($cells as [$r, $c]) {
                    for ($dr = -1; $dr <= 1; $dr++) {
                        for ($dc = -1; $dc <= 1; $dc++) {
                            $key = ($r + $dr) . ',' . ($c + $dc);
                            if (isset($occupied[$key])) {
                                $collision = true;
                                break 3;
                            }
                        }
                    }
                }

                if (!$collision) {
                    // Colocar el barco
                    foreach ($cells as [$r, $c]) {
                        $occupied["{$r},{$c}"] = true;
                    }
                    $ships[] = [
                        'name'  => $def['name'],
                        'size'  => $def['size'],
                        'cells' => $cells,
                        'hits'  => [],
                        'sunk'  => false,
                    ];
                    $placed = true;
                }
            }
        }

        return $ships;
    }
}