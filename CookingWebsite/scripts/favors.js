// This function is used to display the filtered cards on the favorites page
function filterFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const selectedCategories = new Set();

    // Get all checked checkboxes (category filters)
    document.querySelectorAll('.category-filter:checked').forEach(filter => {
        selectedCategories.add(filter.value);
    });

    // Loop through all favorites and display or hide based on category matching
    favorites.forEach(favorite => {
        const cardCategories = favorite.categories ? favorite.categories.split(',') : [];
        
        // Check if any category matches the selected categories
        const matchesCategory = selectedCategories.size === 0 || cardCategories.some(category => selectedCategories.has(category.trim()));

        // Find the card element for this favorite and show/hide based on category filter
        const cardElement = document.getElementById(favorite.id);
        if (cardElement) {
            if (matchesCategory) {
                cardElement.style.display = '';  // Show card
            } else {
                cardElement.style.display = 'none';  // Hide card
            }
        }
    });
}

// Function to load the favorites from localStorage and render them on the page
function showFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    favoritesContainer.innerHTML = '';  // Clear the favorites container

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites.forEach(favorite => {
        // Create a card div for the favorite
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.id = favorite.id; // Set the card's ID
        cardDiv.innerHTML = `
            <img src="${favorite.image}" class="card-img-top" alt="${favorite.title}">
            <div class="card-body">
                <h5 class="card-title">${favorite.title}</h5>
                <p class="card-text">This is one of your favorite recipes.</p>
                <a href="${favorite.link}" class="btn btn-primary">Go to Recipe</a>
                <button class="btn btn-danger" onclick="removeFromFavorites('${favorite.id}')">Remove from Favorites</button>
            </div>
        `;
        cardDiv.setAttribute('categories', favorite.categories);
        favoritesContainer.appendChild(cardDiv);
    });

    // After rendering, apply the category filters
    filterFavorites();
}

// Function to remove a card from favorites
function removeFromFavorites(cardId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Filter out the card to be removed
    favorites = favorites.filter(fav => fav.id !== cardId);
    
    // Update localStorage with the new array of favorites
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Re-render the favorites page
    showFavorites();
}

// This function will clone a card to the favorites page
function addToFavorites(cardId) {
    // Get the card details dynamically using its ID
    const card = document.getElementById(cardId);
    const cardTitle = card.querySelector('.card-title').innerText;
    const cardImage = card.querySelector('.card-img-top').src;
    const recipeLink = card.querySelector('a').href;  // Get the "Go to Recipe" link
    const cardCategories = card.getAttribute('categories'); // Get the categories from the card

    // Check if the card is already in favorites
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const existingCard = favorites.find(fav => fav.id === cardId);

    if (!existingCard) {
        // If the card is not in the favorites, add it
        favorites.push({
            id: cardId,
            title: cardTitle,
            image: cardImage,
            link: recipeLink,  // Store the link as well
            categories: cardCategories  // Store the categories as well
        });

        // Save the updated favorites back to localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));

        alert(`${cardTitle} added to favorites!`);
    } else {
        alert(`${cardTitle} is already in your favorites.`);
    }
}

// Event listener to apply the filter when a category checkbox is checked/unchecked
document.querySelectorAll('.category-filter').forEach(filter => {
    filter.addEventListener('change', function() {
        filterFavorites();  // Trigger the filtering logic
    });
});

// Show favorites automatically on page load
window.onload = function() {
    showFavorites();
};