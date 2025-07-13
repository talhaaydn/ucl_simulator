<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Group extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    public function teams()
    {
        return $this->belongsToMany(Team::class);
    }

    public function standings()
    {
        return $this->hasMany(Standing::class);
    }
}
