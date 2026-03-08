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
        Schema::table('sustainability_period', function (Blueprint $table) {
            if (!Schema::hasColumn('sustainability_period', 'students')) {
                $table->integer('students')->default(0);
                $table->integer('employees')->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sustainability_period', function (Blueprint $table) {
            $table->dropColumn(['students', 'employees']);
        });
    }
};
