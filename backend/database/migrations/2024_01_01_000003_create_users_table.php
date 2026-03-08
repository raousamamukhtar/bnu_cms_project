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
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('full_name')->nullable();
            $table->string('email')->unique();
            
            // Foreign Keys
            // Assuming role_id and school_id are compatible types with the referenced id()
            $table->foreignId('role_id')->constrained('roles', 'role_id')->onDelete('cascade');
            
            // school_id is nullable
            $table->foreignId('school_id')->nullable()->constrained('schools', 'school_id')->onDelete('set null');
            
            $table->date('created_at')->useCurrent();
            // Note: Laravel default is timestamps() which adds created_at and updated_at as timestamps.
            // Request specifically asked for created_at (date). 
            // We'll stick to $table->date('created_at') as requested, to map to Oracle DATE.
            // However, often Laravel expects timestamps() for Eloquent. 
            // Given the constraint "Use NUMBER, VARCHAR2, CLOB, DATE equivalents", DATE is fine.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
