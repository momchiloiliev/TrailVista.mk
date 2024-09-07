<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;


class FileController extends Controller
{
    public function getGpxFile($filename)
    {
        $path = 'gpx_files/' . $filename;

        // Ensure the file exists
        if (!Storage::disk('public')->exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $file = Storage::disk('public')->get($path);

        // Add the CORS headers and return the file
        return response($file, 200)
            ->header('Content-Type', 'application/gpx+xml') // Adjust content type if needed
            ->header('Access-Control-Allow-Origin', '*')   // Allow CORS for all origins
            ->header('Access-Control-Allow-Methods', 'GET');
    }
}