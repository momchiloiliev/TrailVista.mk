<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Media;

class MediaController extends Controller
{
    // Store media (already implemented)
    public function store(Request $request, $postId)
    {
        $request->validate([
            'media_file' => 'required|file|mimes:jpg,jpeg,png,mp4',
        ]);

        $path = $request->file('media_file')->store('media', 'public');

        $media = Media::create([
            'post_id' => $postId,
            'file_path' => $path,
            'type' => $request->file('media_file')->getClientMimeType(),
        ]);

        return response()->json($media, 201);
    }

    // Fetch media for a specific post
    public function index($postId)
    {
        $media = Media::where('post_id', $postId)->get();
        
        if ($media->isEmpty()) {
            return response()->json(['message' => 'No media found for this post'], 404);
        }

        return response()->json($media, 200);
    }
}
