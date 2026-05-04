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
        Schema::create('market_sugar_brand', function (Blueprint $table) {
            $table->uuid('market_id');
            $table->uuid('brand_id');
            $table->timestamps();

            $table->primary(['market_id', 'brand_id']);

            $table
                ->foreign('market_id')
                ->references('market_id')
                ->on('markets')
                ->cascadeOnDelete();

            $table
                ->foreign('brand_id')
                ->references('brand_id')
                ->on('sugar_brands')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('market_sugar_brand');
    }
};
