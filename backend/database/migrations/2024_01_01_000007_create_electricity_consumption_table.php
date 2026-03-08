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
        Schema::create('electricity_consumption', function (Blueprint $table) {
            $table->id('electricity_id');
            $table->foreignId('period_id')->constrained('sustainability_period', 'period_id')->onDelete('cascade');
            
            $table->decimal('units_kwh', 12, 2);
            $table->decimal('total_cost', 15, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('electricity_consumption');
    }
};
