try {
    $user = \App\Models\User::where('email', 'admin@bnu.edu.pk')->first();
    if (!$user) { echo "User not found\n"; exit; }

    echo "Creating Period...\n";
    $period = \App\Models\SustainabilityPeriod::firstOrCreate(
        ['data_month' => 10, 'data_year' => 2026],
        ['created_by' => $user->user_id, 'students' => 5000, 'employees' => 500]
    );
    echo "Period ID: " . $period->period_id . "\n";

    echo "Creating Paper Consumption...\n";
    $paper = \App\Models\PaperConsumption::updateOrCreate(
        ['period_id' => $period->period_id],
        ['paper_reams' => 100, 'sheets_per_ream' => 500]
    );
    echo "Paper ID: " . $paper->paper_id . "\n";
    echo "Success!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
