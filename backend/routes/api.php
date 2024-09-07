<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Resources\UserResource;
use App\Http\Controllers\FileController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\MediaController;


// Public routes
Route::get('/status', function () {
    return response()->json(['status' => 'API is working!'], 200);
});

Route::get('/posts', [PostController::class, 'index']);   // View all posts
Route::get('/posts/{id}', [PostController::class, 'show']); // View a specific post
// Route::post('/posts', [PostController::class, 'store']);
Route::get('/posts/{postId}/comments', [CommentController::class, 'index']);
Route::get('/posts/{postId}/ratings', [RatingController::class, 'index']);
Route::get('/posts/{postId}/media', [MediaController::class, 'index']);


Route::get('/storage/gpx-files/{filename}', [FileController::class, 'getGpxFile']);


// Protected routes (Require authentication)
Route::middleware('auth:sanctum')
    ->group(function () {

        //GET USER DATA
        Route::get('/user', function (Request $request) {
            return new UserResource($request->user());
        });

        //POSTS
        Route::post('/posts', [PostController::class, 'store']);  // Add a new post
        Route::put('/posts/{id}', [PostController::class, 'update']);  // Edit a post
        Route::delete('/posts/{id}', [PostController::class, 'destroy']);  // Delete a post

        Route::post('/posts/{postId}/comments', [CommentController::class, 'store']);
        Route::post('/posts/{postId}/ratings', [RatingController::class, 'store']);
        Route::post('/posts/{postId}/media', [MediaController::class, 'store']);

        Route::put('/posts/{id}', [PostController::class, 'update']);
        Route::delete('/posts/{id}', [PostController::class, 'destroy']);


    });