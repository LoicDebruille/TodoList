//! composant taskList

/**
 * Méthode permettant d'attacher des écouteurs d'événements sur toutes les taches
 */
const taskList = {
  // appeler pour chaque tache affichée dans le DOM
  // les méthodes qui permettent d'attacher des écouteurs d'événements
  bindAllTasksEvents: function () {
    console.log("execute taskList.bindAllTasksEvents()");

    // sélectionne tous les éléments qui possèdent la classe "task" et qui a pour parent un élément qui possède la classe "tasks"
    const taskList = document.querySelectorAll(".tasks .task");

    // on parcourt notre liste d'éléments pour y attacher les écouteurs nécessaires
    for (const taskElement of taskList) {
      task.bindSingleTaskEvents(taskElement);
    }
  },

  /**
   * Méthode permettant de charger les tâches depuis la bdd
   */
  loadTasksFromAPI: function () {
    console.log("execute taskList.loadTasksFromAPI()");

    // On prépare la configuration de la requête HTTP
    const config = {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
    };

    // On déclenche la requête HTTP (via le moteur sous-jacent Ajax)
    fetch(app.apiRootUrl + "/tasks", config)
      // Ensuite, lorsqu'on reçoit la réponse au format JSON
      .then(function (response) {
        // On convertit cette réponse en un objet JS et on le retourne
        return response.json();
      })
      // Ce résultat au format JS est récupéré en argument ici-même
      .then(function (tasksDataFromAPI) {
        // Pour chaque tâche issue de la liste des tâches retournée
        // par l'appel à l'API
        for (const singleTask of tasksDataFromAPI) {
          //console.log(singleTask);
          // on crée un nouvel élément task
          const newTaskElement = task.addTaskElt(
            singleTask.title,
            singleTask.category.name,
            singleTask.id,
            singleTask.status,
            singleTask.completion
          );
        }
      });

    console.log("end taskList.loadTasksFromAPI()");
  },

  /**
   * Méthode permettant d'afficher uniquement les tâches archivées
   */
  showOnlyArchivedTasks: function () {
    // On récupère la liste de toutes les tâches
    const allTasksList = document.querySelectorAll(".task:not(.task--add)");
    // On parcourt chaque tâche une à une
    for (const singleTask of allTasksList) {
      // Est-ce une tâche archivée ?
      if (singleTask.classList.contains("task--archive")) {
        // Oui, alors on réaffiche la tâche pour qu'elle apparaissent
        // à nouveau dans la liste
        task.showTask(singleTask);
      } else {
        // Non, il s'agit donc d'une tâche active => on la cache
        task.hideTask(singleTask);
      }
    }
  },

  /**
   * Méthode permettant d'afficher uniquement les tâches archivées
   */
  showOnlyActiveTasks: function () {
    // On récupère la liste de toutes les tâches
    const allTasksList = document.querySelectorAll(".task:not(.task--add)");
    // On parcourt chaque tâche une à une
    for (const singleTask of allTasksList) {
      // Est-ce une tâche archivée ?
      if (!singleTask.classList.contains("task--archive")) {
        // Oui, alors on réaffiche la tâche pour qu'elle apparaissent
        // à nouveau dans la liste
        task.showTask(singleTask);
      } else {
        // Non, il s'agit donc d'une tâche active => on la cache
        task.hideTask(singleTask);
      }
    }
  },

  /**
   * Méthode permettant d'afficher uniquement les tâches complétes
   */
  showOnlyCompleteTasks: function () {
    task.removeIsInfoButtonFiltersChoice();
    const addIsInfo = document.querySelector(".filters__task--complete");
    addIsInfo.classList.add("is-info");
    // On récupère la liste de toutes les tâches
    const allTasksList = document.querySelectorAll(".task:not(.task--add)");
    // On parcourt chaque tâche une à une
    for (const singleTask of allTasksList) {
      // Est-ce une tâche archivée ?
      if (
        singleTask.classList.contains("task--todo") ||
        singleTask.classList.contains("task--archive")
      ) {
        task.hideTask(singleTask);
      } else {
        task.showTask(singleTask);
      }
    }
  },

  /**
   * Méthode permettant d'afficher uniquement les tâches incomplétes
   */
  showOnlyUnCompleteTasks: function () {
    task.removeIsInfoButtonFiltersChoice();
    const addIsInfo = document.querySelector(".filters__task--uncomplete");
    addIsInfo.classList.add("is-info");
    // On récupère la liste de toutes les tâches
    const allTasksList = document.querySelectorAll(".task:not(.task--add)");
    // On parcourt chaque tâche une à une
    for (const singleTask of allTasksList) {
      // Est-ce une tâche archivée ?
      if (
        singleTask.classList.contains("task--complete") ||
        singleTask.classList.contains("task--archive")
      ) {
        task.hideTask(singleTask);
      } else {
        task.showTask(singleTask);
      }
    }
  },

  /**
   * Méthode permettant d'afficher uniquement les tâches incomplétes
   */
  showAllTasks: function () {
    task.removeIsInfoButtonFiltersChoice();
    const addIsInfo = document.querySelector(".filters__task--all");
    addIsInfo.classList.add("is-info");
    // On récupère la liste de toutes les tâches
    const allTasksList = document.querySelectorAll(".task:not(.task--add)");
    // On parcourt chaque tâche une à une
    for (const singleTask of allTasksList) {
      // Est-ce une tâche archivée ?
      if (singleTask.dataset.status == 1) {
        // Oui, alors on réaffiche la tâche pour qu'elle apparaissent
        // à nouveau dans la liste
        task.showTask(singleTask);
      } else {
        task.hideTask(singleTask);
      }
    }
  },
};
