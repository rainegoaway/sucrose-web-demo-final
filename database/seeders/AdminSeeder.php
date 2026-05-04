<?php
namespace Database\Seeders;
use App\Models\User;
use Illuminate\Support\Str;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@sucrose.com'],
            [
                'user_id' => Str::uuid(),
                'first_name' => 'Admin',
                'last_name' => 'User',
                'password' => bcrypt('password'),
                'role' => 'IT_ADMIN',
            ]
        );
    }
}
