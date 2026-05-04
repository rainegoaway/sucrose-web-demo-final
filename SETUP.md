# Sucrose Web App Setup Guide

This project is a monitoring system for sugar brands and markets across different cities, built with Laravel 13 and React 19.

## Tech Stack

- **Backend:** [Laravel 13](https://laravel.com/) (PHP 8.3+)
- **Frontend:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Authentication:** [Laravel Sanctum](https://laravel.com/docs/sanctum)
- **Database:** PostgreSQL

## Prerequisites

- PHP 8.3 or higher
- Composer
- Node.js & NPM
- PostgreSQL

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sucrose-web-app
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Install JavaScript dependencies:**
   ```bash
   npm install
   ```

4. **Environment Setup:**
   Copy the example environment file and generate an application key.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database Setup:**
   Update the `.env` file with your PostgreSQL credentials:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=sucrose_db
   DB_USERNAME=sucrose_user
   DB_PASSWORD=password
   ```

   Then run the migrations:
   ```bash
   php artisan migrate
   ```

6. **Seed the Database (Optional):**
   To create an initial admin user:
   ```bash
   php artisan db:seed --class=AdminSeeder
   ```
   *Default Admin Credentials:*
   - **Email:** `admin@sucrose.com`
   - **Password:** `password`

## Running the Application

You can use the built-in setup script to run everything:

```bash
composer run dev
```

This will concurrently start:
- PHP Artisan Server (`php artisan serve`)
- Vite Development Server (`npm run dev`)
- Queue Listener (`php artisan queue:listen`)
- Laravel Pail (`php artisan pail`)

### API-First Architecture
The application uses a strict separation between the frontend and backend:
- **Frontend:** A React 19 application served via `routes/web.php` using a catch-all route.
- **Backend:** A RESTful API defined in `routes/api.php`, protected by Laravel Sanctum and role-based middleware.

### Primary API Endpoints

#### Authentication
- `POST /api/login`: Authenticate and receive a Bearer token.
- `POST /api/logout`: Revoke the current access token.
- `GET /api/me`: Get details of the authenticated user.

#### IT Admin (`IT_ADMIN`)
- `GET /api/users`: List all system users.
- `POST /api/users`: Create a new user.
- `PATCH /api/users/{id}/deactivate`: Deactivate a user account.

#### Monitoring Admin (`MONITORING_ADMIN`)
- `GET /api/cities`: List cities.
- `POST /api/markets`: Register a new market.
- `GET /api/brands`: Monitor sugar brands.
- `POST /api/assignments`: Assign officers to cities.

### Key Architectural Decisions
- **UUIDs:** All models use UUIDs as primary keys instead of auto-incrementing integers.
- **Unified API:** All data-related routes are consolidated in `api.php` to ensure consistent middleware application and JSON responses.
- **React Routing:** Client-side routing is handled by React, with Laravel's `web.php` providing a fallback to the main entry point.

