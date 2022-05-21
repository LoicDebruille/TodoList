//! composant categriesList

const categoriesList = {

    
    loadCategoriesFromAPI: function(){
        console.log('execute categoriesList.loadCategoriesFromAPI');

        // On prépare la configuration de la requête HTTP
        const config = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };

        // On déclenche la requête HTTP (via le moteur sous-jacent Ajax)
        fetch(app.apiRootUrl + '/categories', config)
        // Ensuite, lorsqu'on reçoit la réponse HTTP au format JSON
        .then(function(response) {
            // On convertit cette réponse en un objet JS et on le retourne
            return response.json();
        })
        // Ce résultat au format JS est récupéré en argument ici-même
        .then(function(categoriesDataFromAPI) {

            //? Méthode #1 -----
            // On cherche les select dans le DOM et on leur attribue autant d'éléments options qu'il y a de catégories récupérées

            let selectElement1 = document.querySelector('.task--add select');
            categoriesList.fillSelectElement(categoriesDataFromAPI, selectElement1);

            let selectElement2 = document.querySelector('select.filters__choice');
            categoriesList.fillSelectElement(categoriesDataFromAPI, selectElement2);

            //? Méthode #2 -----
            // on crée les éléments select, on leur attribue leurs éléments options et on les rattache au DOM
            // avec cloneNode, on peut créer l'élément select avec ses options qu'une seule fois
/* 
            const selectElmt = document.createElement('select');

            for (let i = 0; i < categoriesDataFromAPI.length; i++) {

                let listItem = document.createElement('option');
                listItem.textContent = categoriesDataFromAPI[i].name;
                selectElmt.appendChild(listItem);
            }

            let newSelect = selectElmt.cloneNode(true);

            const myListHeader = document.querySelector('.filters__task--category');
            newSelect.classList.add('filters__choice');
            myListHeader.appendChild(newSelect);

            const myListForm = document.querySelector('.task--add .select');
            myListForm.appendChild(selectElmt);
 */
        });

        console.log('end categoriesList.loadCategoriesFromAPI')
    },

    fillSelectElement: function(categories, selectElement) {

        
        // On parcourt la liste des catégories pour créer
        // une <option> par nom de catégorie
        for (const category of categories) {

            // Création de l'élement <option>
            const optionElement = document.createElement('option');
            // On lui ajoute son libellé
            optionElement.textContent = category.name;
            // On lui ajoute son id
            optionElement.value = category.id;

             // On insère l'<option> dans le <select>
             selectElement.append(optionElement);
        }
    }
};