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
        Schema::dropIfExists('business_travel');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('business_travel', function (Blueprint $table) {
            $table->id('travel_id');
            $table->unsignedBigInteger('period_id');
            $table->decimal('travel_km', 10, 2)->default(0);
            $table->decimal('fuel_litres', 10, 2)->default(0);

            $table->foreign('period_id')
                ->references('period_id')
                ->on('sustainability_period')
                ->onDelete('cascade');
        });
    }
};
