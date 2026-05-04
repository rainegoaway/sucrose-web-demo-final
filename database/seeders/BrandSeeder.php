<?php

namespace Database\Seeders;

use App\Models\SugarBrand;
use App\Models\BrandSugarType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = [
            [
                'name' => 'San Carlos',
                'types' => ['RAW', 'WASHED'],
            ],
            [
                'name' => 'Biñan Premium',
                'types' => ['REFINED'],
            ],
            [
                'name' => 'Palayan Valley',
                'types' => ['RAW', 'REFINED', 'WASHED'],
            ],
            [
                'name' => 'Mindanao Gold',
                'types' => ['RAW', 'WASHED'],
            ],
            [
                'name' => 'Negros Select',
                'types' => ['REFINED'],
            ],
            [
                'name' => 'Visayan Premium',
                'types' => ['RAW', 'REFINED'],
            ],
            [
                'name' => 'Ilocos Sugar',
                'types' => ['WASHED'],
            ],
            [
                'name' => 'Isabela Pure',
                'types' => ['RAW', 'WASHED', 'REFINED'],
            ],
            [
                'name' => 'Laguna Fresh',
                'types' => ['REFINED'],
            ],
            [
                'name' => 'Nueva Ecija Gold',
                'types' => ['RAW', 'REFINED'],
            ],
        ];

        foreach ($brands as $brandData) {
            $existing = SugarBrand::where('brand_name', $brandData['name'])->first();

            if ($existing) {
                continue;
            }

            $brand = SugarBrand::create([
                'brand_id' => (string) Str::uuid(),
                'brand_name' => $brandData['name'],
                'is_active' => true,
            ]);

            foreach ($brandData['types'] as $type) {
                BrandSugarType::create([
                    'brand_id' => $brand->brand_id,
                    'sugar_type' => $type,
                ]);
            }
        }
    }
}
