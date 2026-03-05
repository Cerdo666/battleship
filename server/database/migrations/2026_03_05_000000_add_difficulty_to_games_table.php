<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->enum('difficulty', ['easy', 'classic', 'tactical'])->default('classic')->after('status');
            $table->integer('max_shots')->default(60)->after('total_shots');
        });
    }

    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['difficulty', 'max_shots']);
        });
    }
};
