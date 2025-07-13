<?php

namespace App\Services;

use App\Models\Team;
use App\Models\Fixture;

class GroupService
{
    /**
     * @param Fixture $fixture
     */
    public function createGroups(Fixture $fixture): void
    {
        $teamsPerGroup = 4;
        $groupCount = (int) ceil(Team::count() / $teamsPerGroup);

        for ($i = 0; $i < $groupCount; $i++) {
            $fixture->groups()->create([
                'name' => 'Group ' . chr(65 + $i),
            ]);
        }
    }

    /**
     * @param Fixture $fixture
     */
    public function assignTeamsToGroups(Fixture $fixture): void
    {
        $teams = Team::all()->shuffle()->values();
        $groups = $fixture->groups()->get();
        $groupCount = $groups->count();
        foreach ($teams as $i => $team) {
            $group = $groups[$i % $groupCount];
            $group->teams()->attach($team->id);
        }
    }
} 