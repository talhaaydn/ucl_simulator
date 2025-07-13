<?php

namespace Database\Seeders;

use App\Enums\StageCode;
use App\Models\Stage;
use Illuminate\Database\Seeder;

class StageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $order = 1;

        foreach (StageCode::cases() as $code) {
            Stage::updateOrCreate(
                ['code' => $code],
                [
                    'name' => $code->label(),
                    'sort_number' => $order++
                ]
            );
        }

        $this->command->info("All stages have been seeded successfully.");
    }
}
