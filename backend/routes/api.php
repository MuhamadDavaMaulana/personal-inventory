<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\LoanController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',           [AuthController::class, 'logout']);
    Route::get('/user',              [AuthController::class, 'me']);

    // ✅ Profile & password
    Route::put('/profile',           [AuthController::class, 'updateProfile']);
    Route::put('/profile/password',  [AuthController::class, 'changePassword']);

    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('items',      ItemController::class);
    Route::apiResource('loans',      LoanController::class);
});