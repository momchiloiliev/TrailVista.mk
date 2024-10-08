<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use App\Models\Favorite;
// use App\Models\User;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'author_name', 'title', 'description', 'moderation_status', 'sport', 'file_path', 'elevation', 'distance', 'time'];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function media()
    {
        return $this->hasMany(Media::class);
    }


    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}