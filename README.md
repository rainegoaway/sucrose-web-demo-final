# Sucrose Web App

Laravel + Inertia (React) application for monitoring sugar brands, markets, cities, and officer assignments.

## 1. Stack

- Backend: Laravel 13, PHP 8.3+
- Frontend: React 19, Inertia.js, Vite 8, Tailwind CSS 4
- Auth: Laravel Sanctum
- Database: PostgreSQL

## 2. Prerequisites

Install on every teammate PC/Mac:

1. Git
2. PHP 8.3+
3. Composer 2+
4. Node.js 20+ and npm
5. PostgreSQL 14+

Version check:

```bash
php -v
composer -V
node -v
npm -v
psql --version
```

## 3. Clone Repository

### Windows (PowerShell)

```powershell
git clone <your-repo-url>.git
cd sucrose-web-app
```

### macOS (Terminal)

```bash
git clone <your-repo-url>.git
cd sucrose-web-app
```

## 4. Install Project Dependencies

### Windows (PowerShell)

```powershell
composer install
npm install
```

### macOS (Terminal)

```bash
composer install
npm install
```

## 5. Create `.env` and App Key

### Windows (PowerShell)

```powershell
Copy-Item .env.example .env
php artisan key:generate
```

### macOS (Terminal)

```bash
cp .env.example .env
php artisan key:generate
```

## 6. Create PostgreSQL Database and User

Use the same SQL for both OS. Only the way to open `psql` differs.

### Windows (PowerShell)

If PostgreSQL bin is in PATH:

```powershell
psql -U postgres -h 127.0.0.1 -d postgres
```

If not in PATH, open **SQL Shell (psql)** from Start Menu and log in as `postgres`.

### macOS (Terminal)

```bash
psql -U postgres -h 127.0.0.1 -d postgres
```

Now run this SQL (Windows + macOS):

```sql
CREATE ROLE sucrose_user WITH LOGIN PASSWORD 'password';
CREATE DATABASE sucrose_db OWNER sucrose_user;
GRANT ALL PRIVILEGES ON DATABASE sucrose_db TO sucrose_user;
\q
```

## 7. Update `.env` for PostgreSQL

Set these values in `.env` (Windows + macOS):

```env
APP_NAME="Sucrose Web App"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sucrose_db
DB_USERNAME=sucrose_user
DB_PASSWORD=password
```

## 8. Run Migrations and Seeders (Fresh Setup)

### Windows (PowerShell)

```powershell
php artisan migrate:fresh --seed
```

### macOS (Terminal)

```bash
php artisan migrate:fresh --seed
```

This command creates all tables and runs:

- `CitySeeder`
- `AdminSeeder`
- User factory entry from `DatabaseSeeder`

## 9. Seeded Login Accounts

1. IT Admin  
   Email: `admin@sucrose.com`  
   Password: `password`
2. Monitoring Admin  
   Email: `test@example.com`  
   Password: `password`

## 10. Run the App

### Option A (Recommended, both OS): one command

```bash
composer run dev
```

Starts Laravel server, queue listener, pail logs, and Vite.

### Option B (both OS): separate terminals

Terminal 1:

```bash
php artisan serve
```

Terminal 2:

```bash
npm run dev
```

Open: `http://127.0.0.1:8000`

## 11. Team Reset Commands

Use these when schema/seed files change:

```bash
php artisan migrate:fresh --seed
php artisan optimize:clear
```

Always keep `.env` local and never commit it.
