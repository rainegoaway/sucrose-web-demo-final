<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\OfficerAssignment;
use App\Models\City;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PersonnelSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create MONITORING_ADMIN
        User::firstOrCreate(
            ['email' => 'monitoring.admin@sucrose.com'],
            [
                'user_id' => Str::uuid(),
                'first_name' => 'Monitoring',
                'last_name' => 'Admin',
                'password' => bcrypt('password'),
                'role' => 'MONITORING_ADMIN',
                'is_active' => true,
            ]
        );

        // Create MONITORING_OFFICERS with city assignments (3-4 officers)
        $cities = City::where('is_active', true)->limit(3)->get();
        $officerNames = [
            ['first' => 'Maria', 'last' => 'Santos'],
            ['first' => 'Juan', 'last' => 'Dela Cruz'],
            ['first' => 'Rosa', 'last' => 'Reyes'],
            ['first' => 'Carlos', 'last' => 'Fernandez'],
        ];

        foreach (array_slice($officerNames, 0, min(4, count($officerNames))) as $index => $name) {
            $officer = User::firstOrCreate(
                ['email' => 'officer' . ($index + 1) . '@sucrose.com'],
                [
                    'user_id' => Str::uuid(),
                    'first_name' => $name['first'],
                    'last_name' => $name['last'],
                    'password' => bcrypt('password'),
                    'role' => 'MONITORING_OFFICER',
                    'is_active' => true,
                ]
            );

            // Assign to city if within cities available
            if ($index < count($cities)) {
                OfficerAssignment::firstOrCreate(
                    [
                        'user_id' => $officer->user_id,
                        'city_id' => $cities[$index]->city_id,
                        'assignment_status' => 'ACTIVE',
                    ],
                    [
                        'assignment_id' => Str::uuid(),
                        'assigned_date' => now(),
                    ]
                );
            }
        }

        // Create CONSOLIDATION_OFFICERS (2 unassigned)
        for ($i = 1; $i <= 2; $i++) {
            User::firstOrCreate(
                ['email' => 'consolidation.officer' . $i . '@sucrose.com'],
                [
                    'user_id' => Str::uuid(),
                    'first_name' => 'Consolidation',
                    'last_name' => 'Officer ' . $i,
                    'password' => bcrypt('password'),
                    'role' => 'CONSOLIDATION_OFFICER',
                    'is_active' => true,
                ]
            );
        }

        // Create test user (if not already exists)
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'user_id' => Str::uuid(),
                'first_name' => 'Test',
                'last_name' => 'User',
                'password' => bcrypt('password'),
                'role' => 'MONITORING_ADMIN',
                'is_active' => true,
            ]
        );
    }
}
