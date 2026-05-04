<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CityController extends Controller
{
    public function index(Request $request)
    {
        $cities = City::all();

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($cities);
        }

        return Inertia::render('Cities/Index', [
            'cities' => $cities
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'city_name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $city = City::create($validated);

        return response()->json($city, 201);
    }

    public function show($id)
    {
        $city = City::findOrFail($id);
        return response()->json($city);
    }

    public function update(Request $request, $id)
    {
        $city = City::findOrFail($id);

        $validated = $request->validate([
            'city_name' => 'string|max:255',
            'is_active' => 'boolean',
        ]);

        $city->update($validated);

        return response()->json($city);
    }

    public function destroy($id)
    {
        $city = City::findOrFail($id);
        $city->delete();

        return response()->json(['message' => 'City deleted successfully']);
    }
}
