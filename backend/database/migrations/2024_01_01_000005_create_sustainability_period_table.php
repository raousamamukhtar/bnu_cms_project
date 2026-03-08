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
        Schema::create('sustainability_period', function (Blueprint $table) {
            $table->id('period_id');
            $table->integer('data_month'); // 1-12
            $table->integer('data_year');
            
            $table->foreignId('created_by')->constrained('users', 'user_id')->onDelete('cascade');
            $table->date('created_at')->useCurrent();
            
            // Unique constraint on (month, year)
            $table->unique(['data_month', 'data_year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sustainability_period');
    }
};
