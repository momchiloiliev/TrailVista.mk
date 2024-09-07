<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('posts')->onDelete('cascade'); // Linking to posts
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Optional user
            $table->string('author_name')->nullable(); // If user is not logged in
            $table->text('content'); // Comment content
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.s
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
