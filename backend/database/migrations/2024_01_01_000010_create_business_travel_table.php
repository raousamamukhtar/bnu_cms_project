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
        Schema::create('business_travel', function (Blueprint $table) {
            $table->id('travel_id');
            $table->foreignId('period_id')->constrained('sustainability_period', 'period_id')->onDelete('cascade');
            
            $table->decimal('travel_km', 12, 2);
            $table->decimal('fuel_litres', 12, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_travel');
    }
};
