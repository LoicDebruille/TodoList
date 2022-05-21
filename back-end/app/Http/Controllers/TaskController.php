<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Task;
use Symfony\Component\HttpFoundation\Response;

class TaskController extends Controller
{
    /**
     * renvoie la liste des taches au format JSON
     * 
     **url : GET /tasks
     *
     * @return Response (JSON)
     */
    public function list()
    {
        $tasksList = Task::all()->load('category');
        return response()->json($tasksList);
        // Si on voulait la liste des taches filtrées par catégories
        // alors, nous pourrions utiliser
        //$taskListCategory = Category::find(3)->tasks;
        //return response()->json($taskListCategory);
    }

    /**
     * Renvoie les informations de la tache dont l'id est précisé en paramètre
     * au format JSON
     *
     * @param [type] $id
     * @return void
     */
    public function item($id)
    {
        $tasksList = Task::findorFail($id);
        return response()->json($tasksList);
    }

    /**
     * suppression d'une tache en fonction de son id
     *
     * *url : DELETE /tasks/{id}
     * 
     * @param [type] $id
     * @return void
     */
    public function delete($id)
    {
        $task = Task::findorFail($id);
        if ($task::destroy($id)) {
            return response(204);
        }
        return response('Tache introuvable', 500);
    }

    /**
     * creation d'une nouvelle tache 
     *
     * *url : CREATE /tasks
     * 
     * @return void
     */
    public function create(Request $request)
    {
        // Vérification des des données transmise par le user
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|filled',
            'categoryId' => 'required|filled|integer',
            'completion' => 'filled|integer|min:0|max:100',
            'status' => 'filled|integer|min:1|max:2'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        } else {

            $data = $validator->validated();
            // instanciation du model Task
            $newTask = new Task();

            $newTask->title = $data['title'];
            $newTask->category_id = $data['categoryId'];
            $newTask->completion = $data['completion'] ?? 0;
            $newTask->status = $data['status'] ?? 1;

            // on récupère le résultat dans une variable isCreated
            $isCreated = $newTask->save();

            // On veut aussi renvoyer en réponse au front, les informations de la catégorie associée à la nouvelle tache
            $newTask->load('category');

            if ($isCreated === true) {
                return response()->json($newTask, 201);
            }
            return response('ajout impossible', Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * permet la modification de la tache dont l'id est donné en paramètre
     *
     * @param Request $request (instance de la requête HTTP)
     * @param int $id (id de la tache à modifier)
     * @return Response
     */
    public function update(Request $request, $id)
    {
        $toUpdateTask = Task::find($id);

        if ($toUpdateTask === null) {
            return response('', Response::HTTP_NOT_FOUND);
        } else {
            // Les règles de validation vont être différentes si on est en PATCH ou en PUT

            if ($request->isMethod('put')) {
                $validator = Validator::make($request->all(), [
                    'title' => 'required|string|filled',
                    'categoryId' => 'required|filled|integer',
                    'completion' => 'required|filled|integer|min:0|max:100',
                    'status' => 'required|filled|integer|min:1|max:2'
                ]);
            } else if ($request->isMethod('patch')) {
                $validator = Validator::make($request->all(), [
                    'title' => 'string|filled',
                    'categoryId' => 'filled|integer',
                    'completion' => 'filled|integer|min:0|max:100',
                    'status' => 'filled|integer|min:1|max:2'
                ]);
            }

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            } else {

                $data = $validator->validated();

                $toUpdateTask->title = $data['title'] ?? $toUpdateTask->title;

                $toUpdateTask->category_id = $data['categoryId'] ?? $toUpdateTask->category_id;

                $toUpdateTask->completion = $data['completion'] ?? $toUpdateTask->completion;

                $toUpdateTask->status = $data['status'] ?? $toUpdateTask->status;

                // on récupère le résultat dans une variable isCreated
                $isUpdated = $toUpdateTask->save();

                if ($isUpdated === true) {
                    return response()->json($toUpdateTask, 201);
                } else {
                    return response('', Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            }
        }
    }
}