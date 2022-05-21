//!module app
const app = {
  apiRootUrl: "http://localhost:8000",

  /**
   * init()
   *
   * La méthode init contient le code que l'on veut exécuter au lancement
   * de l'application
   */
  init: function () {
    console.log("execute app.init");

    //* chargement des données de l'API
    // charge les catégories
    categoriesList.loadCategoriesFromAPI();
    // charge les taches déjà créées
    taskList.loadTasksFromAPI();

    //* mise en place des écouteurs
    // attache tous les écouteurs d'événements sur chacune des taches actuellement dans le DOM
    taskList.bindAllTasksEvents();
    // attache un écouteur d'événement submit sur le formulaire d'ajout de tache
    newTaskForm.bindNewTaskFormEvent();
    // attache des écouteurs d'événement click sur les boutons pour filtrer l'affichage des taches
    filters.bindEvents();
  },
};

// Ajout d'un écouteur sur le "document entier"
// l'événement est "lorsque le DOM est complètement chargé" = "DOMContentLoaded"
// le handler qui sera dans ce cas précis appelé sera le point d'entrée de notre application/module
document.addEventListener("DOMContentLoaded", app.init);
