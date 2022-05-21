<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /**
     * Récupère toutes les taches associées à une catégorie
     *https://laravel.com/docs/9.x/eloquent-relationships#one-to-many
     
     * @return [Tasks]
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}

//$category = Category::findOrFail($id);
//$taskList = $category->tasks;
//dd($taskList);
//return response()->json($category);