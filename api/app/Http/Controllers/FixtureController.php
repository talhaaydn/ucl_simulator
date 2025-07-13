<?php

namespace App\Http\Controllers;

use App\Http\Resources\FixtureResource;
use App\Http\Resources\FixtureGroupResource;
use App\Http\Resources\GameResource;
use App\Models\Fixture;
use App\Services\FixtureService;
use App\Http\Controllers\ApiResponse;

class FixtureController extends Controller
{
    public function index()
    {
        $fixture = Fixture::whereNull('deleted_at')->latest()->first();

        return ApiResponse::success(
            $fixture ? FixtureResource::make($fixture) : null
        );
    }

    public function groups(Fixture $fixture)
    {
        $groups = $fixture->groups()->with([
            'teams',
            'teams.standings' => function ($query) use ($fixture) {
                $query->where('fixture_id', $fixture->id);
            }
        ])->get();

        return ApiResponse::success(
            FixtureGroupResource::collection($groups)
        );
    }

    public function games(Fixture $fixture)
    {
        $games = $fixture->games()
            ->where('stage_id', $fixture->active_stage_id)
            ->with(['homeTeam', 'awayTeam'])
            ->get();

        return ApiResponse::success(
            GameResource::collection($games)
        );
    }

    public function store(FixtureService $fixtureService)
    {
        $fixtureService->createFixture();

        return ApiResponse::created(
            null,
            'Fixture created successfully'
        );
    }

    public function playActiveWeekGames(Fixture $fixture, FixtureService $fixtureService)
    {
        $fixtureService->playActiveWeekGames($fixture);

        return ApiResponse::created(
            null,
            'Active week games play successfully'
        );
    }

    public function playAllWeeksGames(Fixture $fixture, FixtureService $fixtureService)
    {
        $fixtureService->playAllWeeksGames($fixture);

        return ApiResponse::created(
            null,
            'All weeks games play successfully'
        );
    }

    public function resetFixture(Fixture $fixture, FixtureService $fixtureService)
    {
        try {
            $fixtureService->resetFixture($fixture);

            return ApiResponse::success(
                null,
                'Fixture reset successfully (soft deleted)'
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Error occurred while resetting fixture: ' . $e->getMessage()
            );
        }
    }
} 