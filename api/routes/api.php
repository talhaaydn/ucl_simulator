<?php

use App\Http\Controllers\TeamController;
use App\Http\Controllers\FixtureController;
use Illuminate\Support\Facades\Route;

Route::get('/teams', [TeamController::class, 'index']);

Route::prefix('fixtures')->group(function () {
    Route::get('/', [FixtureController::class, 'index']);
    Route::post('/', [FixtureController::class, 'store']);
    
    Route::prefix('{fixture}')->group(function () {
        Route::get('/groups', [FixtureController::class, 'groups']);
        Route::get('/games', [FixtureController::class, 'games']);
        Route::get('/play-active-week', [FixtureController::class, 'playActiveWeekGames']);
        Route::post('/play-all-weeks', [FixtureController::class, 'playAllWeeksGames']);
        Route::delete('/reset', [FixtureController::class, 'resetFixture']);
    });
});
