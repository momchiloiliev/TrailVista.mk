<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\PostResource;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Auth;


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
        Log::info('Creating a new post', ['request_data' => $request->all()]);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file_path' => 'required|file|mimes:xml,gpx',
            'sport' => 'required|in:biking,running,hiking',
            'moderation_status' => 'nullable|in:easy,medium,hard,extreme',
        ]);

        $path = $request->file('file_path')->store('gpx_files');

        if ($request->hasFile('file_path')) {
            $file = $request->file('file_path');
            Log::info('File uploaded:', ['file_name' => $file->getClientOriginalName(), 'file_size' => $file->getSize()]);
            $path = $file->store('gpx_files', 'public');
        } else {
            Log::error('File not provided');
            return response()->json(['error' => 'File not provided'], 400);
        }

        $post = Post::create([
            'user_id' => Auth::check() ? Auth::id() : null,
            'author_name' => Auth::check() ? Auth::user()->name : 'Anonymous',
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'moderation_status' => $request->input('moderation_status'),
            'sport' => $request->input('sport'),
            'file_path' => $path,
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
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'sport' => 'required|in:biking,running,hiking',
    ]);

    $post->update($request->only(['title', 'description', 'sport']));

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