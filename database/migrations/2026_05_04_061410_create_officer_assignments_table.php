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
        Schema::create('officer_assignments', function (Blueprint $table) {
            $table->uuid('assignment_id')->primary();
            $table->uuid('user_id');
            $table->uuid('city_id');
            $table->date('assigned_date');
            $table->date('expiry_date')->nullable();
            $table->enum('assignment_status', ['ACTIVE', 'INACTIVE']);
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->cascadeOnDelete();
            $table->foreign('city_id')->references('city_id')->on('cities')->cascadeOnDelete();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('officer_assignments');
    }
};
