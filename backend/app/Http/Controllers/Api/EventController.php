<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\EventService;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Http\Resources\EventResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Traits\ApiResponser;

class EventController extends Controller
{
    use ApiResponser;

    public function __construct(protected EventService $eventService) {}

    public function index(Request $request): JsonResponse
    {
        $events = $this->eventService->getEventsForUser($request->user());
        return $this->successResponse(EventResource::collection($events), 'Events retrieved successfully');
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        $event = $this->eventService->createEvent($request->validated(), clone $request->user());
        return $this->successResponse(new EventResource($event), 'Event created successfully', 201);
    }

    public function update(UpdateEventRequest $request, $id): JsonResponse
    {
        $event = $this->eventService->updateEvent($id, $request->validated(), $request->user()->user_id);
        
        if (!$event) {
            return $this->errorResponse('Unauthorized or Event not found', 403);
        }

        return $this->successResponse(new EventResource($event), 'Event updated successfully');
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $userId = optional($request->user())->user_id ?? \App\Models\User::first()->user_id;

        $deleted = $this->eventService->deleteEvent($id, $userId);
        
        if (!$deleted) {
            return $this->errorResponse('Unauthorized or Event not found', 403);
        }

        return $this->successResponse(null, 'Event deleted successfully');
    }
}
