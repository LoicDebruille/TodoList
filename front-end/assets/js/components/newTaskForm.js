//! composant newTaskForm

const newTaskForm = {

    bindNewTaskFormEvent: function()
    {
        console.log('execute newTaskForm.bindNewTaskFormEvent()');
        // récupérer le formulaire
        const taskFormElt = document.querySelector('.task--add form');
        taskFormElt.addEventListener('submit', newTaskForm.handleNewTaskFormSubmit);
    },

    handleNewTaskFormSubmit: function(evt)
    {
        console.log('execute newTaskForm.handleNewTaskFormSubmit()');

        // On bloque le comportement par défaut de la soumission d'un formulaire
        evt.preventDefault();

        //* On récupère le titre de la tâche saisi
        // Pour cela, il faut récupérer l'élément formulaire qui vient d'être soumis
        const taskFormElt = evt.currentTarget;
        // puis chercher le champ qui contient la saisie du nouveau titre
        const taskTitleInputElt = taskFormElt.querySelector('input.task__title-field');
        // on récupère ce qui a été saisi
        const taskTitleInputValue = taskTitleInputElt.value;

        //* On récupère la catégorie choisie
        const taskCategorySelectElt = taskFormElt.querySelector('.task__category select');
        const taskCategorySelectValue = taskCategorySelectElt.value;
        
        // en une seule ligne 
        ////const taskTitleInputValue = evt.currentTarget.querySelector('input.task__title-field').value;
        
        if (taskTitleInputValue !== '') {
            task.addTaskElt(taskTitleInputValue, taskCategorySelectValue);
        }
        else {
            alert('Il faut saisir un titre pour créer une nouvelle tâche');
        }

        // bonus : on vide l'input et on y remet le focus
        taskTitleInputElt.value = '';
        taskTitleInputElt.focus();
    },

};