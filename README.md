# BNU Sustainability Management System

A robust, enterprise-grade platform designed for managing and reporting university-wide sustainability initiatives, environmental metrics, and campus activities at Beaconhouse National University.

---

## 🏗️ Technology Stack

- **Backend**: Laravel 10 (Restful API)
- **Frontend**: React 18 (Vite) + Tailwind CSS
- **Database**: Oracle 19c (Integration via `yajra/laravel-oci8`)
- **Authentication**: Laravel Sanctum (Token-based)
- **Reporting**: JSPDF & ExcelJS for dynamic data exports

---

## 💻 Local Development Setup

Follow these steps exactly to get the project running on your local machine.

### 1. Prerequisites
Ensure you have the following installed:
- **PHP 8.1+**
- **Composer** (PHP Package Manager)
- **Node.js** (v16+) & **NPM**
- **Oracle Instant Client** (Required for Laravel to talk to Oracle 19c)

---

### 2. Backend Setup (`/backend`)

1. **Navigate to the directory**:
   ```bash
   cd backend
   ```
2. **Install Dependencies**:
   ```bash
   composer install
   ```
3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   *Edit the `.env` file and configure your `DB_HOST`, `DB_PORT`, `DB_USERNAME`, and `DB_PASSWORD` to match your local or campus Oracle instance.*
4. **Generate Application Key**:
   ```bash
   php artisan key:generate
   ```
5. **Initialize Database**:
   ```bash
   php artisan migrate --seed
   ```
   *This creates all tables and seeds 15 test users with all university roles.*
6. **Start the API Server**:
   ```bash
   php artisan serve
   ```
   *By default, this runs at `http://localhost:8000`.*

---

### 3. Frontend Setup (`/frontend`)

1. **Navigate to the directory**:
   ```bash
   cd frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   *Ensure `VITE_API_URL` is set to `http://localhost:8000/api`.*
4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   *Open your browser at `http://localhost:5173`.*

---

## 🚦 Roles & Authentication

The project comes with a complex Role-Based Access Control (RBAC) system. 

- **Default Password**: `password` (for all seeded users)
- **Primary Admin**: `admin@bnu.edu.pk`
- **Management Audit**: `management@bnu.edu.pk`
- **School Coordinators**: `slass1@bnu.edu.pk`, `coordinator1@bnu.edu.pk`, etc.

*Refer to `docs/USER_MANUAL.md` for the full list of 15 users and their specific dashboard limitations.*

---

## 📁 Project Documentation

For a successful handover, several in-depth guides are provided in the `/docs` folder:

1. **[Handover Guide](file:///Users/macbook/.gemini/antigravity/brain/d33a2fa9-5994-43af-9ddd-432dc047e654/handover_guide.md)**: Details the Service Layer architecture and business logic.
2. **[Database Schema](docs/DATABASE_SCHEMA.md)**: ER Diagrams and table-by-table field definitions.
3. **[API Documentation](docs/API_DOCUMENTATION.md)**: Full list of endpoints for Consumptions, Events, and Carbon tracking.
4. **[Backend Documentation](docs/BACKEND_DOCUMENTATION.md)**: In-depth guide on services, patterns, and logic.
5. **[User Manual](docs/USER_MANUAL.md)**: A step-by-step guide for each user type (Admin, Coordinator, HR, etc.).
6. **[SQL Setup Script](docs/DATABASE_SETUP.sql)**: Raw Oracle SQL for manual database initialization.

---

## 🛠️ Maintenance & Troubleshooting

- **Oracle ORA-12170/ORA-12541**: These errors usually mean the database host is unreachable. Ensure you are on the BNU campus network or VPN if using the central server.
- **Frontend 401 Unauthorized**: Ensure the `.env` on the backend has a valid `APP_KEY` and that your token has not expired.
- **Reporting Issues**: Exported files (PDF/Excel) rely on client-side generation. Ensure your browser is not blocking pop-ups or downloads.

---
© 2026 BNU Sustainability Project Team
