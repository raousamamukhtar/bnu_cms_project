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

        // Management and Admin can see all events
        if ($roleId == RoleEnum::MANAGEMENT->value || $roleId == RoleEnum::ADMIN->value) {
            return Event::with(['user.role'])
                ->orderBy('event_year', 'desc')
                ->orderBy('event_month', 'desc')
                ->orderBy('event_date', 'desc')
                ->get();
        } 
        
        // Coordinators can see all events for their school
        if ($roleId == RoleEnum::SCHOOL_COORDINATOR->value) {
            return Event::with(['user.role'])
                ->where('school_id', $user->school_id)
                ->orderBy('event_year', 'desc')
                ->orderBy('event_month', 'desc')
                ->orderBy('event_date', 'desc')
                ->get();
        }

        // Everyone else (HR, Marketing, Student Affairs) only see their own entered events
        return Event::with('user')
            ->where('entered_by', $userId)
            ->orderBy('event_year', 'desc')
            ->orderBy('event_month', 'desc')
            ->orderBy('event_date', 'desc')
            ->get();
    }

    public function createEvent(array $data, $user)
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

    public function updateEvent(int $id, array $data, $user)
    {
        return DB::transaction(function () use ($id, $data, $user) {
            $event = Event::with('user')->findOrFail($id);
            
            $canAccess = $event->entered_by === $user->user_id || 
                         $user->role_id == RoleEnum::ADMIN->value ||
                         $user->role_id == RoleEnum::MANAGEMENT->value ||
                         ($user->school_id && $event->school_id === $user->school_id) ||
                         (!$user->school_id && $event->user && $event->user->role_id === $user->role_id);

            if (!$canAccess) {
                return null;
            }

            $event->update($data);
            return $event;
        });
    }

    public function deleteEvent(int $id, $user)
    {
        return DB::transaction(function () use ($id, $user) {
            $event = Event::with('user')->findOrFail($id);
            
            $canAccess = $event->entered_by === $user->user_id || 
                         $user->role_id == RoleEnum::ADMIN->value ||
                         $user->role_id == RoleEnum::MANAGEMENT->value ||
                         ($user->school_id && $event->school_id === $user->school_id) ||
                         (!$user->school_id && $event->user && $event->user->role_id === $user->role_id);

            if (!$canAccess) {
                return false;
            }

            $event->delete();
            return true;
        });
    }
}
