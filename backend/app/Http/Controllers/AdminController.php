<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\User;

class AdminController extends Controller
{
    // List all posts and return as JSON
    public function listPosts()
    {
        $posts = Post::all();
        return response()->json([
            'success' => true,
            'posts' => $posts,
        ]);
    }

    // Delete a specific post by ID and return success message
    public function deletePost($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Post deleted successfully.'
        ]);
    }

    // List all users and return as JSON
    public function listUsers()
    {
        $users = User::all();
        return response()->json([
            'success' => true,
            'users' => $users,
        ]);
    }

    // Delete a specific user by ID and return success message
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.'
        ]);
    }
}
