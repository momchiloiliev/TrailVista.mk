<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\CommentResource;
use App\Http\Resources\RatingResource;
use App\Http\Resources\MediaResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'file_path' => $this->file_path,
            'moderation_status' => $this->moderation_status,
            'sport' => $this->sport,
            'elevation' => $this->elevation,
            'distance' => $this->distance,
            'time' => $this->time,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'ratings' => RatingResource::collection($this->whenLoaded('ratings')),
            'media' => MediaResource::collection($this->whenLoaded('media')),
        ];
    }
}
