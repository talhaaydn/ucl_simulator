<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;

class GameResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'stage' => $this->stage->name,
            'week' => $this->week,
            'homeTeam' => TeamResource::make($this->homeTeam),
            'awayTeam' => TeamResource::make($this->awayTeam),
            'homeScore' => $this->home_score,
            'awayScore' => $this->away_score,
            'isPlayed' => $this->is_played,
        ];
    }
} 