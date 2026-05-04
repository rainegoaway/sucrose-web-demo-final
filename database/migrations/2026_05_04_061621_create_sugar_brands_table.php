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
        Schema::create('sugar_brands', function (Blueprint $table) 
        {
            $table->uuid('brand_id')->primary();
            $table->string('brand_name');
            $table->enum('sugar_type', ['RAW','WASHED','REFINED']);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sugar_brands');
    }
};
