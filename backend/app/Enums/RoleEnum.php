<?php

namespace App\Enums;

enum RoleEnum: int
{
    case ADMIN = 1;
    case SCHOOL_COORDINATOR = 2;
    case HR = 3;
    case STUDENT_AFFAIRS = 4;
    case MARKETING = 5;
    case CARBON_ACCOUNTANT = 6;
    case MANAGEMENT = 21;

    public function name(): string
    {
        return match($this) {
            self::ADMIN => 'Admin',
            self::SCHOOL_COORDINATOR => 'School Coordinator',
            self::HR => 'HR',
            self::STUDENT_AFFAIRS => 'Student Affairs',
            self::MARKETING => 'Marketing',
            self::CARBON_ACCOUNTANT => 'Carbon Accountant',
            self::MANAGEMENT => 'Management',
        };
    }
}
