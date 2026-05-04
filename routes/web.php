<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\MarketController;
use App\Http\Controllers\SugarBrandController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login')->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/map', function () {
        return Inertia::render('Map');
    })->name('map');

    Route::get('/reports/bantay-presyo', function () {
        return Inertia::render('Reports/BantayPresyo');
    })->name('reports.bantay');

    Route::get('/reports/weekly', function () {
        return Inertia::render('Reports/WeeklyReports');
    })->name('reports.weekly');

    Route::get('/reports/forms', function () {
        return Inertia::render('Reports/MonitoringForms');
    })->name('reports.forms');

    Route::get('/profile', function () {
        return Inertia::render('Profile');
    })->name('profile');

    // Example of a resource route for Inertia
    Route::get('/cities', [CityController::class, 'index'])->name('cities.index');

    Route::get('/markets', [MarketController::class, 'index'])->name('markets.index');
    Route::post('/markets', [MarketController::class, 'store'])->name('markets.store');
    Route::patch('/markets/{id}', [MarketController::class, 'update'])->name('markets.update');
    Route::delete('/markets/{id}', [MarketController::class, 'destroy'])->name('markets.destroy');

    Route::get('/brands', [SugarBrandController::class, 'index'])->name('brands.index');
    Route::post('/brands', [SugarBrandController::class, 'store'])->name('brands.store');
    Route::patch('/brands/{id}', [SugarBrandController::class, 'update'])->name('brands.update');
    Route::delete('/brands/{id}', [SugarBrandController::class, 'destroy'])->name('brands.destroy');

    Route::get('/personnel', [UserController::class, 'index'])->name('personnel.index');
    Route::post('/personnel', [UserController::class, 'store'])->name('personnel.store');
    Route::patch('/personnel/{id}', [UserController::class, 'update'])->name('personnel.update');
    Route::patch('/personnel/{id}/deactivate', [UserController::class, 'deactivate'])->name('personnel.deactivate');

    Route::get('/anomaly', function () {
        return Inertia::render('Anomaly/Index');
    })->name('anomaly.index');
});
