//! composant task

const task = {
  /**
   * création d'un bloc de tache
   * @param string newTitle le titre de la tache à afficher
   * @param string newCategory le nom de la catégorie de la tache à afficher
   * @param int newId l'identifiant BDD de la tache
   * @param int newCompletion niveau de complétion de la tache
   */
  addTaskElt: function (
    newTitle,
    newCategory,
    newId,
    newStatus,
    newCompletion
  ) {
    console.log("execute task.addTaskElt()");

    // on récupère d'abord le template dans notre html
    const newTaskTpl = document.querySelector("#newTaskTpl");
    // ensuite on le clone pour en faire un nouvel élément HTML
    const newTaskElt = newTaskTpl.content.cloneNode(true);

    // on met à jour le titre de la nouvelle tache avec la chaine passée en argument
    newTaskElt.querySelector(".task__title-label").textContent = newTitle;
    newTaskElt.querySelector(".task__title-field").value = newTitle;

    // on met à jour la catégorie de la nouvelle tache avec la chaine passée en second argument
    newTaskElt.querySelector(".task__category > p").textContent = newCategory;
    newTaskElt.firstElementChild.dataset.category = newCategory;

    // on met à jour l'id de la tache
    // On stocke l'id de la tache dans un dataset
    newTaskElt.firstElementChild.dataset.id = newId;

    // on met à jour le status de la tache
    // On stocke le statut de la tache dans un dataset
    newTaskElt.firstElementChild.dataset.status = newStatus;
    // gestion du status
    if (newStatus === 2) {
      task.setArchive(newTaskElt.firstElementChild, newStatus);
      task.hideTask(newTaskElt.firstElementChild);
    }

    // On stocke le statut de la completion dans un dataset
    newTaskElt.firstElementChild.dataset.completion = newCompletion;
    // On modifie la valeur de completion en fonction de sa valeur nouvelle
    task.setCompletion(newTaskElt.firstElementChild, newCompletion);

    //On change le visuel de la tache en terminée si completion à 100%
    if (newCompletion == 100) {
      task.setComplete(newTaskElt.firstElementChild);
    }

    // on demande au composant task d'attacher les écouteurs d'événement à cette nouvelle tâche
    task.bindSingleTaskEvents(newTaskElt);

    // on sélectionne la div qui contient toutes les taches
    const taskListElt = document.querySelector(".tasks");
    // et on rattache la nouvelle tache à la fin de cette liste
    taskListElt.appendChild(newTaskElt);
  },

  /**
   * !Méthode bindSingleTaskEvents(taskElement)
   *
   * permet d'attacher les écouteurs d'événement sur UNE tache passée en paramètre
   *
   * @param {HTMLElement} taskElement
   */
  bindSingleTaskEvents: function (taskElement) {
    //console.log("execute task.bindSingleTaskEvents()");

    //* écoute d'événement 'click' sur le <p>
    // Le <p class="task__title-label"> contient le titre de la tache
    const labelTaskElt = taskElement.querySelector(".task__title-label");
    labelTaskElt.addEventListener("click", task.handleEnableTaskTitleEditMode);

    //* écoute d'événements sur le <input type=text class="task__title-field">
    const inputTaskElt = taskElement.querySelector(".task__title-field");
    //* event 'blur'
    // c'est à dire lorsque le curseur sort du input
    inputTaskElt.addEventListener("blur", task.handleValidateNewTaskTitle);
    //* event 'keydown'
    // c'est à dire lorsqu'une des touches du clavier est abaissée
    inputTaskElt.addEventListener(
      "keydown",
      task.handleValidateNewTaskTitleOnKeyDown
    );

    //* écoute d'événement sur le bouton "terminer une tache"
    const btnCompleteElt = taskElement.querySelector(".task__button--validate");
    btnCompleteElt.addEventListener("click", task.handleCompleteTask);

    //* écoute d'événement sur le bouton "terminer une tache"
    const btnIncompleteElt = taskElement.querySelector(
      ".task__button--incomplete"
    );
    btnIncompleteElt.addEventListener("click", task.handleIncompleteTask);

    //* écoute d'évenement sur le bouton "archiver une tache"
    const btnArchiveElt = taskElement.querySelector(".task__button--archive");
    btnArchiveElt.addEventListener("click", task.handleArchiveTask);

    //* écoute d'évenement sur le bouton "desarchiver une tache"
    const btnDesarchiveElt = taskElement.querySelector(
      ".task__button--desarchive"
    );
    btnDesarchiveElt.addEventListener("click", task.handleDesarchiveTask);

    //* écouter le bouton modifier une tache
    const btnModifyElt = taskElement.querySelector(".task__button--modify");
    btnModifyElt.addEventListener("click", task.handleEnableTaskTitleEditMode);

    //* écouter le bouton supprimer une tache
    const btnDeleteElt = taskElement.querySelector(".task__button--delete");
    btnDeleteElt.addEventListener("click", task.handleDeleteTask);
  },

  /**
   * !Handler handleEnableTaskTitleEditMode(evt)
   *
   * code à exécuter pour rendre le titre d'une tâche editable
   *
   * @param {Event} evt
   */
  handleEnableTaskTitleEditMode: function (evt) {
    //console.log("execute task.handleEnableTaskTitleEditMode()");

    // currentTarget est une propriété de l'objet "Event" courant contenu dans evt
    // currentTarget stocke l'élément HTML qui vient d'être cliqué
    const taskLabelElt = evt.currentTarget;

    // On cherche à trouver le block 'task' qui contient le titre cliqué
    // Doc de closest : https://developer.mozilla.org/fr/docs/Web/API/Element/closest
    const taskBlock = taskLabelElt.closest(".task");

    // Enfin, on ajoute la classe 'task--edit' sur l'élément tâche
    // Doc de classList : https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
    taskBlock.classList.add("task--edit");
    // focus dans le champ input
    taskBlock.querySelector(".task__title-field").focus();
  },

  /**
   * !Handler handleValidateNewTaskTitle(evt)
   *
   * code qui permet de modifier le titre d'une tache et qui supprime l'état éditable de la tache
   *
   * @param {Event} evt
   */
  handleValidateNewTaskTitle: function (evt) {
    console.log("execute task.handleValidateNewTaskTitle()");

    // On récupère l'élément input qui vient de devenir inactif
    const taskTitleFieldElement = evt.currentTarget;

    //On a besoin de l'ID BDD de la tache à modifier
    const taskElt = taskTitleFieldElement.closest(".task");
    const taskID = taskElt.dataset.id;

    // on stocke la value
    const newTitle = taskTitleFieldElement.value;

    // On va envoyer une requête à notre API pour mettre à jour la BDD
    // On stocke les données à transférer
    const data = {
      title: newTitle,
    };

    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On consomme l'API pour ajouter en DB
    const fetchOptions = {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data),
    };

    // Exécuter la requête HTTP avec FETCH
    fetch(app.apiRootUrl + "/tasks/" + taskID, fetchOptions).then(function (
      response
    ) {
      if (response.status == 201) {
        // elle n'est plus en mode édition,
        // donc on lui retire la classe task--edit
        taskElt.classList.remove("task--edit");

        // on applique la saisie dans le <p>
        taskTitleFieldElement.previousElementSibling.textContent = newTitle;
      } else {
        alert("Echec de la modification");
      }
    });
  },

  /**
   * !Handler handleValidateNewTaskTitleOnKeyDown(evt)
   *
   * code qui exécute handleValidateNewTaskTitle(evt) seulement si la touche Enter est enfoncée
   *
   * @param {Event} evt
   */
  handleValidateNewTaskTitleOnKeyDown: function (evt) {
    //console.log("execute task.handleValidateNewTaskTitleOnKeyDown()");
    //console.log(evt.key);

    if (evt.key == "Enter") {
      task.handleValidateNewTaskTitle(evt);
    }
  },

  /**
   * !Handler handleCompleteTask(evt)
   *
   * code qui permet de passer une tache de l'état "todo" en état "terminé"
   *
   * @param {Event} evt
   */
  handleCompleteTask: function (evt) {
    //console.log('execute task.handleCompleteTask()');
    //console.log(evt);

    // On récupère l'élément button qui vient d'être cliqué
    const btnCompleteElt = evt.currentTarget;
    // on récupère le block de la tache courante
    const taskBlock = btnCompleteElt.closest(".task");
    // on récupére les dataset id
    const IdTaskBlock = taskBlock.dataset.id;

    // On stocke les données à transférer
    const data = {
      completion: parseInt(100),
    };
    console.log(data);

    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On consomme l'API pour ajouter en DB
    const fetchOptions = {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data),
    };

    // Exécuter la requête HTTP avec FETCH
    fetch(app.apiRootUrl + "/tasks/" + IdTaskBlock, fetchOptions).then(
      function (response) {
        console.log(response);
        // Si HTTP status code à 201 => OK
        if (response.status == 201) {
          //alert("ajout effectué");

          // la tache doit passer visuellement en état "terminé"
          task.setComplete(taskBlock);
          // affichage de la completion
          task.setCompletion(taskBlock, 100);
        } else {
          alert("L'ajout a échoué");
        }
      }
    );
  },

  /**
   * !Handler handleIncompleteTask(evt)
   *
   * code qui permet de passer une tache de l'état "terminé" à "ToDo"
   *
   * @param {Event} event
   */
  handleIncompleteTask: function (event) {
    //console.log('execute task.handleCompleteTask()');
    //console.log(evt);

    // On récupère l'élément button qui vient d'être cliqué
    const btnIncompleteElt = event.currentTarget;
    // on récupère le block de la tache courante
    const taskBlock = btnIncompleteElt.closest(".task");
    // on récupére les dataset id
    const IdTaskBlock = taskBlock.dataset.id;

    // On stocke les données à transférer
    const data = {
      completion: parseInt(0),
    };

    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On consomme l'API pour ajouter en DB
    const fetchOptions = {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data),
    };

    // Exécuter la requête HTTP avec FETCH
    fetch(app.apiRootUrl + "/tasks/" + IdTaskBlock, fetchOptions).then(
      function (response) {
        console.log(response);
        // Si HTTP status code à 201 => OK
        if (response.status == 201) {
          //alert("ajout effectué");

          // la tache doit passer visuellement en état "terminé"
          // donc on retire la classe task--complete
          task.setInComplete(taskBlock);
          // pour mettre la classe task--complete
          // affichage de la completion
          task.setCompletion(taskBlock, 0);
        } else {
          alert("L'ajout a échoué");
        }
      }
    );
  },

  setComplete: function (taskElt) {
    // la tache doit passer visuellement en état "terminé"
    // donc on retire la classe task--todo
    taskElt.classList.remove("task--todo");
    // pour mettre la classe task--complete
    taskElt.classList.add("task--complete");
  },

  setInComplete: function (taskElt) {
    // la tache doit passer visuellement en état "non-terminé"
    // donc on retire la classe task--todo
    taskElt.classList.remove("task--complete");
    // pour mettre la classe task--complete
    taskElt.classList.add("task--incomplete");
  },

  setArchive: function (taskElt) {
    // la tache doit passer visuellement en état "non-terminé"
    // donc on retire la classe task--todo
    if (taskElt.classList.remove("task--complete")) {
      taskElt.classList.add("task--archive");
    } else taskElt.classList.remove("task--todo");
    {
      taskElt.classList.add("task--archive");
    }
  },

  setDesarchive: function (taskElt) {
    // la tache doit passer visuellement en état "non-terminé"
    // donc on retire la classe task--todo
    taskElt.classList.remove("task--archive");
    // pour mettre la classe task--complete
    taskElt.classList.add("task--todo");
  },

  /**
   * met à jour la largeur de la barre de complétion
   * @param HTMLElement taskElt élément bloc d'affichage d'une tache
   * @param number completionLvl niveau de complétion à afficher
   */
  setCompletion: function (taskElt, completionLvl) {
    taskElt.querySelector(".progress-bar__level").style.width =
      completionLvl + "%";
  },

  /**
   * !Handler handleArchiveTask(evt)
   *
   * code qui permet de passer une tache de l'état "terminé" à "archivé"
   *
   * @param {Event} event
   */
  handleArchiveTask: function (evt) {
    console.log("click archive");
    // On récupère l'élément button qui vient d'être cliqué
    const btnArchiveElt = evt.currentTarget;
    // on récupère le block de la tache courante
    const taskBlock = btnArchiveElt.closest(".task");
    // on récupére les dataset id
    const IdTaskBlock = taskBlock.dataset.id;

    // On stocke les données à transférer
    const data = {
      status: parseInt(2),
    };

    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On consomme l'API pour ajouter en DB
    const fetchOptions = {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data),
    };

    // Exécuter la requête HTTP avec FETCH
    fetch(app.apiRootUrl + "/tasks/" + IdTaskBlock, fetchOptions).then(
      function (response) {
        console.log(response);
        // Si HTTP status code à 201 => OK
        if (response.status == 201) {
          alert("ajout effectué");

          // la tache doit passer visuellement en état "terminé"
          task.setArchive(taskBlock);
          // affichage de la completion
          task.setCompletion(taskBlock, 100);
        } else {
          alert("L'ajout a échoué");
        }
      }
    );
  },

  /**
   * !Handler handleDesrchiveTask(evt)
   *
   * code qui permet de passer une tache de l'état "archivé" à "desarchivé"
   *
   * @param {Event} event
   */
  handleDesarchiveTask: function (evt) {
    console.log("click desarchive");
    // On récupère l'élément button qui vient d'être cliqué
    const btnDesarchiveElt = evt.currentTarget;
    // on récupère le block de la tache courante
    const taskBlock = btnDesarchiveElt.closest(".task");
    // on récupére les dataset id
    const IdTaskBlock = taskBlock.dataset.id;

    // On stocke les données à transférer
    const data = {
      status: parseInt(1),
    };

    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On consomme l'API pour ajouter en DB
    const fetchOptions = {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data),
    };

    // Exécuter la requête HTTP avec FETCH
    fetch(app.apiRootUrl + "/tasks/" + IdTaskBlock, fetchOptions).then(
      function (response) {
        console.log(response);
        // Si HTTP status code à 201 => OK
        if (response.status == 201) {
          alert("ajout effectué");

          // la tache doit passer visuellement en état "terminé"
          task.setDesarchive(taskBlock);
          // affichage de la completion
          task.setCompletion(taskBlock, 0);
        } else {
          alert("L'ajout a échoué");
        }
      }
    );
  },

  /**
   * !Handler handleDeleteTask(evt)
   *
   * code qui permet de supprimer une tache
   *
   * @param {Event} event
   */
  handleDeleteTask: function (evt) {
    // On récupère l'élément button qui vient d'être cliqué
    const btnDeleteElt = evt.currentTarget;
    // on récupère le block de la tache courante
    const taskBlockToDelete = btnDeleteElt.closest(".task");
    // on récupére les dataset id
    const IdTaskBlock = taskBlockToDelete.dataset.id;

    // On consomme l'API pour ajouter en DB
    const Options = {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
    };

    // On déclenche la requête HTTP (via le moteur sous-jacent Ajax)
    fetch(app.apiRootUrl + "/tasks/" + IdTaskBlock, Options)
      // Ensuite, lorsqu'on reçoit la réponse au format JSON
      .then(function (response) {
        console.log(response);
        // Si HTTP status code à 200 => OK
        if (response.status == 200) {
          taskBlockToDelete.classList.add("is-hidden");
          alert("suppression effectué");
        } else {
          alert("La suppression à échouée");
        }
      });
  },

  /**
   * Méthode permettant de cacher une tâche
   * @param {HTMLElement} taskElt élément bloc d'affichage d'une tache
   */
  hideTask: function (taskElement) {
    // On s'appuie sur le framework CSS Bulma qui met à notre disposition
    // la classe is-hidden :
    taskElement.classList.add("is-hidden");
  },

  /**
   * Méthode permettant d'afficher une tâche
   * @param {HTMLElement} taskElement élément bloc d'affichage d'une tache
   */
  showTask: function (taskElement) {
    taskElement.classList.remove("is-hidden");
  },

  removeIsInfoButtonFiltersChoice: function () {
    const isInfo = document.querySelectorAll(
      ".filters__task .filters__choice "
    );
    console.log(isInfo);

    for (removeIsInfo of isInfo) {
      removeIsInfo.classList.remove("is-info");
    }
  },
};
