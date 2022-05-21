//# composant filters

const filters = {
  //stocke l'état d'affichage des tâches actives/archivées
  // par défaut, on n'affiche pas les taches archivées
  showArchivedTasks: false,

  bindEvents: function () {
    //console.log("execute filters.bindEvents()");

    // On récupère l'élément correspondant au lien "Voir les archives/Voir les tâches actives"
    const showActiveOrArchivedTasksLink = document.querySelector(
      ".filters__task--archived .filters__choice"
    );
    // On y ajoute un écouteur d'évènement au clic et on y associe la méthode permettant
    // de passer d'un affichage à l'autre
    showActiveOrArchivedTasksLink.addEventListener(
      "click",
      filters.handleShowActiveOrArchivedTasksLink
    );

    // On récupère l'élément correspondant au lien "completes"
    const showCompleteTasksLink = document.querySelector(
      ".filters__task--complete"
    );
    // On y ajoute un écouteur d'évènement au clic et on y associe la méthode permettant
    // de passer d'un affichage à l'autre
    showCompleteTasksLink.addEventListener(
      "click",
      filters.handleShowCompleteTasksLink
    );

    // On récupère l'élément correspondant au lien "completes"
    const showUnCompleteTasksLink = document.querySelector(
      ".filters__task--uncomplete"
    );
    // On y ajoute un écouteur d'évènement au clic et on y associe la méthode permettant
    // de passer d'un affichage à l'autre
    showUnCompleteTasksLink.addEventListener(
      "click",
      filters.handleShowUnCompleteTasksLink
    );

    // On récupère l'élément correspondant au lien "completes"
    const showAllTasksLink = document.querySelector(".filters__task--all");
    // On y ajoute un écouteur d'évènement au clic et on y associe la méthode permettant
    // de passer d'un affichage à l'autre
    showAllTasksLink.addEventListener("click", filters.handleShowAllTasksLink);
  },

  /**
   * Méthode gérant le lien permettant d'afficher soit les tâches actives
   * soit les tâches archivées
   *
   * @param {Event} evt
   */
  handleShowActiveOrArchivedTasksLink: function (evt) {
    console.log("execute filters.handleShowActiveOrArchivedTasksLink()");

    // On peut passer d'un affichage des tâches actives à l'affichage
    // des tâches archivées ou vice versa donc => on prend l'inverse
    // de la valeur actuelle de l'affichage des tâches archivées
    filters.showArchivedTasks = !filters.showArchivedTasks;

    // On déclare la variable newTextLink avant le if même si elle
    //  est assignée dans le if/else, pour qu'elle puisse être
    // accessible après if/else (scope de la variable)
    let newTextLink;

    // Si on veut afficher les tâches archivées
    if (filters.showArchivedTasks === true) {
      // On affiche uniquement les tâches archivées
      taskList.showOnlyArchivedTasks();
      // Nouveau libellé pour le lien
      newTextLink = "Voir les tâches actives";
    } else {
      // On affiche uniquement les tâches actives
      taskList.showOnlyActiveTasks();
      // Nouveau libellé pour le lien
      newTextLink = "Voir les archives";
    }

    // On modifie le texte du lien dans le DOM
    filters.updateShowActiveOrArchiveTasksLinkText(newTextLink);
  },

  /**
   * Méthode permettant de mettre à jour le texte du lien permettant
   * d'afficher soit les tâches actives soit les tâches archivées
   *
   * @param {String} newTextLink Le nouveau libellé pour le lien
   *
   */
  updateShowActiveOrArchiveTasksLinkText: function (newTextLink) {
    console.log("execute filters.updateShowActiveOrArchiveTasksLinkText()");
    const showActiveOrArchivedTasksLink = document.querySelector(
      ".filters__task--archived .filters__choice"
    );
    showActiveOrArchivedTasksLink.innerText = newTextLink;
  },

  /**
   * Méthode gérant le lien permettant d'afficher les tâches actives complétes
   *
   * @param {Event} evt
   */
  handleShowCompleteTasksLink: function (evt) {
    console.log("execute filters.handleCompleteTasksLink()");
    taskList.showOnlyCompleteTasks();
  },

  /**
   * Méthode gérant le lien permettant d'afficher les tâches actives incomplétes
   *
   * @param {Event} evt
   */
  handleShowUnCompleteTasksLink: function (evt) {
    console.log("execute filters.handleCompleteTasksLink()");
    taskList.showOnlyUnCompleteTasks();
  },

  /**
   * Méthode gérant le lien permettant d'afficher toutes les tâches
   *
   * @param {Event} evt
   */
  handleShowAllTasksLink: function (evt) {
    console.log("execute filters.handleAllTasksLink()");
    taskList.showAllTasks();
  },
};
