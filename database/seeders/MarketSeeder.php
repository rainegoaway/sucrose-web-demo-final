<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Market;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MarketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $marketData = [
            [
                'city_name' => 'Manila',
                'markets' => [
                    ['name' => 'Divisoria Market', 'address' => 'Divisoria, Manila', 'lat' => 14.5963775, 'lon' => 120.9825899, 'type' => 'WET_MARKET'],
                    ['name' => 'Quinta Market', 'address' => 'Quinta, Manila', 'lat' => 14.5983775, 'lon' => 120.9845899, 'type' => 'WET_MARKET'],
                ]
            ],
            [
                'city_name' => 'Quezon City',
                'markets' => [
                    ['name' => 'Balintawak Market', 'address' => 'Balintawak, QC', 'lat' => 14.6954074, 'lon' => 121.0869890, 'type' => 'WET_MARKET'],
                    ['name' => 'Kamuning Market', 'address' => 'Kamuning, QC', 'lat' => 14.7034074, 'lon' => 121.0949890, 'type' => 'WET_MARKET'],
                ]
            ],
            [
                'city_name' => 'Caloocan',
                'markets' => [
                    ['name' => 'Caloocan Market', 'address' => 'Caloocan City', 'lat' => 14.7806974, 'lon' => 121.0429118, 'type' => 'WET_MARKET'],
                ]
            ],
            [
                'city_name' => 'Mandaluyong',
                'markets' => [
                    ['name' => 'Mandaluyong Market', 'address' => 'Mandaluyong City', 'lat' => 14.5917367, 'lon' => 121.0251398, 'type' => 'DRY_MARKET'],
                    ['name' => 'Bagumbayan Market', 'address' => 'Bagumbayan, Mandaluyong', 'lat' => 14.5937367, 'lon' => 121.0271398, 'type' => 'WET_MARKET'],
                ]
            ],
            [
                'city_name' => 'Marikina',
                'markets' => [
                    ['name' => 'Marikina Market', 'address' => 'Marikina City', 'lat' => 14.6330044, 'lon' => 121.0962135, 'type' => 'WET_MARKET'],
                ]
            ],
            [
                'city_name' => 'Navotas',
                'markets' => [
                    ['name' => 'Navotas Market', 'address' => 'Navotas City', 'lat' => 14.6430344, 'lon' => 120.9511054, 'type' => 'WET_MARKET'],
                ]
            ],
            [
                'city_name' => 'San Juan',
                'markets' => [
                    ['name' => 'San Juan Market', 'address' => 'San Juan, Manila', 'lat' => 14.6051350, 'lon' => 121.0232518, 'type' => 'DRY_MARKET'],
                ]
            ],
            [
                'city_name' => 'Muntinlupa',
                'markets' => [
                    ['name' => 'Muntinlupa Market', 'address' => 'Muntinlupa City', 'lat' => 14.4192750, 'lon' => 121.0445309, 'type' => 'WET_MARKET'],
                ]
            ],
            [
                'city_name' => 'Parañaque',
                'markets' => [
                    ['name' => 'Parañaque Market', 'address' => 'Parañaque City', 'lat' => 14.5275751, 'lon' => 120.9971696, 'type' => 'WET_MARKET'],
                ]
            ],
            [
                'city_name' => 'Pasay',
                'markets' => [
                    ['name' => 'Pasay Market', 'address' => 'Pasay City', 'lat' => 14.5501004, 'lon' => 120.9961085, 'type' => 'DRY_MARKET'],
                ]
            ],
            [
                'city_name' => 'Pasig',
                'markets' => [
                    ['name' => 'Pasig Market', 'address' => 'Pasig City', 'lat' => 14.5581364, 'lon' => 121.0849500, 'type' => 'WET_MARKET'],
                ]
            ],
            [
                'city_name' => 'Pateros',
                'markets' => [
                    ['name' => 'Pateros Market', 'address' => 'Pateros, Metro Manila', 'lat' => 14.5454213, 'lon' => 121.0660730, 'type' => 'WET_MARKET'],
                ]
            ],
            [
                'city_name' => 'Valenzuela',
                'markets' => [
                    ['name' => 'Valenzuela Market', 'address' => 'Valenzuela City', 'lat' => 14.7080912, 'lon' => 120.9942638, 'type' => 'WET_MARKET'],
                ]
            ],
            [
                'city_name' => 'Makati',
                'markets' => [
                    ['name' => 'Makati Market', 'address' => 'Makati City', 'lat' => 14.5652149, 'lon' => 121.0335849, 'type' => 'DRY_MARKET'],
                ]
            ],
            [
                'city_name' => 'Las Piñas',
                'markets' => [
                    ['name' => 'Las Piñas Market', 'address' => 'Las Piñas City', 'lat' => 14.4365193, 'lon' => 121.0058441, 'type' => 'WET_MARKET'],
                ]
            ],
            [
                'city_name' => 'Malabon',
                'markets' => [
                    ['name' => 'Malabon Market', 'address' => 'Malabon City', 'lat' => 14.6564487, 'lon' => 120.9506780, 'type' => 'WET_MARKET'],
                ]
            ],
        ];

        foreach ($marketData as $cityData) {
            $city = City::where('city_name', $cityData['city_name'])->first();
            
            if (!$city) {
                continue;
            }

            foreach ($cityData['markets'] as $market) {
                $existing = Market::where('market_name', $market['name'])
                    ->where('city_id', $city->city_id)
                    ->first();

                if ($existing) {
                    continue;
                }

                Market::create([
                    'market_id' => (string) Str::uuid(),
                    'city_id' => $city->city_id,
                    'market_name' => $market['name'],
                    'address' => $market['address'],
                    'latitude' => $market['lat'],
                    'longitude' => $market['lon'],
                    'market_type' => $market['type'],
                    'is_active' => true,
                    'is_prepopulated' => true,
                ]);
            }
        }
    }
}
