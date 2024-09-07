<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'author_name', 'title', 'description', 'moderation_status', 'sport', 'file_path', 'elevation', 'distance', 'time'];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Relationship with ratings
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    // Relationship with media
    public function media()
    {
        return $this->hasMany(Media::class);
    }
}
