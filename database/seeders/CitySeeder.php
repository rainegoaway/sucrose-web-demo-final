<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            'Manila',
            'Quezon City',
            'Caloocan',
            'Las Piñas',
            'Makati',
            'Malabon',
            'Mandaluyong',
            'Marikina',
            'Muntinlupa',
            'Navotas',
            'Parañaque',
            'Pasay',
            'Pasig',
            'San Juan',
            'Taguig',
            'Valenzuela',
            'Pateros',
        ];

        foreach ($cities as $name) {
            $existing = City::query()->where('city_name', $name)->first();

            if ($existing) {
                $existing->update(['is_active' => true]);
                continue;
            }

            City::create([
                'city_id' => (string) Str::uuid(),
                'city_name' => $name,
                'is_active' => true,
            ]);
        }
    }
}
