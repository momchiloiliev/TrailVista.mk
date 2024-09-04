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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // The user who created the post (nullable for anonymous)
            $table->string('author_name')->default('Anonymous'); // Will store the author name for guests
            $table->string('title');
            $table->string('description')->nullable();  // Optional description field
            $table->string('file_path');  // Path to the GPX file
            $table->enum('moderation_status', ['easy', 'medium', 'hard', 'extreme'])->default('medium');
            $table->enum('sport', ['cycling', 'running', 'hiking', 'mountain-biking']);
            // $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
