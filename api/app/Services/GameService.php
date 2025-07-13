<?php

namespace App\Services;

use App\Models\Game;
use Illuminate\Support\Collection;
use App\Models\Fixture;
use App\Models\Standing;

class GameService
{
    /**
     * @param Collection $groups
     * @param int $fixtureId
     * @param int $stageId
     */
    public function createGroupStageGames(Fixture $fixture): void
    {
        foreach ($fixture->groups as $group) {
            $teams = $group->teams()->get();
            $teamCount = count($teams);
            
            $allMatches = [];
            for ($i = 0; $i < $teamCount; $i++) {
                for ($j = 0; $j < $teamCount; $j++) {
                    if ($i != $j) {
                        $allMatches[] = [
                            'home' => $teams[$i]->id,
                            'away' => $teams[$j]->id
                        ];
                    }
                }
            }
            
            $schedule = [];
            $week = 0;
            
            while (!empty($allMatches)) {
                $weekMatches = [];
                $usedTeams = [];
                
                foreach ($allMatches as $key => $match) {
                    $homeTeam = $match['home'];
                    $awayTeam = $match['away'];
                    
                    if (!in_array($homeTeam, $usedTeams) && !in_array($awayTeam, $usedTeams)) {
                        $weekMatches[] = $match;
                        $usedTeams[] = $homeTeam;
                        $usedTeams[] = $awayTeam;
                        unset($allMatches[$key]);
                    }
                }
                
                $schedule[] = $weekMatches;
                $allMatches = array_values($allMatches);
                $week++;
            }
            
            $matchday = 1;
            foreach ($schedule as $weekMatches) {
                foreach ($weekMatches as $match) {
                    Game::create([
                        'fixture_id' => $fixture->id,
                        'stage_id' => $fixture->active_stage_id,
                        'week' => $matchday,
                        'home_team_id' => $match['home'],
                        'away_team_id' => $match['away'],
                    ]);
                }
                $matchday++;
            }
        }
    }
    
    public function playActiveWeekGames(Fixture $fixture): void
    {
        $activeWeek = $fixture->active_week;
        
        $games = Game::where('fixture_id', $fixture->id)
            ->where('week', $activeWeek)
            ->where('is_played', false)
            ->with(['homeTeam', 'awayTeam'])
            ->get();

        foreach ($games as $game) {
            $this->playGame($game);
        }
    }
    
    private function playGame(Game $game): void
    {
        $homeTeam = $game->homeTeam;
        $awayTeam = $game->awayTeam;

        $homeAdvantage = 1.1;
        
        $homeStrength = $homeTeam->strength * $homeAdvantage;
        $awayStrength = $awayTeam->strength;

        $totalStrength = $homeStrength + $awayStrength;

        $drawProbability = 0.25;
        $remainingProbability = 1 - $drawProbability;
        
        $homeWinProbability = $drawProbability + ($remainingProbability * ($homeStrength / $totalStrength));

        $random = mt_rand(1, 100) / 100;

        if ($random <= $drawProbability) {
            // Berabere
            $homeScore = $this->generateScore(0, 2);
            $awayScore = $homeScore;
        } elseif ($random <= $homeWinProbability) {
            // Ev sahibi kazanır
            $homeScore = $this->generateScore(1, 4);
            $awayScore = $this->generateScore(0, $homeScore - 1);
        } else {
            // Deplasman kazanır
            $awayScore = $this->generateScore(1, 4);
            $homeScore = $this->generateScore(0, $awayScore - 1);
        }

        $game->update([
            'home_score' => $homeScore,
            'away_score' => $awayScore,
            'is_played' => true
        ]);

        $this->updateStandings($game);
    }

    private function generateScore(int $min, int $max): int
    {
        return mt_rand($min, $max);
    }
    
    private function updateStandings(Game $game): void
    {
        $homeTeam = $game->homeTeam;
        $awayTeam = $game->awayTeam;
        $fixtureId = $game->fixture_id;

        $homeStanding = $homeTeam->standings()
            ->where('fixture_id', $fixtureId)
            ->first();

        $awayStanding = $awayTeam->standings()
            ->where('fixture_id', $fixtureId)
            ->first();

        if (!$homeStanding) {
            $homeGroup = $homeTeam->groups()->first();

            $homeStanding = Standing::create([
                'fixture_id' => $fixtureId,
                'group_id' => $homeGroup->id,
                'team_id' => $homeTeam->id,
            ]);
        }

        if (!$awayStanding) {
            $awayGroup = $awayTeam->groups()->first();

            $awayStanding = Standing::create([
                'fixture_id' => $fixtureId,
                'group_id' => $awayGroup->id,
                'team_id' => $awayTeam->id,
            ]);
        }

        $homeStanding->played++;
        $homeStanding->goals_for += $game->home_score;
        $homeStanding->goals_against += $game->away_score;
        $homeStanding->goal_difference = $homeStanding->goals_for - $homeStanding->goals_against;

        $awayStanding->played++;
        $awayStanding->goals_for += $game->away_score;
        $awayStanding->goals_against += $game->home_score;
        $awayStanding->goal_difference = $awayStanding->goals_for - $awayStanding->goals_against;

        if ($game->home_score > $game->away_score) {
            // Ev sahibi kazanır
            $homeStanding->won++;
            $homeStanding->points += 3;
            $awayStanding->lost++;
        } elseif ($game->home_score < $game->away_score) {
            // Deplasman kazanır
            $awayStanding->won++;
            $awayStanding->points += 3;
            $homeStanding->lost++;
        } else {
            // Beraberlik
            $homeStanding->draw++;
            $homeStanding->points += 1;
            $awayStanding->draw++;
            $awayStanding->points += 1;
        }

        $homeStanding->save();
        $awayStanding->save();
    }
} 