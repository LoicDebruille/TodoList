<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;


class CategoryController extends Controller
{
    /**
     * renvoie la liste des catégories au format JSON
     * 
     **url : GET /categories 
     *
     * @return Response (JSON)
     */
    public function list()
    {
        $categoriesList = Category::all();
        return response()->json($categoriesList);
    }

    /**
     * Renvoie les informations de la catégorie dont l'id est précisé en paramètre
     * au format JSON
     *
     * @param [type] $id
     * @return void
     */
    public function item($id)
    {
        $categoriesList = Category::findorFail($id);
        return response()->json($categoriesList);
    }

    /**
     * suppression d'une categorie en fonction de son id
     *
     * *url : DELETE /categories/{id}
     * 
     * @param [type] $id
     * @return void
     */
    public function delete($id)
    {
        $categories = Category::find($id);
        if ($categories::destroy($id)) {
            return response()->json($categories, 202);
        }
        return response('Tache introuvable', Response::HTTP_NO_CONTENT);
    }

    /**
     * creation d'une nouvelle categorie
     *
     * *url : CREATE /categories
     * 
     * @return void
     */
    public function create(Request $request)
    {
        // On verifie les données transmise par le user 
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'status' => 'filled|integer|min:1|max:2'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        //On récupére les valeurs de notre requette pour créer notre nouveau Objet
        $newCategory = new Category;
        $newCategory->name = $request->name;
        $newCategory->status = $request->input('status', 1);
        if ($newCategory->save()) {
            return response()->json($newCategory, 201);
        } else
            return response('ajout impossible', Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}