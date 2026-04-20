# BNU Sustainability - Backend Technical Documentation

This document provides a deep dive into the backend architecture, implementation patterns, and core business logic for developers maintaining the system.

## 🏗️ Architectural Pattern: Service-Oriented Design

The backend follows a **Controller -> Service -> Model** architecture to ensure business logic is decoupled from HTTP concerns.

### 1. Controllers (The Entry Point)
Located in `app/Http/Controllers/Api/`.
- **Role**: Validate incoming requests using **FormRequests** and return standardized JSON responses via the `ApiResponser` trait.
- **Key Files**: `SustainabilityController.php`, `EventController.php`, `CarbonController.php`.

### 2. Services (The Engine)
Located in `app/Services/`.
- **Role**: Handle all complex calculations (e.g., Per-Capita Waste), database transactions, and business rules.
- **Key Services**:
    - **`SustainabilityService`**: Manages the synchronization of `SustainabilityPeriod` with consumption metrics (Paper, Water, etc.).
    - **`EventService`**: Enforces strict role-based access control (RBAC) on event visibility.
    - **`CarbonService`**: Manages AQI and Footprint auditing.

### 3. Models (The Data Layer)
Located in `app/Models/`.
- **Role**: Define table schemas, relationships, and hidden fields.
- **Oracle Note**: Explicitly uses `$table` and `$primaryKey` properties since Oracle often requires specific casing or non-standard increments.

---

## ⚡ Core Business Logic: Perpetual Sync

A unique feature of this backend is the **Dynamic Recalculation** system in `SustainabilityService.php`.

```php
public function syncDependentMetrics(int $periodId) {
    // When students/employees headcount changes in a Period,
    // this method automatically recalculates the Per-Capita values 
    // across all linked consumption tables.
}
```

This ensures that historical sustainability benchmarks automatically stay accurate if personnel counts are corrected months later.

---

## 🛡️ Cross-Cutting Concerns

### 1. Global Response Format
All API responses follow a unified structure provided by the `ApiResponser` trait:
```json
{
  "status": "Success",
  "message": "...",
  "data": { ... }
}
```

### 2. Validation (`app/Http/Requests`)
Every input is strictly typed. For example:
- `StorePaperRequest.php`: Ensures `paper_reams` is numeric and within reasonable bounds.
- `LoginRequest.php`: Sanitizes credentials before they hit the service.

### 3. Error Handling
Controllers use `try-catch` blocks to capture database exceptions (especially important for Oracle network latency issues) and return graceful error messages instead of system stack traces.

---

## 📅 Performance: Eager Loading

To prevent **N+1 query problems** on high-traffic management dashboards, we utilize eager loading:
```php
// In EventService.php
return Event::with(['school', 'user'])->get();
```
This reduces the database load significantly by fetching associated relationships in a single optimized query.

---

## ⚙️ Oracle 19c Specifics

- **Naming Conventions**: Table names are kept singular or based on clear functional groupings (`paper_consumption`). 
- **Large Text**: Event descriptions use `CLOB` equivalents to handle extensive descriptions.
- **Connectivity**: The app utilizes `yajra/laravel-oci8`. Configuration is centralized in `config/database.php`.

---
© 2026 BNU Sustainability Backend Team
