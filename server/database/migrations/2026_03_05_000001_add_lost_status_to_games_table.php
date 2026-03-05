<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Use raw SQL to modify the enum properly in MySQL
        DB::statement("ALTER TABLE games MODIFY COLUMN status ENUM('active', 'won', 'abandoned', 'lost') DEFAULT 'active'");
    }

    public function down(): void
    {
        // Revert back to original enum
        DB::statement("ALTER TABLE games MODIFY COLUMN status ENUM('active', 'won', 'abandoned') DEFAULT 'active'");
    }
};
