# Deployment Guide - BNU Sustainability Dashboard

This project is built with **Laravel 12** (PHP 8.2+) and **React** (Vite). It is configured to use an **Oracle Database** (via `yajra/laravel-oci8`).

## 1. Backend Deployment (Laravel)

### Infrastructure Requirements
- **PHP 8.2+** with extensions: `pdo`, `openssl`, `mbstring`, `json`, `oci8` (or `pdo_oci`).
- **Oracle Instant Client** must be installed on the server to connect to Oracle Cloud.
- **Composer** for dependency management.

### Deployment Steps
1.  **Clone the project** to your server.
2.  **Navigate to `/backend`**.
3.  **Install dependencies**:
    ```bash
    composer install --optimize-autoloader --no-dev
    ```
4.  **Configure `.env`**:
    - Copy `.env.example` to `.env`.
    - Set `APP_ENV=production` and `APP_DEBUG=false`.
    - Configure `DB_CONNECTION=oracle`.
    - Provide your **Oracle Cloud** connection details (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
    - **Crucial**: Set `SANCTUM_STATEFUL_DOMAINS` and `SESSION_DOMAIN` if your frontend is on a different domain.
5.  **Generate App Key**:
    ```bash
    php artisan key:generate
    ```
6.  **Run Migrations & Seeds**:
    ```bash
    php artisan migrate --force
    php artisan db:seed --class=MasterSeeder
    ```
    *Note: `MasterSeeder` will automatically seed roles, schools, users, and the historical data from `data_dump.json`.*

---

## 2. Frontend Deployment (React)

### Steps
1.  **Navigate to `/frontend`**.
2.  **Configure Environment**:
    - Build process uses `.env.production`.
    - Ensure `VITE_API_URL` points to your backend API URL (e.g., `https://api.yourdomain.com/api/`).
3.  **Install & Build**:
    ```bash
    npm install
    npm run build
    ```
4.  **Host the `dist` folder**:
    - Upload the contents of the `dist` folder to your static hosting (Netlify, Vercel, S3, or Nginx).

---

## 3. Oracle Cloud Setup
1.  **Instance**: Ensure you have an Autonomous Database (ATP/ADW) or a VM-based Oracle instance.
2.  **Wallet**: If using Mutual TLS (mTLS), download the Wallet/Credentials and configure the `sqlnet.ora` and `tnsnames.ora` files.
3.  **TNS**: Use the `DB_TNS` variable in `.env` if you prefer connection strings over Host/Port.

## 4. Expert Level Tips
- **CORS**: The project is pre-configured to handle CORS. Ensure `CORS_ALLOWED_ORIGINS` in `.env` matches your frontend URL.
- **Caching**: In production, always run `php artisan config:cache`, `php artisan route:cache`, and `php artisan view:cache`.
- **Security**: Ensure your `.env` file is never publicly accessible.
