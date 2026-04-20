<?php

namespace App\Services;

use App\Models\Event;
use App\Enums\RoleEnum;
use Illuminate\Support\Facades\DB;

class EventService
{
    /**
     * Retrieve events based on user role and school context.
     * 
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getEventsForUser($user)
    {
        $roleId = $user->role_id;
        $userId = $user->user_id;

        // Management and Admin: Universal visibility
        if ($roleId == RoleEnum::MANAGEMENT->value || $roleId == RoleEnum::ADMIN->value) {
            return Event::with(['user.role', 'school'])
                ->orderBy('event_year', 'desc')
                ->orderBy('event_month', 'desc')
                ->orderBy('event_date', 'desc')
                ->get();
        } 
        
        // School Coordinators: Bound by school_id
        if ($roleId == RoleEnum::SCHOOL_COORDINATOR->value) {
            return Event::with(['user.role', 'school'])
                ->where('school_id', $user->school_id)
                ->orderBy('event_year', 'desc')
                ->orderBy('event_month', 'desc')
                ->orderBy('event_date', 'desc')
                ->get();
        }

        // Functional Roles (HR, Marketing, etc.): Limited to own entries
        return Event::with(['user', 'school'])
            ->where('entered_by', $userId)
            ->orderBy('event_year', 'desc')
            ->orderBy('event_month', 'desc')
            ->orderBy('event_date', 'desc')
            ->get();
    }

    /**
     * Create a new event with support for both links and file attachments.
     * 
     * @param array $data Validated event parameters
     * @param \App\Models\User $user The creating entity
     * @return Event
     */
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

            // Handle optional file attachment
            $attachmentPath = null;
            if (isset($data['attachment']) && $data['attachment'] instanceof \Illuminate\Http\UploadedFile) {
                $attachmentPath = $data['attachment']->store('events', 'public');
            }

            // Map incoming data to model fields
            $entity = [
                'event_month' => $data['event_month'],
                'event_year' => $data['event_year'],
                'event_name' => $data['event_name'],
                'event_type' => $data['event_type'],
                'event_date' => $data['event_date'],
                'description' => $data['description'],
                'event_link' => $data['event_link'] ?? null,
                'attachment_path' => $attachmentPath,
                'entered_by' => $user->user_id,
                'school_id' => $schoolId,
                'created_at' => now(),
            ];

            return Event::create($entity);
        });
    }

    /**
     * Update an event record with strict permission verification.
     * 
     * @param int $id
     * @param array $data Updated fields
     * @param \App\Models\User $user
     * @return Event|null Returns null if access denied
     */
    public function updateEvent(int $id, array $data, $user)
    {
        return DB::transaction(function () use ($id, $data, $user) {
            $event = Event::with('user')->findOrFail($id);
            
            // Comprehensive permission check: Owner OR Admin OR Management OR School Context
            $canAccess = $event->entered_by === $user->user_id || 
                         $user->role_id == RoleEnum::ADMIN->value ||
                         $user->role_id == RoleEnum::MANAGEMENT->value ||
                         ($user->school_id && $event->school_id === $user->school_id);

            if (!$canAccess) {
                return null;
            }

            $event->update($data);
            return $event;
        });
    }

    /**
     * Delete an event record securely.
     * 
     * @param int $id
     * @param \App\Models\User $user
     * @return bool
     */
    public function deleteEvent(int $id, $user)
    {
        return DB::transaction(function () use ($id, $user) {
            $event = Event::with('user')->findOrFail($id);
            
            $canAccess = $event->entered_by === $user->user_id || 
                         $user->role_id == RoleEnum::ADMIN->value ||
                         $user->role_id == RoleEnum::MANAGEMENT->value ||
                         ($user->school_id && $event->school_id === $user->school_id);

            if (!$canAccess) {
                return false;
            }

            $event->delete();
            return true;
        });
    }
}
