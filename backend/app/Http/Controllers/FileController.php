<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class FileController extends Controller
{
    public function getGpxFile($filename, $title)
{
    $path = 'gpx_files/' . $filename;

    // Ensure the file exists
    if (!Storage::disk('public')->exists($path)) {
        return response()->json(['error' => 'File not found'], 404);
    }

    // Replace spaces in the title with underscores and add the .gpx extension
    $sanitizedTitle = preg_replace('/\s+/', '_', $title);  // Replaces spaces with underscores
    $gpxFilename = $sanitizedTitle . '.gpx';  // Use the trail title as the file name

    return Storage::disk('public')->download($path, $gpxFilename, [
        'Content-Type' => 'application/gpx+xml',
    ]);
}


}
