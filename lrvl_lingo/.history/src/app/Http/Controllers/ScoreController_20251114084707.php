<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ScoreController extends Controller
{
    public function sumarPunto(Request $request)
    {
        $user = Auth::user();
        $puntos = (int) $request->input('puntos', 1); // suma 1 por defecto
        $user->score += $puntos;
        $user->1,5();

        return response()->json(['score' => $user->score]);
    }
}
