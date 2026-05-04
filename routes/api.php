<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\MarketController;
use App\Http\Controllers\SugarBrandController;
use App\Http\Controllers\OfficerAssignmentController;
use Illuminate\Support\Facades\Route;

// Public Auth
Route::post('/login', [AuthController::class, 'apiLogin']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // IT Admin Only
    Route::middleware('role:IT_ADMIN')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::patch('/users/{id}', [UserController::class, 'update']);
        Route::patch('/users/{id}/deactivate', [UserController::class, 'deactivate']);
        Route::post('/users/{id}/reset-password', [UserController::class, 'resetPassword']);
        Route::get('/users/{id}/monitoring-records', [UserController::class, 'hasMonitoringRecords']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });

    // Monitoring Admin Only
    Route::middleware('role:MONITORING_ADMIN')->group(function () {
        // Cities
        Route::get('/cities', [CityController::class, 'index']);
        Route::post('/cities', [CityController::class, 'store']);
        Route::get('/cities/{id}', [CityController::class, 'show']);
        Route::patch('/cities/{id}', [CityController::class, 'update']);
        Route::delete('/cities/{id}', [CityController::class, 'destroy']);

        // Markets
        Route::get('/markets', [MarketController::class, 'index']);
        Route::post('/markets', [MarketController::class, 'store']);
        Route::get('/markets/{id}', [MarketController::class, 'show']);
        Route::patch('/markets/{id}', [MarketController::class, 'update']);
        Route::delete('/markets/{id}', [MarketController::class, 'destroy']);

        // Sugar Brands
        Route::get('/brands', [SugarBrandController::class, 'index']);
        Route::post('/brands', [SugarBrandController::class, 'store']);
        Route::get('/brands/{id}', [SugarBrandController::class, 'show']);
        Route::patch('/brands/{id}', [SugarBrandController::class, 'update']);
        Route::delete('/brands/{id}', [SugarBrandController::class, 'destroy']);

        // Officer Assignments
        Route::get('/assignments', [OfficerAssignmentController::class, 'index']);
        Route::post('/assignments', [OfficerAssignmentController::class, 'store']);
        Route::delete('/assignments/{id}', [OfficerAssignmentController::class, 'destroy']);
    });
});
