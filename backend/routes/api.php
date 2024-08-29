<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
// Public routes
Route::get('/status', function () {
    return response()->json(['status' => 'API is working!'], 200);
});

Route::get('/posts', [PostController::class, 'index']);   // View all posts
Route::get('/posts/{id}', [PostController::class, 'show']); // View a specific post


// Protected routes (Require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/posts', [PostController::class, 'store']);  // Add a new post
    Route::put('/posts/{id}', [PostController::class, 'update']);  // Edit a post
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);  // Delete a post


    // Example route to fetch user-specific data
    Route::get('/user/data', 'UserController@getUserData');
});
