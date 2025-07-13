<?php

namespace Database\Seeders;

use App\Models\Team;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/teams.json');
        if (!File::exists($jsonPath)) {
            $this->command->error("JSON dosyası bulunamadı: $jsonPath");
            return;
        }

        $teams = json_decode(File::get($jsonPath), true);

        foreach ($teams as $team) {
            Team::updateOrCreate(
                ['name' => $team['name']],
                [
                    'strength' => $team['strength'],
                    'logo' => $team['logo']
                ]
            );
        }

        $this->command->info(count($teams) . " teams have been added successfully.");
    }
}
