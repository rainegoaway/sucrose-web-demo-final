# Project Status: Sucrose Web App

## 1. Project Overview
A Laravel-based web application for monitoring sugar prices and assignments across various cities and markets.

- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: Inertia.js (React 19 + Tailwind CSS 4 + Vite)
- **Database**: SQLite (Development) / PostgreSQL/MySQL (Production ready via migrations)
- **Auth**: Laravel Sanctum (API) / Session-based (Inertia/Web)

## 2. Database Schema (Migrations)

### `users`
- `user_id` (UUID, Primary Key)
- `first_name` (String)
- `last_name` (String)
- `email` (String, Unique)
- `password` (String)
- `role` (Enum: IT_ADMIN, MONITORING_ADMIN, MONITORING_OFFICER, CONSOLIDATION_OFFICER)
- `is_active` (Boolean, Default: true)
- `timestamps`

### `cities`
- `city_id` (UUID, Primary Key)
- `city_name` (String)
- `is_active` (Boolean, Default: true)
- `timestamps`

### `markets`
- `market_id` (UUID, Primary Key)
- `city_id` (UUID, Foreign Key -> cities.city_id)
- `market_name` (String)
- `address` (String)
- `latitude` (Decimal 10,7)
- `longitude` (Decimal 10,7)
- `market_type` (Enum: WET_MARKET, DRY_MARKET)
- `monitoring_status` (Enum: UNMONITORED, PENDING, MONITORED, URGENT)
- `is_active` (Boolean, Default: true)
- `timestamps`

### `sugar_brands`
- `brand_id` (UUID, Primary Key)
- `market_id` (UUID, Foreign Key -> markets.market_id)
- `brand_name` (String)
- `sugar_type` (Enum: RAW, WASHED, REFINED)
- `is_active` (Boolean, Default: true)
- `timestamps`

### `officer_assignments`
- `assignment_id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> users.user_id)
- `city_id` (UUID, Foreign Key -> cities.city_id)
- `assigned_date` (Date)
- `expiry_date` (Date, Nullable)
- `assignment_status` (Enum: ACTIVE, INACTIVE)
- `timestamps`

## 3. Models & Relationships

- **User**: `hasMany(OfficerAssignment)`
- **City**: `hasMany(Market)`, `hasMany(OfficerAssignment)`
- **Market**: `belongsTo(City)`, `hasMany(SugarBrand)`
- **SugarBrand**: `belongsTo(Market)`
- **OfficerAssignment**: `belongsTo(User)`, `belongsTo(City)`

*Note: All models use UUIDs and have boot logic to auto-generate UUIDs on creation.*

## 4. API Endpoints (`routes/api.php`)

### Public
- `POST /api/login`: Authenticate user and return token.

### Protected (Auth Sanctum)
- `POST /api/logout`: Revoke current token.
- `GET /api/me`: Get current authenticated user details.

### IT Admin Only (`role:IT_ADMIN`)
- `GET /api/users`: List all users.
- `POST /api/users`: Create new user.
- `GET /api/users/{id}`: Get user details.
- `PATCH /api/users/{id}`: Update user.
- `PATCH /api/users/{id}/deactivate`: Deactivate user.

### Monitoring Admin Only (`role:MONITORING_ADMIN`)
- **Cities**: `GET /api/cities`, `POST /api/cities`, `GET /api/cities/{id}`, `PATCH /api/cities/{id}`, `DELETE /api/cities/{id}`
- **Markets**: `GET /api/markets`, `POST /api/markets`, `GET /api/markets/{id}`, `PATCH /api/markets/{id}`, `DELETE /api/markets/{id}`
- **Sugar Brands**: `GET /api/brands`, `POST /api/brands`, `GET /api/brands/{id}`, `PATCH /api/brands/{id}`, `DELETE /api/brands/{id}`
- **Officer Assignments**: `GET /api/assignments`, `POST /api/assignments`, `DELETE /api/assignments/{id}`

## 5. Frontend State
- **Inertia.js** setup is complete.
- **Root Template**: `resources/views/app.blade.php`
- **Pages Directory**: `resources/js/Pages/`
- **Main Entry**: `resources/js/app.jsx` uses `createInertiaApp`.
- **Styling**: Tailwind CSS 4 is configured.

## 7. Development & Testing
### Test Credentials (via AdminSeeder)
- **Email**: `admin@sucrose.com`
- **Password**: `password`
- **Role**: `IT_ADMIN`

## 8. Inertia Migration Progress
- [x] Server-side setup (Middleware, Root template)
- [x] Client-side setup (React, Vite)
- [x] Authentication (Login/Logout via Inertia)
- [x] Protected Routes (Dashboard)
- [x] Resource Pages (Cities Index)
- [ ] Remaining Controllers (User, Market, etc.)

