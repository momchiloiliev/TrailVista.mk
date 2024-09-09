<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function addToFavorites($postId)
    {
        $user = Auth::user();
        $post = Post::findOrFail($postId);

        // Check if already favorited
        if (!$user->favorites->contains($post)) {
            $user->favorites()->attach($postId);
            return response()->json(['message' => 'Added to favorites'], 200);
        }

        return response()->json(['message' => 'Already in favorites'], 400);
    }

    public function removeFromFavorites($postId)
    {
        $user = Auth::user();
        $post = Post::findOrFail($postId);

        // Check if it is in favorites
        if ($user->favorites->contains($post)) {
            $user->favorites()->detach($postId);
            return response()->json(['message' => 'Removed from favorites'], 200);
        }

        return response()->json(['message' => 'Not in favorites'], 400);
    }

    public function getFavorites()
    {
        $user = Auth::user();
        $favorites = $user->favorites()->with('user')->get();

        return response()->json($favorites, 200);
    }

    public function mostFavoritedRoutes()
    {
        // Query to get most favorited routes
        $mostFavoritedRoutes = Post::withCount('favorites')
            ->orderBy('favorites_count', 'desc') // Order by most favorites
            ->take(5) // Limit to top 10 or any number you need
            ->get();

        return response()->json($mostFavoritedRoutes);
    }
}
