// This function will clone a card to a destinate aka the favorite page
function addToFavorites(cardId) {
    // Get the card details dynamically using its ID
    const card = document.getElementById(cardId);
    const cardTitle = card.querySelector('.card-title').innerText;
    const cardImage = card.querySelector('.card-img-top').src;
    const recipeLink = card.querySelector('a').href;  // Get the "Go to Recipe" link

    // Check if the card is already in favorites
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const existingCard = favorites.find(fav => fav.id === cardId);

    if (!existingCard) {
        // If the card is not in the favorites, add it
        favorites.push({
            id: cardId,
            title: cardTitle,
            image: cardImage,
            link: recipeLink  // Store the link as well
        });

        // Save the updated favorites back to localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));

        alert(`${cardTitle} added to favorites!`);
    } else {
        alert(`${cardTitle} is already in your favorites.`);
    }
}

// This function is then used to display the cards favorated
function showFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    favoritesContainer.innerHTML = '';  // Clear the favorites container

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites.forEach(favorite => {
        // Create a new row for each favorite card
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('col-12', 'mb-4'); // Ensures it's one card per row with margin

        // Create a card div for the favorite
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.style.width = '18rem';

        // Dynamically build the card content (without the "Add to Favorites" button)
        cardDiv.innerHTML = `
            <img src="${favorite.image}" class="card-img-top" alt="${favorite.title}">
            <div class="card-body">
                <h5 class="card-title">${favorite.title}</h5>
                <p class="card-text">This is one of your favorite recipes.</p>
                <!-- Include the "Go to Recipe" button -->
                <a href="${favorite.link}" class="btn btn-primary">Go to Recipe</a>
                <!-- Add a remove button to each card -->
                <button class="btn btn-danger" onclick="removeFromFavorites('${favorite.id}')">Remove from Favorites</button>
            </div>
        `;

        // Append the card to the row
        rowDiv.appendChild(cardDiv);
        favoritesContainer.appendChild(rowDiv);
    });
}

// Self Explainatory, murder...I mean removes a card from the favorites
function removeFromFavorites(cardId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Filter out the card to be removed
    favorites = favorites.filter(fav => fav.id !== cardId);
    
    // Update localStorage with the new array of favorites
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Re-render the favorites page
    showFavorites();
}

// Show favorites automatically on page load
window.onload = function() {
    showFavorites();
};