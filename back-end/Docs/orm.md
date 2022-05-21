# Eloquent : ORM

Il utilise le pattern _Active Record_ comme ce que nous avons en saison 5 et 6.

Une table = Une classe MODEL

La classe MODEL aura en charge de faire les requêtes CRUD (creation, lecture, modification, suppression).

## Créer un modèle avec la commande artisan

```
php artisan make:model NOMDECLASSE
```

https://laravel.com/docs/8.x/eloquent#eloquent-model-conventions

## Créer un modèle sans commande artisan

- étendre la nouvelle classe avec la classe Model de Eloquent
- nommer la classe avec le même nom que la table, mais cette fois au singulier en CamelCase

## Les méthodes héritées

### Model::all()

### Model::find(id)

### Model::where('colonne', 'valeur')

### insertion de données
