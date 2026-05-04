<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Market;
use App\Models\SugarBrand;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MarketController extends Controller
{
    public function index(Request $request)
    {
        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json(Market::all());
        }

        $markets = Market::query()
            ->with('city')
            ->with(['brands' => function ($q) {
                $q->orderBy('brand_name')->select('sugar_brands.brand_id', 'brand_name');
            }])
            ->withCount('brands')
            ->orderBy('market_name')
            ->get();

        $cities = City::query()
            ->where('is_active', true)
            ->orderBy('city_name')
            ->get(['city_id', 'city_name']);

        $brands = SugarBrand::query()
            ->where('is_active', true)
            ->orderBy('brand_name')
            ->with('sugarTypeRecords')
            ->get()
            ->map(function ($brand) {
                $brand->sugar_types = $brand->sugarTypeRecords->pluck('sugar_type')->toArray();
                return $brand;
            });

        return Inertia::render('Markets/Index', [
            'markets' => $markets,
            'cities' => $cities,
            'brands' => $brands,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'city_id' => 'required|exists:cities,city_id',
            'market_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'market_type' => ['required', Rule::in(['WET_MARKET', 'DRY_MARKET'])],
            'is_active' => 'boolean',
            'brand_ids' => 'array',
            'brand_ids.*' => 'uuid|exists:sugar_brands,brand_id',
        ]);

        $brandIds = $validated['brand_ids'] ?? [];
        unset($validated['brand_ids']);

        $market = Market::create($validated);

        if (!empty($brandIds)) {
            $market->brands()->sync($brandIds);
        }

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($market, 201);
        }

        return redirect()->route('markets.index')->with('flash', [
            'message' => 'Market created successfully',
            'type' => 'success',
        ]);
    }

    public function show($id)
    {
        $market = Market::findOrFail($id);
        return response()->json($market);
    }

    public function update(Request $request, $id)
    {
        $market = Market::findOrFail($id);

        $validated = $request->validate([
            'city_id' => 'exists:cities,city_id',
            'market_name' => 'string|max:255',
            'address' => 'string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'market_type' => [Rule::in(['WET_MARKET', 'DRY_MARKET'])],
            'monitoring_status' => [Rule::in(['UNMONITORED', 'PENDING', 'MONITORED', 'URGENT'])],
            'is_active' => 'boolean',
            'brand_ids' => 'array',
            'brand_ids.*' => 'uuid|exists:sugar_brands,brand_id',
        ]);

        $brandIds = $validated['brand_ids'] ?? null;
        unset($validated['brand_ids']);

        $market->update($validated);

        if (is_array($brandIds)) {
            $market->brands()->sync($brandIds);
        }

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($market);
        }

        return redirect()->route('markets.index')->with('flash', [
            'message' => 'Market updated successfully',
            'type' => 'success',
        ]);
    }

    public function destroy($id)
    {
        $market = Market::findOrFail($id);

        // If linked to monitoring records (brands) or this is a prepopulated market,
        // do not hard-delete: mark as inactive instead and inform the user.
        if ($market->brands()->exists() || ($market->is_prepopulated ?? false)) {
            $market->update(['is_active' => false]);

            if (request()->wantsJson() && !request()->header('X-Inertia')) {
                return response()->json([
                    'message' => 'Market is linked to monitoring records (or is prepopulated) and has been set to inactive'
                ]);
            }

            return redirect()->route('markets.index')->with('flash', [
                'message' => 'Market is linked to monitoring records (or is prepopulated) and has been set to Inactive',
                'type' => 'success',
            ]);
        }

        $market->delete();

        if (request()->wantsJson() && !request()->header('X-Inertia')) {
            return response()->json(['message' => 'Market deleted successfully']);
        }

        return redirect()->route('markets.index')->with('flash', [
            'message' => 'Market deleted successfully',
            'type' => 'success',
        ]);
    }
}
