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
        Schema::create('waste_generation', function (Blueprint $table) {
            $table->id('waste_id');
            $table->foreignId('period_id')->constrained('sustainability_period', 'period_id')->onDelete('cascade');
            
            $table->decimal('organic_kg', 10, 2);
            $table->decimal('recyclable_kg', 10, 2);
            $table->decimal('other_kg', 10, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waste_generation');
    }
};
