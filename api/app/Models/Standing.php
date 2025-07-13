<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Standing extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    public function fixture()
    {
        return $this->belongsTo(Fixture::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
