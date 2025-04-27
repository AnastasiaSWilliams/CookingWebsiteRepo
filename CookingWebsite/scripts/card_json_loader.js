document.addEventListener('DOMContentLoaded', () => {
  const CARD_CONTAINER = document.querySelector('.card-container');
  const RECIPES_PER_PAGE = 9;
  let allRecipes = [];
  let currentPage = 1;

  function createCard(recipe) {
    const card = document.createElement('div');

    // Build category tags correctly
    const categories = [];

    // Seasons
    if (recipe.season) categories.push(recipe.season);

    // Cuisine
    if (recipe.cuisine) categories.push(recipe.cuisine);

    // Difficulty
    if (recipe.difficulty) categories.push(recipe.difficulty);

    // Dietary (array)
    if (recipe.dietary && Array.isArray(recipe.dietary)) {
        recipe.dietary.forEach(diet => categories.push(diet));
    }

    // Length (if you have a length field, otherwise skip this part)
    if (recipe.length) categories.push(recipe.length);

    card.classList.add('card');
    card.id = `card${recipe.id}`;
    card.setAttribute('categories', categories.join(','));

    card.innerHTML = `
        <button class="btn clear favorite-btn" onclick="addToFavorites('card${recipe.id}')">
            <img id="favorButton" src="images/star.svg" width="50" height="50" alt="Favorite Star" />
        </button>
        <img src="images/${recipe.images[0]}" class="card-img-top img-fluid" alt="${recipe.name}" />
        <div class="card-body">
            <h5 class="card-title">${recipe.name}</h5>
            <p class="card-text">${recipe.steps[0]}</p>
            <a href="genericFood.html" class="btn btn-primary">Go to Recipe</a>
        </div>
    `;
    return card;
    }

  function displayPage(page) {
      CARD_CONTAINER.innerHTML = '';
      const start = (page - 1) * RECIPES_PER_PAGE;
      const end = start + RECIPES_PER_PAGE;
      const currentRecipes = allRecipes.slice(start, end);
      currentRecipes.forEach(recipe => {
          const card = createCard(recipe);
          CARD_CONTAINER.appendChild(card);
      });
      renderPaginationControls();
  }

  function renderPaginationControls() {
      let totalPages = Math.ceil(allRecipes.length / RECIPES_PER_PAGE);
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

  // Load recipe JSON
  fetch('recipe.json')
      .then(res => res.json())
      .then(data => {
          allRecipes = data;
          displayPage(currentPage);
      })
      .catch(err => console.error('Failed to load recipes:', err));
});