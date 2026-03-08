<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AddSolarColumn extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:add-solar-column';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add solar_offset_kwh column manually';

    public function handle()
    {
        $this->info('Checking annual_metrics table...');
        
        if (!\Schema::hasTable('annual_metrics')) {
            $this->error('Table annual_metrics does not exist!');
            return;
        }

        if (\Schema::hasColumn('annual_metrics', 'solar_offset_kwh')) {
            $this->info('Column solar_offset_kwh already exists.');
            return;
        }

        try {
            \Schema::table('annual_metrics', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->decimal('solar_offset_kwh', 15, 2)->nullable();
            });
            $this->info('Successfully added solar_offset_kwh column.');
        } catch (\Exception $e) {
            $this->error('Error adding column: ' . $e->getMessage());
        }
    }
}
