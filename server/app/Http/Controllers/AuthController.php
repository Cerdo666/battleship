<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // POST /api/register
    public function register(Request $request)
    {
        $request->validate([
            'nickname' => 'required|string|max:30|unique:users|alpha_num',
            'password' => 'required|string|min:6|confirmed',
            // confirmed: buscará automáticamente el campo password_confirmation
        ]);

        $user = User::create([
            'nickname' => $request->nickname,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Usuario registrado correctamente',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'id'           => $user->id,
                'nickname'     => $user->nickname,
                'total_points' => $user->total_points,
                'total_games'  => $user->total_games,
                'created_at'   => $user->created_at,
            ],
        ], 201);
    }

    // POST /api/login
    public function login(Request $request)
    {
        $request->validate([
            'nickname' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('nickname', $request->nickname)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Eliminar tokens viejos (opcional: solo permite una sesión activa)
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Login correcto',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'id'           => $user->id,
                'nickname'     => $user->nickname,
                'total_points' => $user->total_points,
                'total_games'  => $user->total_games,
                'created_at'   => $user->created_at,
            ],
        ]);
    }

    // POST /api/logout  (protegida)
    public function logout(Request $request)
    {
        // Comprobamos que el usuario no esté en partida activa
        $activeGame = $request->user()->games()->where('status', 'active')->first();
        if ($activeGame) {
            return response()->json([
                'message' => 'No puedes cerrar sesión con una partida en curso. Abandona la partida primero.'
            ], 403);
        }

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

    // GET /api/profile  (protegida)
    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id'           => $user->id,
            'nickname'     => $user->nickname,
            'total_points' => $user->total_points,
            'total_games'  => $user->total_games,
            'created_at'   => $user->created_at,
        ]);
    }

    // PUT /api/change-password  (protegida)
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        // Verificar contraseña actual
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'La contraseña actual no es correcta'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Contraseña cambiada correctamente'
        ]);
    }
}