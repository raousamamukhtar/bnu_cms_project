<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'user_id' => $this->user_id,
            'email' => $this->email,
            'full_name' => $this->full_name,
            'role_id' => $this->role_id,
            'role' => $this->whenLoaded('role', function () {
                return [
                    'role_id' => $this->role->role_id,
                    'role_name' => $this->role->role_name,
                ];
            }),
            'school_id' => $this->school_id,
            'school' => $this->whenLoaded('school', function () {
                return [
                    'school_id' => $this->school->school_id,
                    'school_name' => $this->school->school_name,
                ];
            }),
        ];
    }
}
