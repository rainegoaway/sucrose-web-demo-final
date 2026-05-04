<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->with(['assignments.city'])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(function (User $user) {
                $assignment = 'Unassigned';

                if (in_array($user->role, ['IT_ADMIN', 'MONITORING_ADMIN', 'CONSOLIDATION_OFFICER'])) {
                    $assignment = 'Office';
                }

                $active = $user->assignments
                    ->where('assignment_status', 'ACTIVE')
                    ->sortByDesc('assigned_date')
                    ->first();

                if ($active && $active->city) {
                    $assignment = $active->city->city_name;
                }

                return [
                    'user_id' => $user->user_id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_active' => (bool) $user->is_active,
                    'assignment' => $assignment,
                ];
            });

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($users);
        }

        return Inertia::render('Personnel/Index', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $isInertia = (bool) $request->header('X-Inertia');

        $rules = [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => ['required', Rule::in(['IT_ADMIN', 'MONITORING_ADMIN', 'MONITORING_OFFICER', 'CONSOLIDATION_OFFICER'])],
            'is_active' => 'boolean',
        ];

        if (!$isInertia) {
            $rules['password'] = 'required|string|min:8';
        }

        $validated = $request->validate($rules);

        $plainPassword = $validated['password'] ?? Str::password(12);
        $validated['password'] = Hash::make($plainPassword);

        if (!array_key_exists('is_active', $validated)) {
            $validated['is_active'] = true;
        }

        $user = User::create($validated);

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($user, 201);
        }

        return redirect()->route('personnel.index')->with('flash', [
            'message' => "Personnel created successfully. Temporary password: {$plainPassword}",
            'type' => 'success',
        ]);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'email' => ['email', Rule::unique('users')->ignore($user->user_id, 'user_id')],
            'role' => [Rule::in(['IT_ADMIN', 'MONITORING_ADMIN', 'MONITORING_OFFICER', 'CONSOLIDATION_OFFICER'])],
            'is_active' => 'boolean',
        ]);

        $user->update($validated);

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($user);
        }

        return redirect()->route('personnel.index')->with('flash', [
            'message' => 'Personnel updated successfully',
            'type' => 'success',
        ]);
    }

    public function deactivate($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => false]);

        if (request()->wantsJson() && !request()->header('X-Inertia')) {
            return response()->json(['message' => 'User deactivated successfully']);
        }

        return redirect()->route('personnel.index')->with('flash', [
            'message' => 'Personnel deactivated successfully',
            'type' => 'success',
        ]);
    }

    public function resetPassword($id)
    {
        $user = User::findOrFail($id);
        $plainPassword = Str::password(12);
        $user->update(['password' => Hash::make($plainPassword)]);

        if (request()->wantsJson()) {
            return response()->json([
                'message' => 'Password reset successfully',
                'temporary_password' => $plainPassword
            ]);
        }

        return redirect()->route('personnel.index')->with('flash', [
            'message' => "Password reset successfully. Temporary password: {$plainPassword}",
            'type' => 'success',
        ]);
    }

    public function hasMonitoringRecords($id)
    {
        $user = User::findOrFail($id);
        
        $hasRecords = $user->assignments()
            ->whereHas('marketRecords')
            ->exists();

        return response()->json([
            'has_monitoring_records' => $hasRecords
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Check if user has monitoring records
        $hasMonitoringRecords = $user->assignments()
            ->whereHas('marketRecords')
            ->exists();

        if ($hasMonitoringRecords) {
            if (request()->wantsJson()) {
                return response()->json([
                    'message' => 'Cannot delete user with associated monitoring records'
                ], 409);
            }
            return redirect()->route('personnel.index')->with('flash', [
                'message' => 'Cannot delete user with associated monitoring records',
                'type' => 'error',
            ]);
        }

        $user->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'User deleted successfully']);
        }

        return redirect()->route('personnel.index')->with('flash', [
            'message' => 'Personnel deleted successfully',
            'type' => 'success',
        ]);
    }
}
