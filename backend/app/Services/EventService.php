<?php

namespace App\Services;

use App\Models\Event;
use App\Enums\RoleEnum;
use Illuminate\Support\Facades\DB;

class EventService
{
    public function getEventsForUser($user)
    {
        $roleId = $user->role_id;
        $userId = $user->user_id;

        if ($roleId == RoleEnum::STUDENT_AFFAIRS->value || $roleId == RoleEnum::MANAGEMENT->value) {
            return Event::with(['user.role'])
                ->orderBy('event_year', 'desc')
                ->orderBy('event_month', 'desc')
                ->orderBy('event_date', 'desc')
                ->get();
        } elseif ($roleId == RoleEnum::SCHOOL_COORDINATOR->value) {
            return Event::with('user')
                ->where('school_id', $user->school_id)
                ->orderBy('event_year', 'desc')
                ->orderBy('event_month', 'desc')
                ->orderBy('event_date', 'desc')
                ->get();
        } else {
            return Event::where('entered_by', $userId)
                ->orderBy('event_year', 'desc')
                ->orderBy('event_month', 'desc')
                ->orderBy('event_date', 'desc')
                ->get();
        }
    }

    public function createEvent(array $data, clone $user)
    {
        return DB::transaction(function () use ($data, $user) {
            $schoolId = null;
            if ($user->role_id == RoleEnum::SCHOOL_COORDINATOR->value) {
                $schoolId = $data['school_id'] ?? $user->school_id;
                if (!$schoolId) {
                    $schoolId = \App\Models\User::find($user->user_id)->school_id;
                }
            }

            $data['entered_by'] = $user->user_id;
            $data['school_id'] = $schoolId;
            $data['created_at'] = now();

            return Event::create($data);
        });
    }

    public function updateEvent(int $id, array $data, int $userId)
    {
        return DB::transaction(function () use ($id, $data, $userId) {
            $event = Event::findOrFail($id);
            if ($event->entered_by !== $userId) {
                return null;
            }

            $event->update($data);
            return $event;
        });
    }

    public function deleteEvent(int $id, int $userId)
    {
        return DB::transaction(function () use ($id, $userId) {
            $event = Event::findOrFail($id);
            if ($event->entered_by !== $userId) {
                return false;
            }
            $event->delete();
            return true;
        });
    }
}
