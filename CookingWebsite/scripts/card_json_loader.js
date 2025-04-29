document.addEventListener('DOMContentLoaded', () => {
    const CARD_CONTAINER = document.querySelector('.card-container');
    const RECIPES_PER_PAGE = 9;
    let allRecipes = [];
    let filteredRecipes = [];
    let currentPage = 1;

    function createCard(recipe) {
        const card = document.createElement('div');
        const categories = [
            recipe.season,
            recipe.cuisine,
            recipe.difficulty,
            ...(recipe.dietary || []),
        ].join(',');

        card.classList.add('card');
        card.classList.add('bg-light');
        card.id = `card${recipe.id}`;
        card.setAttribute('categories', categories);

        card.innerHTML = `
            <button class="btn clear favorite-btn" onclick="addToFavorites('card${recipe.id}')">
                <img id="favorButton${recipe.id}" src="images/star.svg" width="50" height="50" alt="Favorite Star" />
            </button>
            <img src="images/${recipe.images[0]}" class="card-img-top img-fluid" alt="${recipe.name}" />
            <div class="card-body">
                <h5 class="card-title">${recipe.name}</h5>
                <p class="card-text">${recipe.steps[0]}</p>
                <a href="genericFood.html?id=${recipe.id}" class="btn btn-primary">Go to Recipe</a>
            </div>
        `;
        return card;
    }

    function displayPage(page) {
        CARD_CONTAINER.innerHTML = '';
        const start = (page - 1) * RECIPES_PER_PAGE;
        const end = start + RECIPES_PER_PAGE;
        const currentRecipes = filteredRecipes.slice(start, end);

        currentRecipes.forEach(recipe => {
            const card = createCard(recipe);
            CARD_CONTAINER.appendChild(card);
        });

        if (typeof syncFavoritesUI === "function") {
            syncFavoritesUI();
        }

        renderPaginationControls();
    }

    function renderPaginationControls() {
        let totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);
        let paginationDiv = document.getElementById('pagination-controls');
        if (!paginationDiv) {
            paginationDiv = document.createElement('div');
            paginationDiv.id = 'pagination-controls';
            CARD_CONTAINER.after(paginationDiv);
        }
        paginationDiv.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = `btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-secondary'} m-1`;
            btn.onclick = () => {
                currentPage = i;
                displayPage(currentPage);
            };
            paginationDiv.appendChild(btn);
        }
    }

    fetch('recipe.json')
    .then(res => res.json())
    .then(data => {
        allRecipes = data;
        filteredRecipes = data;
        displayPage(currentPage);

        window.allRecipes = allRecipes;
        window.filteredRecipes = filteredRecipes;
        window.setFilteredRecipes = (newList) => {
            filteredRecipes = newList;
            currentPage = 1;
            displayPage(currentPage);
        };

        if (typeof reinitializeFiltering === "function") {
            reinitializeFiltering();
        }
    })
    .catch(err => console.error('Failed to load recipes:', err));
});

// document.addEventListener('DOMContentLoaded', () => {
//     const CARD_CONTAINER = document.querySelector('.card-container');
//     const RECIPES_PER_PAGE = 9;
//     let allRecipes = [];
//     let filteredRecipes = [];
//     let currentPage = 1;

//     function createCard(recipe) {
//         const card = document.createElement('div');
//         const categories = [
//             recipe.season,
//             recipe.cuisine,
//             recipe.difficulty,
//             ...(recipe.dietary || []),
//         ].join(',');

//         card.classList.add('card');
//         card.id = `card${recipe.id}`;
//         card.setAttribute('categories', categories);

//         card.innerHTML = `
//             <button class="btn clear favorite-btn" onclick="addToFavorites('card${recipe.id}')">
//                 <img id="favorButton${recipe.id}" src="images/star.svg" width="50" height="50" alt="Favorite Star" />
//             </button>
//             <img src="images/${recipe.images[0]}" class="card-img-top img-fluid" alt="${recipe.name}" />
//             <div class="card-body">
//                 <h5 class="card-title">${recipe.name}</h5>
//                 <p class="card-text">${recipe.steps[0]}</p>
//                 <a href="genericFood.html?id=${recipe.id}" class="btn btn-primary">Go to Recipe</a>
//             </div>
//         `;
        
//         return card;
//     }

//     function displayPage(page) {
//         CARD_CONTAINER.innerHTML = '';
//         const start = (page - 1) * RECIPES_PER_PAGE;
//         const end = start + RECIPES_PER_PAGE;
//         const currentRecipes = filteredRecipes.slice(start, end);

//         currentRecipes.forEach(recipe => {
//             const card = createCard(recipe);
//             CARD_CONTAINER.appendChild(card);
//         });

//         renderPaginationControls();
//     }

//     function renderPaginationControls() {
//         let totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);
//         let paginationDiv = document.getElementById('pagination-controls');
//         if (!paginationDiv) {
//             paginationDiv = document.createElement('div');
//             paginationDiv.id = 'pagination-controls';
//             CARD_CONTAINER.after(paginationDiv);
//         }
//         paginationDiv.innerHTML = '';

//         for (let i = 1; i <= totalPages; i++) {
//             const btn = document.createElement('button');
//             btn.textContent = i;
//             btn.className = `btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-secondary'} m-1`;
//             btn.onclick = () => {
//                 currentPage = i;
//                 displayPage(currentPage);
//             };
//             paginationDiv.appendChild(btn);
//         }
//     }

//     fetch('recipe.json')
//     .then(res => res.json())
//     .then(data => {
//         allRecipes = data;
//         filteredRecipes = data;
//         displayPage(currentPage);

//         // Move this inside fetch, AFTER recipes are ready
//         window.allRecipes = allRecipes;
//         window.filteredRecipes = filteredRecipes;
//         window.setFilteredRecipes = (newList) => {
//             filteredRecipes = newList;
//             currentPage = 1;
//             displayPage(currentPage);
//         };

//         if (typeof reinitializeFiltering === "function") {
//             reinitializeFiltering();
//         }
//     })
//     .catch(err => console.error('Failed to load recipes:', err));

//     // Expose these globally so search_bar.js can access
//     window.displayPage = displayPage;
//     window.allRecipes = allRecipes;
//     window.filteredRecipes = filteredRecipes;
//     window.setFilteredRecipes = (newList) => {
//         filteredRecipes = newList;
//         currentPage = 1;
//         displayPage(currentPage);
//     };
// });