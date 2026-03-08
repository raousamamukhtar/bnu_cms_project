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
        Schema::table('paper_consumption', function (Blueprint $table) {
            $table->decimal('per_capita_ream', 10, 4)->nullable();
        });

        Schema::table('electricity_consumption', function (Blueprint $table) {
            $table->decimal('kwh_solar_offset', 10, 2)->nullable();
        });

        Schema::table('waste_generation', function (Blueprint $table) {
            $table->decimal('total_waste', 10, 2)->nullable();
            $table->decimal('per_capita_waste', 10, 4)->nullable();
        });

        Schema::table('generator_usage', function (Blueprint $table) {
            $table->decimal('total_hours', 10, 2)->nullable()->after('period_id');
            $table->decimal('diesel_litres', 10, 2)->nullable()->after('total_hours');
            $table->string('fuel_type')->nullable()->after('diesel_litres');
            $table->decimal('cost', 10, 2)->nullable()->after('fuel_type');
            // We can make avg_running_hours and fuel_litres nullable if they are being deprecated
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('paper_consumption', function (Blueprint $table) {
            $table->dropColumn('per_capita_ream');
        });

        Schema::table('electricity_consumption', function (Blueprint $table) {
            $table->dropColumn('kwh_solar_offset');
        });

        Schema::table('waste_generation', function (Blueprint $table) {
            $table->dropColumn(['total_waste', 'per_capita_waste']);
        });

        Schema::table('generator_usage', function (Blueprint $table) {
            $table->dropColumn(['total_hours', 'diesel_litres', 'fuel_type', 'cost']);
        });
    }
};
