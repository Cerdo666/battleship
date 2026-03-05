<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('level');
            $table->integer('level_easy')->default(1);
            $table->integer('level_classic')->default(1);
            $table->integer('level_tactical')->default(1);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['level_easy', 'level_classic', 'level_tactical']);
            $table->integer('level')->default(1);
        });
    }
};
