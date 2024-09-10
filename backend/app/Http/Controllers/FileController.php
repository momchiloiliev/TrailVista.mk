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

    if (!Storage::disk('public')->exists($path)) {
        return response()->json(['error' => 'File not found'], 404);
    }

    $sanitizedTitle = preg_replace('/\s+/', '_', $title);
    $gpxFilename = $sanitizedTitle . '.gpx';

    return Storage::disk('public')->download($path, $gpxFilename, [
        'Content-Type' => 'application/gpx+xml',
    ]);
}


}
