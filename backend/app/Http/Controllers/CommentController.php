<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    public function store(Request $request, $postId)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $comment = Comment::create([
            'post_id' => $postId,
            'user_id' => auth()->id(),
            'author_name' => auth()->user()->name,
            'content' => $request->input('content'),
        ]);

        return response()->json($comment, 201);
    }
}
