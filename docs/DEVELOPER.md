# Sustainability Data Management System - Developer Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Database Schema](#database-schema)
5. [API Documentation](#api-documentation)
6. [Frontend Architecture](#frontend-architecture)
7. [Authentication Flow](#authentication-flow)
8. [Data Entry Workflow](#data-entry-workflow)
9. [Dashboard Workflows](#dashboard-workflows)
10. [Code Structure](#code-structure)
11. [Key Features](#key-features)

---

## System Overview

The Sustainability Data Management System (SDMS) is a full-stack web application built to manage sustainability metrics for educational institutions. It enables different departments to submit environmental data (electricity, water, waste, etc.) and provides analytics dashboards for management.

### Technology Stack

**Backend:**
- Laravel 10.x (PHP Framework)
- Oracle Database
- Sanctum (API Authentication)

**Frontend:**
- React 18.x
- React Router v6
- Vite (Build Tool)
- Tailwind CSS (Styling)

---

## Architecture

### High-Level Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   React SPA     │ ◄─────► │  Laravel API     │ ◄─────► │ Oracle Database │
│  (Port 5173)    │  HTTP   │  (Port 8000)     │   OCI   │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

### Request Flow

```
User Action → React Component → API Service → Laravel Controller → Model → Database
                                      ↓
                              Response ← JSON ← Resource ← Query Result
```

---

## User Roles & Permissions

### Role Hierarchy

| Role ID | Role Name | Database Value | Access Level |
|---------|-----------|----------------|--------------|
| 1 | Sustainability Admin | SUSTAINABILITY_ADMIN | Full system access |
| 2 | School Coordinator | SCHOOL_COORDINATOR | Department data entry |
| 3 | HR | HR | Employee events only |
| 4 | Management | STUDENT_AFFAIRS | Read-only dashboards |
| 5 | Marketing | MARKETING | Marketing events only |
| 6 | Carbon Accountant | CARBON_ACCOUNTANT | Data entry + analytics |

### Role Capabilities

#### 1. Sustainability Admin (Role ID: 1)
**Permissions:**
- ✅ Enter all sustainability data (Paper, Electricity, Water, Waste, Generator, Travel)
- ✅ View complete history
- ✅ Access all dashboards
- ✅ Final submission of monthly data

**Routes:**
- `/admin/dashboard` - Overview with all metrics
- `/admin/data-entry` - 7-step data entry form
- `/admin/history` - Complete submission history

**Key Features:**
- Multi-step data entry with validation
- Final submission modal with "Enter Next Month" option
- Auto-increment month/year after submission

#### 2. School Coordinator (Role ID: 2)
**Permissions:**
- ✅ Enter event data (sustainability initiatives)
- ✅ View coordinator dashboard
- ✅ View event history

**Routes:**
- `/coordinator/dashboard` - Event metrics
- `/coordinator/data-entry` - Event submission form
- `/coordinator/history` - Event history

#### 3. HR (Role ID: 3)
**Permissions:**
- ✅ Enter employee-related events
- ✅ View HR dashboard

**Routes:**
- `/hr/dashboard` - HR metrics
- `/hr/data-entry` - Employee event form

#### 4. Management (Role ID: 4)
**Permissions:**
- ✅ View comprehensive analytics
- ✅ Export reports
- ❌ No data entry

**Routes:**
- `/management/dashboard` - Executive dashboard
- `/management/reports` - Report generation & export

#### 5. Marketing (Role ID: 5)
**Permissions:**
- ✅ Enter marketing events
- ✅ View marketing dashboard
- ✅ View marketing history

**Routes:**
- `/marketing/dashboard` - Marketing metrics
- `/marketing/data-entry` - Marketing event form
- `/marketing/history` - Marketing event history

#### 6. Carbon Accountant (Role ID: 6)
**Permissions:**
- ✅ Enter carbon-related data
- ✅ View carbon analytics
- ✅ View carbon history

**Routes:**
- `/carbon-accountant/dashboard` - Carbon metrics
- `/carbon-accountant/data-entry` - Carbon data form
- `/carbon-accountant/history` - Carbon data history

---

## Database Schema

### Core Tables

#### 1. `users` Table
Stores all system users with role assignments.

```sql
CREATE TABLE users (
    user_id NUMBER PRIMARY KEY,
    email VARCHAR2(255) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    full_name VARCHAR2(255),
    role_id NUMBER NOT NULL,
    school_id NUMBER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Key Fields:**
- `user_id` - Auto-generated unique identifier
- `email` - Login credential (unique)
- `role_id` - Links to roles table (1-6)
- `school_id` - Department/school assignment

#### 2. `roles` Table
Defines available user roles.

```sql
CREATE TABLE roles (
    role_id NUMBER PRIMARY KEY,
    role_name VARCHAR2(100) UNIQUE NOT NULL,
    created_at TIMESTAMP
);
```

**Default Roles:**
```sql
INSERT INTO roles VALUES (1, 'SUSTAINABILITY_ADMIN', SYSDATE);
INSERT INTO roles VALUES (2, 'SCHOOL_COORDINATOR', SYSDATE);
INSERT INTO roles VALUES (3, 'HR', SYSDATE);
INSERT INTO roles VALUES (4, 'STUDENT_AFFAIRS', SYSDATE);
INSERT INTO roles VALUES (5, 'MARKETING', SYSDATE);
INSERT INTO roles VALUES (6, 'CARBON_ACCOUNTANT', SYSDATE);
```

#### 3. `sustainability_periods` Table
Stores monthly period data (students, employees).

```sql
CREATE TABLE sustainability_periods (
    period_id NUMBER PRIMARY KEY,
    data_month VARCHAR2(20) NOT NULL,
    data_year VARCHAR2(4) NOT NULL,
    students NUMBER,
    employees NUMBER,
    created_by NUMBER,
    created_at TIMESTAMP,
    CONSTRAINT unique_period UNIQUE (data_month, data_year)
);
```

**Purpose:**
- Tracks monthly headcount (students + employees)
- Used for per-capita calculations
- Created in Step 1 of admin data entry

#### 4-9. Sustainability Metric Tables
- `sustainability_paper` - Paper consumption
- `sustainability_electricity` - Electricity usage
- `sustainability_water` - Water consumption
- `sustainability_waste` - Waste management
- `sustainability_generator` - Generator usage
- `sustainability_travel` - Business travel

All follow similar structure with `period_id` foreign key.

#### 10. `events` Table
Sustainability events/initiatives.

```sql
CREATE TABLE events (
    event_id NUMBER PRIMARY KEY,
    event_name VARCHAR2(255) NOT NULL,
    event_date DATE NOT NULL,
    event_link VARCHAR2(500),
    participants NUMBER,
    school_id NUMBER NOT NULL,
    entered_by NUMBER NOT NULL,
    created_at TIMESTAMP
);
```

---

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication
All protected routes require Bearer token authentication via Laravel Sanctum.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

### Key Endpoints

#### Authentication

**POST `/login`**
```json
Request:
{
  "email": "admin@bnu.edu.pk",
  "password": "password"
}

Response:
{
  "token": "1|abc123...",
  "user": {
    "user_id": 1,
    "email": "admin@bnu.edu.pk",
    "full_name": "Admin User",
    "role_id": 1,
    "role": { "role_name": "SUSTAINABILITY_ADMIN" }
  }
}
```

#### Sustainability Data

**POST `/sustainability/period`** - Create/update monthly period
**POST `/sustainability/paper`** - Submit paper data
**POST `/sustainability/electricity`** - Submit electricity data
**POST `/sustainability/water`** - Submit water data
**POST `/sustainability/waste`** - Submit waste data
**POST `/sustainability/generator`** - Submit generator data
**POST `/sustainability/travel`** - Submit travel data
**GET `/sustainability/history`** - Get all submitted periods

#### Events

**GET `/events`** - Get user's events
**POST `/events`** - Create event
**PUT `/events/{id}`** - Update event
**DELETE `/events/{id}`** - Delete event

#### Carbon & AQI (Dedicated)
**GET `/sustainability/carbon`** - Get carbon entry history
**POST `/sustainability/carbon`** - Create new carbon metric
**PUT `/sustainability/carbon/{id}`** - Update carbon metric

---

## Frontend Architecture

### Directory Structure

```
frontend/src/
├── components/
│   ├── admin/           # Admin-specific components
│   ├── layout/          # Layout components (Sidebar, Navbar)
│   └── ui/              # Reusable UI components
├── context/             # React Context providers
│   ├── AuthContext.jsx
│   ├── DataContext.jsx
│   └── UIContext.jsx
├── hooks/               # Custom React hooks
├── pages/               # Page components (by role)
├── routes/              # Routing configuration
├── services/            # API service layer
└── utils/               # Utility functions
```

### State Management

#### AuthContext
Manages user authentication state and token.

**Methods:**
- `login(email, password)` - Authenticate user
- `logout()` - Clear session
- `checkAuth()` - Verify token

#### UIContext
Manages UI state (toasts, modals).

**Methods:**
- `addToast(message, type)` - Show notification
  - Auto-deduplicates within 1 second
  - Auto-removes after 3.2 seconds

---

## Authentication Flow

### Login Process

```
1. User enters credentials
2. POST /api/login
3. Backend validates & generates token
4. Frontend stores token in localStorage
5. Sets Authorization header
6. Redirects to role-specific dashboard
```

**Code Example:**
```javascript
const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  localStorage.setItem('sdms_auth', JSON.stringify({
    user_id: data.user.user_id,
    token: data.token,
    role: ROLE_ID_TO_NAME[data.user.role_id]
  }));
  
  setAuthToken(data.token);
  return ROLE_REDIRECT[data.user.role?.role_name];
};
```

---

## Data Entry Workflow

### Admin 7-Step Process

```
Step 1: Basic Information (Period)
Step 2: Paper Consumption
Step 3: Electricity Usage
Step 4: Water Consumption
Step 5: Waste Management
Step 6: Generator Usage
Step 7: Business Travel
Final Submission → Success Modal
```

### Step Submission Flow

```javascript
1. Validate step data
2. Prepare data for API
3. Submit to backend endpoint
4. Mark tab as submitted
5. Save status to localStorage
6. Show success toast
```

### Final Submission

After all 7 steps completed:

**Success Modal Options:**
1. **Enter Next Month Data** - Resets form, auto-increments month
2. **Go to Dashboard** - Navigate to dashboard

**Month Increment Logic:**
```javascript
December 2025 → January 2026
March 2025 → April 2025
```

---

## Dashboard Workflows

### Admin Dashboard
- Displays all sustainability metrics
- Shows latest period data
- Calculates per-capita values
- Provides monthly trends

### Coordinator Dashboard
- Shows events created by user
- Displays participant counts
- Lists recent events

### Management Dashboard
- Executive summary
- All metrics aggregated
- Comparative analysis
- Export functionality
- **Yearly Aggregation:** Automatically calculates annual totals for consumptions and averages for scores (AQI).
- **Smart Event Audit**: Management can filter all university activities by **Department**, **School (SLASS/SCIT)**, and **Reporting Period**.
- **Real-time Live Feed**: Searchable event stream with direct access to documentation links.
- **Report Generation**: PDF/Excel exports that now include the "Resource Link" column for all events.

---

## Code Structure

### Backend Controllers

**SustainabilityController.php**
- `period()` - Create/update period
- `paper()` - Submit paper data
- `electricity()` - Submit electricity data
- `water()` - Submit water data
- `waste()` - Submit waste data
- `generator()` - Submit generator data
- `travel()` - Submit travel data
- `history()` - Get all periods

**EventController.php**
- `index()` - Get user's events
- `store()` - Create event
- `update()` - Update event
- `destroy()` - Delete event

### Frontend Services

**dataEntryService.js**
- `saveStepData()` - Submit step to API
- `loadStepData()` - Load from localStorage
- `areAllStepsCompleted()` - Check completion
- `submitCompleteEntry()` - Final submission

---

## Key Features

### 1. Role-Based Access Control
- Backend middleware checks roles
- Frontend RoleRoute restricts access
- Database role_id links permissions

### 2. Multi-Step Form
- 7-step wizard interface
- Step-by-step validation
- Progress tracking
- Data persistence

### 3. Toast Notifications
- Auto-dismiss (3.2s)
- Duplicate detection (1s window)
- Types: success, error, warning

### 4. Data Persistence
- LocalStorage for form data
- Submission status tracking
- Survives page refresh

### 5. Auto Month Increment
- Calculates next month
- Handles year rollover
- Resets form automatically

### 6. Dynamic Data Management
- **Carbon Data**: Fully editable/deletable by authorized accountants to ensure audit accuracy.
- **Events**: Documentation is stored via **Resource Links** (URLs), allowing for easy cloud-based verification without server storage overhead.
- **Admin Consumption**: Month-old entries are locked to maintain permanent monthly records.

### 7. API Security (Sanctum)
- All sustainability routes protected by `auth:sanctum`.
- Dynamic user attribution (removes hardcoded fallback IDs).

---

## Development Guidelines

### Adding New Role
1. Add to `roles` table
2. Update backend constants
3. Add frontend mappings
4. Create dashboard component
5. Add routes
6. Update sidebar

### Adding New Metric
1. Create database table
2. Add migration & model
3. Add controller method
4. Add API route
5. Add frontend form step
6. Add validation
7. Add API service call

---

## Common Issues & Solutions

**Issue:** Multiple toasts on login
**Solution:** Removed StrictMode, added deduplication

**Issue:** Final Submit disabled
**Solution:** Complete all 7 tabs first

**Issue:** Can't edit old entries
**Solution:** By design - only last month editable

---

## Deployment

### Backend
1. Set environment variables
2. Run migrations
3. Seed database
4. Configure web server
5. Set up SSL

### Frontend
1. Update API URL
2. Build: `npm run build`
3. Deploy `dist/` folder
4. Configure SPA routing

---

## Conclusion

This documentation provides comprehensive coverage of the Sustainability Data Management System architecture, workflows, and implementation details. Refer to source code for specific implementations.
