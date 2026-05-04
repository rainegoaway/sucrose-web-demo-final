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
        Schema::create('brand_sugar_types', function (Blueprint $table) {
            $table->id();
            $table->uuid('brand_id');
            $table->enum('sugar_type', ['RAW', 'WASHED', 'REFINED']);
            $table->timestamps();

            $table->foreign('brand_id')->references('brand_id')->on('sugar_brands')->cascadeOnDelete();
            $table->unique(['brand_id', 'sugar_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brand_sugar_types');
    }
};
