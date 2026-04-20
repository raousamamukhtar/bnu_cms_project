# BNU Sustainability API Documentation

This document provides a comprehensive overview of the API endpoints available in the BNU Sustainability backend.

## Base URL
`http://localhost:8000/api` (or your local environment BNU backend URL)

## Authentication
Most endpoints require a Bearer Token in the `Authorization` header.
`Authorization: Bearer {token}`

---

## 1. Authentication Endpoints

### Login
*   **Endpoint:** `POST /auth/login`
*   **Description:** Authenticates a user and returns a Sanctum token.
*   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Login successful",
      "user": {
        "user_id": 1,
        "email": "...",
        "full_name": "...",
        "role": { "role_id": 1, "role_name": "..." },
        "school": { "school_id": 1, "school_name": "..." }
      },
      "token": "..."
    }
    ```

### Logout
*   **Endpoint:** `POST /auth/logout`
*   **Description:** Revokes the current access token.
*   **Authentication:** Required (Sanctum)
*   **Success Response (200 OK):**
    ```json
    { "message": "Logged out successfully" }
    ```

---

## 2. Reports & Dashboard

### Dashboard Data
*   **Endpoint:** `GET /reports/dashboard`
*   **Description:** Retrieves aggregated sustainability data for all periods.
*   **Authentication:** Not required (publicly accessible or via session)
*   **Success Response (200 OK):** Returns a list of periods with consumption metrics (paper, electricity, waste, etc.).

---

## 3. Sustainability Data Entry

These endpoints allow authorized users (e.g., Sustainability Admins) to enter monthly consumption data.

### Step 1: Initialize/Retrieve Period
*   **Endpoint:** `POST /sustainability/period`
*   **Authentication:** Required
*   **Request Body:**
    ```json
    {
      "data_month": 2,
      "data_year": 2026,
      "students": 5000, 
      "employees": 300
    }
    ```
*   **Description:** Creates a new sustainability period or updates people count for an existing one.

### Step 2-7: Consumption Metrics
Entries are linked to the `period_id` obtained from Step 1.

#### Paper Consumption
*   **Endpoint:** `POST /sustainability/paper`
*   **Request Body:** `{"period_id": 1, "paper_reams": 50, "sheets_per_ream": 500}`

#### Electricity Consumption
*   **Endpoint:** `POST /sustainability/electricity`
*   **Request Body:** `{"period_id": 1, "units_kwh": 1200, "total_cost": 25000}`

#### Waste Generation
*   **Endpoint:** `POST /sustainability/waste`
*   **Request Body:** `{"period_id": 1, "organic_kg": 100, "recyclable_kg": 50, "other_kg": 20}`

#### Generator Usage
*   **Endpoint:** `POST /sustainability/generator`
*   **Request Body:** `{"period_id": 1, "avg_running_hours": 10, "fuel_litres": 150}`

#### Business Travel
*   **Endpoint:** `POST /sustainability/travel`
*   **Request Body:** `{"period_id": 1, "travel_km": 500, "fuel_litres": 40}`

#### Water Consumption
*   **Endpoint:** `POST /sustainability/water`
*   **Request Body:** `{"period_id": 1, "units": 200, "price_per_unit": 1.5}`

---

## 4. Carbon Metrics

Managing AQI and Carbon Footprint data.

### List Carbon Metrics
*   **Endpoint:** `GET /sustainability/carbon`
*   **Authentication:** Required

### Save Carbon Metric
*   **Endpoint:** `POST /sustainability/carbon`
*   **Request Body:**
    ```json
    {
      "month": "February",
      "year": 2026,
      "aqi": 150,
      "carbonFootprint": 25.5
    }
    ```

### Update Carbon Metric
*   **Endpoint:** `PUT /sustainability/carbon/{id}`
*   **Request Body:** `{"aqi": 155, "carbonFootprint": 26.0}`

### Delete Carbon Metric
*   **Endpoint:** `DELETE /sustainability/carbon/{id}`
*   **Description:** Permanently removes a carbon metric entry.
*   **Authentication:** Required

---

## 5. Events Management

Endpoints for HR, Marketing, and Student Affairs to manage sustainability-related events.

### List Events
*   **Endpoint:** `GET /events`
*   **Authentication:** Required
*   **Description:** Management users see all events; others see only their own.

### Create Event
*   **Endpoint:** `POST /events`
*   **Request Body:**
    ```json
    {
      "event_month": 2,
      "event_year": 2026,
      "event_name": "Eco Workshop",
      "event_type": "Workshop",
      "event_date": "2026-02-15",
      "description": "...",
      "event_link": "https://example.com/report"
    }
    ```

### Update/Delete Event
*   **Endpoint:** `PUT /events/{id}` | `DELETE /events/{id}`
*   **Authentication:** Required (Only the creator can modify/delete)
