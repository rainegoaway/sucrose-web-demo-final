<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(CitySeeder::class);
        $this->call(AdminSeeder::class);
        $this->call(MarketSeeder::class);
        $this->call(BrandSeeder::class);
        $this->call(PersonnelSeeder::class);
    }
}
