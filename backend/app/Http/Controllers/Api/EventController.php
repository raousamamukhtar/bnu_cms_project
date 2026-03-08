<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use App\Traits\ApiResponser;

class EventController extends Controller
{
    use ApiResponser;

    /**
     * Get all events for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        // Get authenticated user (required - route is protected by auth middleware)
        $user = $request->user();
        $userId = $user->user_id;
        $roleId = $user->role_id;

        // Management (role_id 21) and Student Affairs (role_id 4) can see ALL events
        if ($roleId == 4 || $roleId == 21) {
            // Fetch ALL events with user and role info for filtering
            $events = Event::with('user.role')
                ->orderBy('event_year', 'desc')
                ->orderBy('event_month', 'desc')
                ->orderBy('event_date', 'desc')
                ->get()
                ->map(function ($event) {
                    return [
                        'id' => $event->event_id,
                        'year' => $event->event_year,
                        'month' => $event->event_month,
                        'name' => $event->event_name,
                        'type' => $event->event_type,
                        'date' => $event->event_date,
                        'description' => $event->description,
                        'attachment' => $event->attachment_path,
                        'submittedAt' => $event->created_at,
                        'submittedBy' => $event->user ? $event->user->full_name : 'Unknown',
                        'department' => $event->user && $event->user->role ? $event->user->role->role_name : 'Unknown',
                        'role_id' => $event->user ? $event->user->role_id : null, 
                    ];
                });
        } elseif ($roleId == 2) {
            // School Coordinators see all events from their school
            $schoolId = $user->school_id;
            $events = Event::where('school_id', $schoolId)
                ->with('user')
                ->orderBy('event_year', 'desc')
                ->orderBy('event_month', 'desc')
                ->orderBy('event_date', 'desc')
                ->get()
                ->map(function ($event) {
                    return [
                        'id' => $event->event_id,
                        'year' => $event->event_year,
                        'month' => $event->event_month,
                        'name' => $event->event_name,
                        'type' => $event->event_type,
                        'date' => $event->event_date,
                        'description' => $event->description,
                        'attachment' => $event->attachment_path,
                        'submittedAt' => $event->created_at,
                        'submittedBy' => $event->user ? $event->user->full_name : 'Unknown',
                    ];
                });
        } else {
            // Other roles (HR, Marketing, etc.) see only their own events
            $events = Event::where('entered_by', $userId)
                ->orderBy('event_year', 'desc')
                ->orderBy('event_month', 'desc')
                ->orderBy('event_date', 'desc')
                ->get()
                ->map(function ($event) {
                    return [
                        'id' => $event->event_id,
                        'year' => $event->event_year,
                        'month' => $event->event_month,
                        'name' => $event->event_name,
                        'type' => $event->event_type,
                        'date' => $event->event_date,
                        'description' => $event->description,
                        'attachment' => $event->attachment_path,
                        'submittedAt' => $event->created_at,
                    ];
                });
        }

        return response()->json($events);
    }

    /**
     * Store a new event
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_month' => 'required|integer|min:1|max:12',
            'event_year' => 'required|integer',
            'event_name' => 'required|string|max:255',
            'event_type' => 'required|string|max:255',
            'event_date' => 'required|date',
            'description' => 'required|string',
            'attachment_path' => 'nullable|string',
            'school_id' => 'nullable|integer',
        ]);

        // Get authenticated user
        $user = $request->user();
        $userId = $user->user_id;
        $roleId = $user->role_id;
        
        // Coordinators (Role 2) must have a school_id. 
        // We prioritize the one from request, then fall back to user's school_id.
        $schoolId = null;
        if ($roleId == 2) {
            $schoolId = $validated['school_id'] ?? $user->school_id;
            
            // If still null, try to find it from the user's record again just in case
            if (!$schoolId) {
                $schoolId = \App\Models\User::find($userId)->school_id;
            }
        }
        
        // Add internally managed fields
        $validated['entered_by'] = $userId;
        $validated['school_id'] = $schoolId;
        // created_at is handled by DB default (useCurrent), but can be set manually if needed
        $validated['created_at'] = now(); 

        $event = Event::create($validated);

        return $this->successResponse([
            'id' => $event->event_id,
            'year' => $event->event_year,
            'month' => $event->event_month,
            'name' => $event->event_name,
            'type' => $event->event_type,
            'date' => $event->event_date,
            'description' => $event->description,
            'attachment' => $event->attachment_path,
        ], 'Event created successfully', 201);
    }

    /**
     * Update an existing event
     */
    public function update(Request $request, $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        
        // Verify the event belongs to the authenticated user
        $userId = $request->user()->user_id;
        if ($event->entered_by !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'event_month' => 'sometimes|integer|min:1|max:12',
            'event_year' => 'sometimes|integer',
            'event_name' => 'sometimes|string|max:255',
            'event_type' => 'sometimes|string|max:255',
            'event_date' => 'sometimes|date',
            'description' => 'sometimes|string',
            'attachment_path' => 'nullable|string',
        ]);

        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully',
            'data' => [
                'id' => $event->event_id,
                'year' => $event->event_year,
                'month' => $event->event_month,
                'name' => $event->event_name,
                'type' => $event->event_type,
                'date' => $event->event_date,
                'description' => $event->description,
                'attachment' => $event->attachment_path,
            ]
        ]);
    }

    /**
     * Delete an event
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        
        // Verify the event belongs to the authenticated user
        $userId = optional($request->user())->user_id ?? \App\Models\User::first()->user_id;
        if ($event->entered_by !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
}
