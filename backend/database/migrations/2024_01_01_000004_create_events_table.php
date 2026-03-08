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
        Schema::create('events', function (Blueprint $table) {
            $table->id('event_id');
            
            // FKs
            $table->foreignId('school_id')->constrained('schools', 'school_id')->onDelete('cascade');
            $table->foreignId('entered_by')->constrained('users', 'user_id')->onDelete('cascade');
            
            // Columns
            // Oracle NUMBER equivalents for integers
            $table->integer('event_month'); // 1-12
            $table->integer('event_year');
            
            $table->string('event_name');
            $table->string('event_type');
            $table->date('event_date');
            
            // CLOB equivalent in Laravel for Oracle is typically text() or longText()
            $table->text('description'); 
            
            $table->string('attachment_path')->nullable();
            
            $table->date('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
