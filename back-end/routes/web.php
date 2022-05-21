<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MainController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TaskController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return  'coucou';
});


Route::get('/home', [MainController::class, 'home']);

/**
 * les endpoints pour les catégories
 */
// route qui renvoie les data de toutes les categories
Route::get('/categories', [CategoryController::class, 'list']);
// route qui renvoie les datas d'une seule categorie en fonction de son id
Route::get('/categories/{id}', [CategoryController::class, 'item']);
// route qui permet d'ajouter une categorie
Route::post('/categories', [CategoryController::class, 'create']);
// route qui permet de supprimer une categorie 
Route::delete('/categories/{id}', [CategoryController::class, 'delete']);

/**
 * les endpoints pour les taches
 */
// route qui renvoie les data de toutes les categories
Route::get('/tasks', [TaskController::class, 'list']);
// route qui renvoie les datas d'une seule categorie en fonction de son id
Route::get('/tasks/{id}', [TaskController::class, 'item']);
// route qui permet d'ajouter une categorie
Route::post('/tasks', [TaskController::class, 'create']);
// route qui permet de supprimer une categorie 
Route::delete('/tasks/{id}', [TaskController::class, 'delete']);
// route pour mettre à jour ou modifier une tache
Route::put('/tasks/{id}', [TaskController::class, 'update']);
Route::patch('/tasks/{id}', [TaskController::class, 'update']);