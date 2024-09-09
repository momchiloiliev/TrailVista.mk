<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use App\Models\Favorite;
class Favorite extends Model
{
    // Other relationships and attributes...

    // Define the inverse relationship with posts
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}