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
        $post = Post::with(['user', 'comments', 'ratings', 'media'])->findOrFail($id);
        return new PostResource($post);
    }

    // Store a new post with elevation, distance, and time
    public function store(Request $request)
    {
        Log::info('Creating a new post', ['request_data' => $request->all()]);

        // Validate input
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file_path' => 'required|file|mimes:xml,gpx|max:51200',
            'sport' => 'required|in:biking,running,hiking',
            'moderation_status' => 'nullable|in:easy,medium,hard,extreme',
            'distance' => 'required|numeric',  // Accept calculated distance
            'elevation' => 'required|numeric', // Accept calculated elevation
            'time' => 'required|string',       // Accept calculated time
        ]);

        // Store the GPX file
        if ($request->hasFile('file_path')) {
            $file = $request->file('file_path');
            Log::info('File uploaded:', ['file_name' => $file->getClientOriginalName(), 'file_size' => $file->getSize()]);
            $path = $file->store('gpx_files', 'public');
        } else {
            Log::error('File not provided');
            return response()->json(['error' => 'File not provided'], 400);
        }

        // Create a new post with the calculated elevation, distance, and time from the frontend
        $post = Post::create([
            'user_id' => Auth::check() ? Auth::id() : null,
            'author_name' => Auth::check() ? Auth::user()->name : 'Anonymous',
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'moderation_status' => $request->input('moderation_status'),
            'sport' => $request->input('sport'),
            'file_path' => $path,
            'elevation' => $request->input('elevation'),  // Elevation passed from the frontend
            'distance' => $request->input('distance'),    // Distance passed from the frontend
            'time' => $request->input('time'),            // Time passed from the frontend
        ]);

        return response()->json($post, 201);
    }

    // Update an existing post
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        // Check if the authenticated user is the owner of the post
        if ($request->user()->id !== $post->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Validate input
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sport' => 'required|in:biking,running,hiking',
        ]);

        // Update post
        $post->update($request->only(['title', 'description', 'sport']));

        return response()->json($post);
    }

    // Delete a post
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
