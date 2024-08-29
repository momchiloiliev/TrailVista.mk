<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\PostResource;

class PostController extends Controller
{
    // List all posts
    public function index()
    {
        $posts = Post::with('user')->get();
        return PostResource::collection($posts);
    }

    // Show details of a specific post
    public function show($id)
    {
        $post = Post::with('user')->findOrFail($id);
        return new PostResource($post);
    }

    // Store a new post
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:xml,gpx',
            'sport' => 'required|in:biking,running,hiking',
        ]);

        $path = $request->file('file')->store('gpx_files');

        $post = Post::create([
            'name' => $request->name,
            'description' => $request->description,
            'file_path' => $path,
            'sport' => $request->sport,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($post, 201);
    }

    public function update(Request $request, $id)
{
    $post = Post::findOrFail($id);

    // Check if the authenticated user is the owner of the post
    if ($request->user()->id !== $post->user_id) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'sport' => 'required|in:biking,running,hiking',
    ]);

    $post->update($request->only(['name', 'description', 'sport']));

    return response()->json($post);
}

public function destroy(Request $request, $id)
{
    $post = Post::findOrFail($id);

    // Check if the authenticated user is the owner of the post
    if ($request->user()->id !== $post->user_id) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $post->delete();

    return response()->json(['message' => 'Post deleted successfully']);
}
}