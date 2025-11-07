<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PalabraController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\RankingController;

// Página principal (landing)
Route::get('/', function () {
    return view('lingo.welcome');
});

// Palabras - CRUD básico
Route::get('/palabras', [PalabraController::class, 'index'])->name('palabras.index');
Route::get('/palabrasStyled', [PalabraController::class, 'indexStyled'])->name('palabras.indexStyled');
Route::get('/palabrasBlade', [PalabraController::class, 'indexBlade'])->name('palabras.indexBlade');

// Redirige al juego tras login o registro
Route::get('/dashboard', function () {
    return redirect()->route('main');
})->middleware(['auth', 'verified'])->name('dashboard');

// Juego principal (solo usuarios autenticados)
Route::get('/main', function () {
    return view('juego');
})->middleware(['auth', 'verified'])->name('main');

// Perfil de usuario
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas de autenticación (Breeze)
require __DIR__.'/auth.php';

// API de palabras (Laravel)
Route::get('/palabrasRandom', [PalabraController::class, 'palabraRandomJson'])
    ->name('palabras.random');

// Verificación de palabras
Route::get('/verificarPalabra/{palabra}', [PalabraController::class, 'verificarPalabra'])
    ->middleware(['auth', 'verified'])
    ->name('palabras.verificarPalabra');

// Guardar puntuación
Route::post('/score/sumar', [ScoreController::class, 'sumarPunto'])
    ->middleware(['auth', 'verified'])
    ->name('score.sumar');

// Página del ranking
Route::get('/ranking', [RankingController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('ranking');
