<?php

namespace App\Services;

use App\Models\Fixture;
use App\Models\Stage;
use App\Models\Game;
use App\Models\Standing;
use App\Enums\StageCode;
use Illuminate\Support\Facades\DB;
use App\Services\GroupService;
use App\Services\GameService;

class FixtureService
{
    public function __construct(
        private GroupService $groupService,
        private GameService $gameService
    )
    {
    }

    public function createFixture(): void
    {
        DB::transaction(function () {
            $stage = Stage::where('code', StageCode::GROUP)->first();

            $fixture = Fixture::create([
                'active_stage_id' => $stage->id,
                'active_week' => 1,
                'name' => 'UEFA Champions League',
            ]);

            $this->groupService->createGroups($fixture);

            $this->groupService->assignTeamsToGroups($fixture);

            $this->gameService->createGroupStageGames($fixture);
        });
    }
    
    public function playActiveWeekGames(Fixture $fixture): void
    {
        DB::transaction(function () use ($fixture) {
            $this->gameService->playActiveWeekGames($fixture);

            $this->advanceToNextWeek($fixture);
        });
    }
    
    public function playAllWeeksGames(Fixture $fixture): void
    {
        $maxIterations = 10;
        $iteration = 0;
        
        while ($fixture->active_week <= 6 && !$fixture->is_completed && $iteration < $maxIterations) {
            $this->gameService->playActiveWeekGames($fixture);
            $this->advanceToNextWeek($fixture);
            $fixture->refresh();
            $iteration++;
        }
    }

    private function advanceToNextWeek(Fixture $fixture): void
    {
        $newWeek = $fixture->active_week + 1;
        
        $fixture->update([
            'active_week' => $newWeek
        ]);
        
        if ($newWeek > 6) {
            $fixture->update(['is_completed' => true]);
        }
    }

    public function resetFixture(Fixture $fixture): void
    {
        $fixture->games()->delete();
        
        Standing::where('fixture_id', $fixture->id)->delete();
        
        foreach ($fixture->groups as $group) {
            $group->teams()->detach();
            $group->delete();
        }
        
        $fixture->delete();
    }
}
