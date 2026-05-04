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
        Schema::create('markets', function (Blueprint $table) 
        {
            $table->uuid('market_id')->primary();
            $table->uuid('city_id');
            $table->string('market_name');
            $table->string('address');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->enum('market_type', ['WET_MARKET', 'DRY_MARKET']);
            $table->enum('monitoring_status', ['UNMONITORED','PENDING','MONITORED','URGENT'])->default('UNMONITORED');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('city_id')->references('city_id')->on('cities')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('markets');
    }
};
