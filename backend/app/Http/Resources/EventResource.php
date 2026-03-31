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
            'attachment' => $this->attachment_path,
            'submittedAt' => $this->created_at,
        ];

        if ($user && ($user->role_id == RoleEnum::STUDENT_AFFAIRS->value || $user->role_id == RoleEnum::MANAGEMENT->value)) {
            $data['submittedBy'] = $this->relationLoaded('user') && $this->user ? $this->user->full_name : 'Unknown';
            $data['department'] = $this->relationLoaded('user') && $this->user && $this->user->role ? $this->user->role->role_name : 'Unknown';
            $data['role_id'] = $this->relationLoaded('user') && $this->user ? $this->user->role_id : null; 
        } elseif ($user && $user->role_id == RoleEnum::SCHOOL_COORDINATOR->value) {
            $data['submittedBy'] = $this->relationLoaded('user') && $this->user ? $this->user->full_name : 'Unknown';
        }

        return $data;
    }
}
