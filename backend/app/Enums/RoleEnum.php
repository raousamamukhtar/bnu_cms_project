<?php

namespace App\Enums;

enum RoleEnum: int
{
    case ADMIN = 1;
    case SCHOOL_COORDINATOR = 2;
    case STUDENT_AFFAIRS = 4;
    case MANAGEMENT = 21;

    public function name(): string
    {
        return match($this) {
            self::ADMIN => 'Admin',
            self::SCHOOL_COORDINATOR => 'School Coordinator',
            self::STUDENT_AFFAIRS => 'Student Affairs',
            self::MANAGEMENT => 'Management',
        };
    }
}
