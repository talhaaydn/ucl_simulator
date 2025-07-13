<?php

namespace App\Models;

use App\Enums\StageCode;
use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $guarded = [];

    protected $casts = [
        'code' => StageCode::class,
    ];
}
