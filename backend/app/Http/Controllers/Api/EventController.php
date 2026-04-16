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
    
    /**
     * List all events for the authenticated user.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $events = $this->eventService->getEventsForUser($request->user());
            return $this->successResponse(EventResource::collection($events), 'Events retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch events: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created event.
     * 
     * @param StoreEventRequest $request
     * @return JsonResponse
     */
    public function store(StoreEventRequest $request): JsonResponse
    {
        try {
            $event = $this->eventService->createEvent($request->validated(), $request->user());
            return $this->successResponse(new EventResource($event->load('school')), 'Event created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create event: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update an existing event.
     * 
     * @param UpdateEventRequest $request
     * @param int|string $id
     * @return JsonResponse
     */
    public function update(UpdateEventRequest $request, $id): JsonResponse
    {
        try {
            $event = $this->eventService->updateEvent($id, $request->validated(), $request->user());
            
            if (!$event) {
                return $this->errorResponse('Unauthorized access or resource not found', 403);
            }

            return $this->successResponse(new EventResource($event->load('school')), 'Event updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update event: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove an event from the database.
     * 
     * @param Request $request
     * @param int|string $id
     * @return JsonResponse
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        try {
            $deleted = $this->eventService->deleteEvent($id, $request->user());
            
            if (!$deleted) {
                return $this->errorResponse('Unauthorized access or resource not found', 403);
            }

            return $this->successResponse(null, 'Event deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete event: ' . $e->getMessage(), 500);
        }
    }
}
