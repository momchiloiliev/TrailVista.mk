<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating;

class RatingController extends Controller
{
    public function store(Request $request, $postId)
    {
        $request->validate([
            'rating' => 'required|integer|between(1,5)',
        ]);

        $rating = Rating::create([
            'post_id' => $postId,
            'user_id' => auth()->id(),
            'rating' => $request->input('rating'),
        ]);

        return response()->json($rating, 201);
    }
}