<?php

namespace App\Http\Controllers;

use App\Models\SugarBrand;
use App\Models\BrandSugarType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SugarBrandController extends Controller
{
    public function index(Request $request)
    {
        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json(SugarBrand::with('sugarTypeRecords')->get());
        }

        $brands = SugarBrand::query()
            ->with('sugarTypeRecords')
            ->withCount('markets')
            ->orderBy('brand_name')
            ->get()
            ->map(function ($brand) {
                $brand->sugar_types = $brand->sugarTypeRecords->pluck('sugar_type')->toArray();
                return $brand;
            });

        return Inertia::render('SugarBrands/Index', [
            'brands' => $brands,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand_name' => 'required|string|max:255',
            'sugar_type' => ['required', 'array', 'min:1', 'max:3'],
            'sugar_type.*' => ['required', Rule::in(['RAW', 'WASHED', 'REFINED'])],
            'is_active' => 'boolean',
        ]);

        $sugarTypes = $validated['sugar_type'];
        unset($validated['sugar_type']);

        if (!array_key_exists('is_active', $validated)) {
            $validated['is_active'] = true;
        }

        $brand = SugarBrand::create($validated);

        foreach ($sugarTypes as $type) {
            BrandSugarType::create([
                'brand_id' => $brand->brand_id,
                'sugar_type' => $type,
            ]);
        }

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($brand, 201);
        }

        return redirect()->route('brands.index')->with('flash', [
            'message' => 'Brand created successfully',
            'type' => 'success',
        ]);
    }

    public function show($id)
    {
        $brand = SugarBrand::with('sugarTypeRecords')->findOrFail($id);
        return response()->json($brand);
    }

    public function update(Request $request, $id)
    {
        $brand = SugarBrand::findOrFail($id);

        $validated = $request->validate([
            'brand_name' => 'string|max:255',
            'sugar_type' => ['array', 'min:1', 'max:3'],
            'sugar_type.*' => ['required_with:sugar_type', Rule::in(['RAW', 'WASHED', 'REFINED'])],
            'is_active' => 'boolean',
        ]);

        $sugarTypes = $validated['sugar_type'] ?? null;
        unset($validated['sugar_type']);

        $brand->update($validated);

        if (is_array($sugarTypes)) {
            BrandSugarType::where('brand_id', $brand->brand_id)->delete();
            foreach ($sugarTypes as $type) {
                BrandSugarType::create([
                    'brand_id' => $brand->brand_id,
                    'sugar_type' => $type,
                ]);
            }
        }

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($brand);
        }

        return redirect()->route('brands.index')->with('flash', [
            'message' => 'Brand updated successfully',
            'type' => 'success',
        ]);
    }

    public function destroy($id)
    {
        $brand = SugarBrand::findOrFail($id);

        // If linked to at least one market, do not hard-delete: mark as inactive instead.
        if ($brand->markets()->exists()) {
            $brand->update(['is_active' => false]);

            if (request()->wantsJson() && !request()->header('X-Inertia')) {
                return response()->json([
                    'message' => 'Brand is linked to markets and has been set to inactive'
                ]);
            }

            return redirect()->route('brands.index')->with('flash', [
                'message' => 'Brand is linked to markets and has been set to inactive',
                'type' => 'success',
            ]);
        }

        BrandSugarType::where('brand_id', $brand->brand_id)->delete();
        $brand->delete();

        if (request()->wantsJson() && !request()->header('X-Inertia')) {
            return response()->json(['message' => 'Sugar brand deleted successfully']);
        }

        return redirect()->route('brands.index')->with('flash', [
            'message' => 'Brand deleted successfully',
            'type' => 'success',
        ]);
    }
}
