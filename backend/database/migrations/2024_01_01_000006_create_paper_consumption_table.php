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
        Schema::create('paper_consumption', function (Blueprint $table) {
            $table->id('paper_id');
            $table->foreignId('period_id')->constrained('sustainability_period', 'period_id')->onDelete('cascade');
            
            $table->decimal('paper_reams', 10, 2); // NUMBER equivalent with precision
            $table->decimal('sheets_per_ream', 10, 2); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paper_consumption');
    }
};
