<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Media;

class MediaController extends Controller
{
    public function store(Request $request, $postId)
    {
        $request->validate([
            'media_file' => 'required|file|mimes:jpg,jpeg,png,mp4', // Adjust allowed types as needed
        ]);

        $path = $request->file('media_file')->store('media', 'public');

        $media = Media::create([
            'post_id' => $postId,
            'file_path' => $path,
            'type' => $request->file('media_file')->getClientMimeType(),
        ]);

        return response()->json($media, 201);
    }
}