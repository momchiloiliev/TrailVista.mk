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
}
