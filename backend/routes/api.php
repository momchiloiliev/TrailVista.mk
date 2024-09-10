<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Resources\UserResource;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FavoriteController;

use App\Http\Controllers\CommentController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\MediaController;


// Public routes
Route::get('/status', function () {
    return response()->json(['status' => 'API is working!'], 200);
});
//POSTS
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);
// Route::post('/posts', [PostController::class, 'store']);

//POSTS COMENTS RATINGS MEDIA
Route::get('/posts/{postId}/comments', [CommentController::class, 'index']);
Route::get('/posts/{postId}/ratings', [RatingController::class, 'index']);
Route::get('/posts/{postId}/media', [MediaController::class, 'index']);

//MOST FAVORITED ROUTES
Route::get('/most-favorited-routes', [FavoriteController::class, 'mostFavoritedRoutes']);

//GPX FILES
Route::get('/storage/gpx-files/{filename}', [FileController::class, 'getGpxFile']);
Route::get('/download-gpx/{filename}/{title}', [FileController::class, 'getGpxFile']);


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

        //POSTS COMENTS RATINGS MEDIA
        Route::post('/posts/{postId}/comments', [CommentController::class, 'store']);
        Route::post('/posts/{postId}/ratings', [RatingController::class, 'store']);
        Route::post('/posts/{postId}/media', [MediaController::class, 'store']);

        //FAVORITES
        Route::post('/favorites/{postId}', [FavoriteController::class, 'addToFavorites']);
        Route::delete('/favorites/{postId}', [FavoriteController::class, 'removeFromFavorites']);
        Route::get('/favorites', [FavoriteController::class, 'getFavorites']);
    

    });