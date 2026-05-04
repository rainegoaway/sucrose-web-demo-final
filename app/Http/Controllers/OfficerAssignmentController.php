<?php

namespace App\Http\Controllers;

use App\Models\OfficerAssignment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OfficerAssignmentController extends Controller
{
    public function index()
    {
        return response()->json(OfficerAssignment::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'city_id' => 'required|exists:cities,city_id',
            'assigned_date' => 'required|date',
            'expiry_date' => 'nullable|date|after_or_equal:assigned_date',
            'assignment_status' => ['required', Rule::in(['ACTIVE', 'INACTIVE'])],
        ]);

        $assignment = OfficerAssignment::create($validated);

        return response()->json($assignment, 201);
    }

    public function destroy($id)
    {
        $assignment = OfficerAssignment::findOrFail($id);
        $assignment->delete();

        return response()->json(['message' => 'Assignment deleted successfully']);
    }
}
