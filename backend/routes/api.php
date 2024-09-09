<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Resources\UserResource;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FavoriteController;


// Public routes
Route::get('/status', function () {
    return response()->json(['status' => 'API is working!'], 200);
});

Route::get('/posts', [PostController::class, 'index']);   // View all posts
Route::get('/posts/{id}', [PostController::class, 'show']); // View a specific post
// Route::post('/posts', [PostController::class, 'store']);

Route::get('/most-favorited-routes', [FavoriteController::class, 'mostFavoritedRoutes']);

Route::get('/storage/gpx-files/{filename}', [FileController::class, 'getGpxFile']);

// Protected routes (Require authentication)
Route::middleware('auth:sanctum')
    ->group(function () {
        Route::get('/user', function (Request $request) {
            return new UserResource($request->user());
        });



        Route::post('/posts', [PostController::class, 'store']);  // Add a new post
        Route::put('/posts/{id}', [PostController::class, 'update']);  // Edit a post
        Route::delete('/posts/{id}', [PostController::class, 'destroy']);  // Delete a post

        Route::post('/favorites/{postId}', [FavoriteController::class, 'addToFavorites']);
        Route::delete('/favorites/{postId}', [FavoriteController::class, 'removeFromFavorites']);
        Route::get('/favorites', [FavoriteController::class, 'getFavorites']);


        // Example route to fetch user-specific data
        Route::get('/user/data', function (Request $request) {
            return new UserResource($request->user());
        });
    });
