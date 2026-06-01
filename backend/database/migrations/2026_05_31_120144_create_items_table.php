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
        Schema::create('items', function (Blueprint $table) {
            $table->id('item_id');
            $table->foreignId('user_id')->constrained('users_account', 'user_id')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories', 'category_id')->cascadeOnDelete();
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->integer('quantity')->default(1);
            $table->enum('condition', ['good', 'damaged', 'lost']);
            $table->enum('status', ['available', 'borrowed'])->default('available');
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
