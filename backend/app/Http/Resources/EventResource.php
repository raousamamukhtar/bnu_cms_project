<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Enums\RoleEnum;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();

        $data = [
            'id' => $this->event_id,
            'year' => $this->event_year,
            'month' => $this->event_month,
            'name' => $this->event_name,
            'type' => $this->event_type,
            'date' => $this->event_date,
            'description' => $this->description,
            'link' => $this->event_link,
            'submittedAt' => $this->created_at,
            'entered_by' => $this->entered_by,
            'school_id' => $this->school_id,
            'school_name' => $this->relationLoaded('school') && $this->school ? $this->school->school_name : null,
            'submitter_role_id' => $this->relationLoaded('user') && $this->user ? $this->user->role_id : null,
        ];

        if ($user && ($user->role_id == RoleEnum::ADMIN->value || $user->role_id == RoleEnum::MANAGEMENT->value || $user->role_id == RoleEnum::SCHOOL_COORDINATOR->value)) {
            $data['submittedBy'] = $this->relationLoaded('user') && $this->user ? $this->user->full_name : 'Unknown';
            $data['department'] = $this->relationLoaded('user') && $this->user && $this->user->role ? $this->user->role->role_name : 'Unknown';
            $data['role_id'] = $this->relationLoaded('user') && $this->user ? $this->user->role_id : null; 
        } else {
            // For other roles (HR, Marketing, Coordinator, Student Affairs), only their own events are shown
            // They already know it is theirs, but we can still return their name
            $data['submittedBy'] = $this->relationLoaded('user') && $this->user ? $this->user->full_name : 'Me';
        }

        return $data;
    }
}
