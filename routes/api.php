<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Ruta de prueba para verificar que el servidor de Laravel funciona.
Route::get('/status', function () {
    return response()->json(['status' => 'API is running']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});