<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthService
{
    public function login(array $credentials)
    {
        $user = User::with(['role', 'school'])->where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return null;
        }

        return DB::transaction(function () use ($user) {
            $token = $user->createToken('auth-token')->plainTextToken;
            return [
                'user' => $user,
                'token' => $token,
            ];
        });
    }

    public function logout(User $user)
    {
        return DB::transaction(function () use ($user) {
            return $user->currentAccessToken()->delete();
        });
    }
}
