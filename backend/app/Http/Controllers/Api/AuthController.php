<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use App\Traits\ApiResponser;

class AuthController extends Controller
{
    use ApiResponser;

    /**
     * Handle user login
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Find user by email
        $user = User::with('role')->where('email', $validated['email'])->first();

        if (!$user) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        // Verify password
        if (!Hash::check($validated['password'], $user->password)) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        // Create token (using Sanctum)
        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->successResponse([
            'user' => [
                'user_id' => $user->user_id,
                'email' => $user->email,
                'full_name' => $user->full_name,
                'role_id' => $user->role_id,
                'role' => [
                    'role_id' => $user->role->role_id,
                    'role_name' => $user->role->role_name,
                ],
                'school_id' => $user->school_id,
                'school' => $user->school ? [
                    'school_id' => $user->school->school_id,
                    'school_name' => $user->school->school_name,
                ] : null,
            ],
            'token' => $token,
        ], 'Login successful');
    }

    /**
     * Handle user logout
     */
    public function logout(Request $request): JsonResponse
    {
        // Revoke current token
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Logged out successfully');
    }
}
