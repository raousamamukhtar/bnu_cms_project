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
        Schema::create('carbon_metrics', function (Blueprint $table) {
            $table->id('carbon_id');
            $table->foreignId('period_id')->constrained('sustainability_period', 'period_id')->onDelete('cascade');
            
            $table->decimal('aqi_score', 10, 2);
            $table->decimal('carbon_footprint', 15, 2);
            
            $table->foreignId('entered_by')->constrained('users', 'user_id')->onDelete('cascade');
            
            $table->date('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carbon_metrics');
    }
};
