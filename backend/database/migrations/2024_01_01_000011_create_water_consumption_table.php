<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('water_consumption', function (Blueprint $table) {
            $table->id('water_id');
            $table->foreignId('period_id')->constrained('sustainability_period', 'period_id')->onDelete('cascade');
            
            $table->decimal('units', 12, 2);
            $table->decimal('price_per_unit', 10, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('water_consumption');
    }
};
