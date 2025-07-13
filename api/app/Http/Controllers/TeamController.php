<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Http\Resources\TeamResource;
use App\Http\Controllers\ApiResponse;

class TeamController extends Controller
{
    public function index()
    {
        return ApiResponse::success(
            TeamResource::collection(Team::all())
        );
    }
} 