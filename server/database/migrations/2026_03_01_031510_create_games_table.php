<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // El tablero: guardamos la posición de los barcos como JSON
            // Formato: array de barcos, cada uno con su posición y celdas
            $table->json('ships');

            // Celdas ya clickadas: array de strings tipo "3,4"
            $table->json('shots')->default('[]');

            // Celdas donde hubo acierto
            $table->json('hits')->default('[]');

            // Estado de la partida: 'active', 'won', 'abandoned'
            $table->enum('status', ['active', 'won', 'abandoned'])->default('active');

            // Cuántos disparos llevan (máx 45 para puntuación máxima, sin límite para jugar)
            $table->integer('total_shots')->default(0);

            // Puntos obtenidos (solo cuando status = 'won')
            $table->integer('points')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};