<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users_account,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Register berhasil',
            'token'   => $token,
            'user'    => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // ── UPDATE PROFILE ─────────────────────────────────────
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'  => 'required|string|max:100',
            'email' => 'required|email|unique:users_account,email,' . $user->user_id . ',user_id',
        ]);

        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user'    => $user->fresh(),
        ]);
    }

    // ── GANTI PASSWORD ──────────────────────────────────────
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|string|min:6|confirmed', // perlu new_password_confirmation
        ]);

        $user = $request->user();

        // Cek password lama benar
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Password saat ini tidak sesuai.',
                'errors'  => ['current_password' => ['Password saat ini tidak sesuai.']],
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        // Hapus semua token lama — paksa login ulang
        $user->tokens()->delete();
        $newToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Password berhasil diubah. Silakan login ulang.',
            'token'   => $newToken,
        ]);
    }
}