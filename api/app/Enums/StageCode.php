<?php

namespace App\Enums;

enum StageCode: string
{
    case GROUP = 'GROUP';
    case LAST_16 = 'LAST_16';
    case QUARTER = 'QUARTER';
    case SEMI = 'SEMI';
    case FINAL = 'FINAL';

    public function label(): string
    {
        return match($this) {
            self::GROUP => 'Group Stage',
            self::LAST_16 => 'Round of 16',
            self::QUARTER => 'Quarter Finals',
            self::SEMI => 'Semi Finals',
            self::FINAL => 'Final',
        };
    }
}
