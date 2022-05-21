<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    /**
     * Récupère la categorie associées à une tache
     * https://laravel.com/docs/9.x/eloquent-relationships#one-to-many-inverse
     *
     * @return [Tasks]
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}