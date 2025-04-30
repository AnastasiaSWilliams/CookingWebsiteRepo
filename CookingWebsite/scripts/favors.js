// This function is used to display the filtered cards on the favorites page
function filterFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const selectedCategories = new Set();

    document.querySelectorAll('.category-filter:checked').forEach(filter => {
        selectedCategories.add(filter.value);
    });

    favorites.forEach(favorite => {
        const cardCategories = favorite.categories ? favorite.categories.split(',') : [];
        const matchesCategory = selectedCategories.size === 0 || cardCategories.some(category => selectedCategories.has(category.trim()));

        const cardElement = document.getElementById(favorite.id);
        if (!cardElement) return;

        if (matchesCategory) {
            cardElement.style.display = '';
        } else {
            cardElement.style.display = 'none';
        }
    });
}

// Load favorites from localStorage and render
function showFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    if (!favoritesContainer) return;

    favoritesContainer.innerHTML = '';

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites.forEach(favorite => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.classList.add('bg-light');
        cardDiv.id = favorite.id;

        cardDiv.innerHTML = `
            <img src="${favorite.image}" class="card-img-top" alt="${favorite.title}">
            <div class="card-body">
                <h5 class="card-title">${favorite.title}</h5>
                <p class="card-text">${truncateStory(favorite.story)}</p>
                <a href="${favorite.link}" class="btn btn-primary">Go to Recipe</a>
                <button class="btn btn-danger" onclick="removeFromFavorites('${favorite.id}')">Remove from Favorites</button>
            </div>
        `;

        cardDiv.setAttribute('categories', favorite.categories);
        favoritesContainer.appendChild(cardDiv);
    });

    filterFavorites();
}

// Remove card from favorites
function removeFromFavorites(cardId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites = favorites.filter(fav => fav.id !== cardId);

    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
    syncFavoritesUI();
}

// Add or toggle a card in favorites
function addToFavorites(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const cardTitle = card.querySelector('.card-title')?.innerText || '';
    const cardImage = card.querySelector('.card-img-top')?.src || '';
    const recipeLink = card.querySelector('a')?.href || '#';
    const cardCategories = card.getAttribute('categories') || '';

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const existingCardIndex = favorites.findIndex(fav => fav.id === cardId);

    if (existingCardIndex === -1) {
        favorites.push({
            id: cardId,
            title: cardTitle,
            image: cardImage,
            link: recipeLink,
            categories: cardCategories,
            story: card.getAttribute('data-story') || '',
            favorited: true
        });
    } else {
        favorites[existingCardIndex].favorited = !favorites[existingCardIndex].favorited;

        if(!favorites[existingCardIndex].favorited) {
            favorites.splice(existingCardIndex, 1);
        }
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    syncFavoritesUI();
}

// Sync the star icons based on favorites
function syncFavoritesUI() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const favoriteIds = {};
    favorites.forEach(fav => {
        favoriteIds[fav.id] = fav.favorited;
    });

    document.querySelectorAll('.card').forEach(card => {
        const cardId = card.id;
        const starBtn = document.querySelector(`#favorButton${cardId.replace('card', '')}`);

        if (!starBtn) return;

        if (favoriteIds[cardId]) {
            starBtn.src = "images/smiley_star.svg"; // fixed path
        } else {
            starBtn.src = "images/star.svg"; // fixed path
        }
    });
}

// Refilter on checkbox change
document.querySelectorAll('.category-filter').forEach(filter => {
    filter.addEventListener('change', function () {
        filterFavorites();
    });
});

// Initialize favorites and stars on page load
window.onload = function () {
    if (document.getElementById('favorites-container')) {
        showFavorites();
    }
    syncFavoritesUI();
};

function truncateStory(fullStory, maxLength = 160) {
    if (!fullStory) return '';
    return fullStory.length > maxLength 
        ? fullStory.slice(0, maxLength).trim() + '...'
        : fullStory;
}