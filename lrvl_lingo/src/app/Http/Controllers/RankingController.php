<?php

namespace App\Http\Controllers;

use App\Models\User;

class RankingController extends Controller
{
    public function index()
    {
        $usuarios = User::orderByDesc('score')->take(10)->get();
        return view('ranking', compact('usuarios'));
    }
}
