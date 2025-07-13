<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $guarded = [];

    public function groups()
    {
        return $this->belongsToMany(Group::class);
    }

    public function standings()
    {
        return $this->hasMany(Standing::class);
    }
}
