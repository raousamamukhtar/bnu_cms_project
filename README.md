# BNU Sustainability Data Management System

Welcome to the BNU Sustainability Data Management System (SDMS). This platform is designed to track, manage, and analyze sustainability metrics across various university departments.

## 🚀 Quick Start

### Backend (Laravel)
```bash
cd backend
composer install
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## 📚 Documentation

Detailed developer documentation is available in the `docs/` directory:

- [**Developer Guide**](docs/DEVELOPER.md) - Comprehensive system architecture, API docs, and role-based access details.
- [**Refactoring Summary**](docs/REFACTORING_SUMMARY.md) - Technical overview of the recent code improvements and restructuring.
- [**Production Cleanup Plan**](docs/PRODUCTION_CLEANUP.md) - Guidelines for preparing the codebase for production. (Coming soon)

## 🏗 System Overview

- **Backend:** Laravel 10.x, Oracle Database, Sanctum Auth.
- **Frontend:** React 18, Vite, Tailwind CSS, Service-based architecture.
- **Roles:** Admin, Coordinator, HR, Management, Marketing, Carbon Accountant.

---
© 2026 BNU Sustainability Team
