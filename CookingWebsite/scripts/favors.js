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
        cardDiv.id = favorite.id;

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


// // This function is used to display the filtered cards on the favorites page
// function filterFavorites() {
//     const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
//     const selectedCategories = new Set();

//     document.querySelectorAll('.category-filter:checked').forEach(filter => {
//         selectedCategories.add(filter.value);
//     });

//     favorites.forEach(favorite => {
//         const cardCategories = favorite.categories ? favorite.categories.split(',') : [];
//         const matchesCategory = selectedCategories.size === 0 || cardCategories.some(category => selectedCategories.has(category.trim()));

//         const cardElement = document.getElementById(favorite.id);
//         if (!cardElement) return;
//         const starBtn = cardElement.querySelector(`#favorButton${favorite.id.replace('card', '')}`);

//         if (matchesCategory) {
//             cardElement.style.display = '';
//         } else {
//             cardElement.style.display = 'none';
//         }

//         if (starBtn) {
//             if (favorite.favorited) {
//                 starBtn.src = "images/smiley_star.svg";
//             } else {
//                 starBtn.src = "images/star.svg";
//             }
//         }
//     });
// }

// // function filterFavorites() {
// //     const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
// //     const selectedCategories = new Set();

// //     // Get all checked checkboxes (category filters)
// //     document.querySelectorAll('.category-filter:checked').forEach(filter => {
// //         selectedCategories.add(filter.value);
// //     });

// //     // Loop through all favorites and display or hide based on category matching
// //     favorites.forEach(favorite => {
// //         const cardCategories = favorite.categories ? favorite.categories.split(',') : [];
        
        
// //         // Check if any category matches the selected categories
// //         const matchesCategory = selectedCategories.size === 0 || cardCategories.some(category => selectedCategories.has(category.trim()));

// //         // Find the card element for this favorite
// //         const cardElement = document.getElementById(favorite.id);

// //         if (!cardElement) return;

// //         // const starBtn = cardElement.querySelector(`#favorButton${favorite.id.charAt(favorite.id.length - 1)}`); // Dynamically select the button
// //         const starBtn = cardElement.querySelector(`#favorButton${favorite.id.replace('card', '')}`);

// //         if (cardElement) {
// //             // Show or hide card based on category filter
// //             if (matchesCategory) {
// //                 cardElement.style.display = '';  // Show card
// //             } else {
// //                 cardElement.style.display = 'none';  // Hide card
// //             }

// //             // Update the star image based on the favorited status
// //             if (favorite.favorited) {
// //                 starBtn.src = "images/smiley_star.svg"; // Filled star
// //             } else {
// //                 starBtn.src = "images/star.svg"; // Empty star
// //             }
// //         }
// //     });
// // }

// // Function to load the favorites from localStorage and render them on the page
// function showFavorites() {
//     const favoritesContainer = document.getElementById('favorites-container');
//     favoritesContainer.innerHTML = '';  // Clear the favorites container

//     const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

//     favorites.forEach(favorite => {
//         // Create a card div for the favorite
//         const cardDiv = document.createElement('div');
//         cardDiv.classList.add('card');
//         cardDiv.id = favorite.id; // Set the card's ID
//         cardDiv.innerHTML = `
//             <img src="${favorite.image}" class="card-img-top" alt="${favorite.title}">
//             <div class="card-body">
//                 <h5 class="card-title">${favorite.title}</h5>
//                 <p class="card-text">This is one of your favorite recipes.</p>
//                 <a href="${favorite.link}" class="btn btn-primary">Go to Recipe</a>
//                 <button class="btn btn-danger" onclick="removeFromFavorites('${favorite.id}')">Remove from Favorites</button>
//             </div>
//         `;
//         cardDiv.setAttribute('categories', favorite.categories);
//         favoritesContainer.appendChild(cardDiv);
//     });

//     // After rendering, apply the category filters
//     filterFavorites();
// }

// // Function to remove a card from favorites
// function removeFromFavorites(cardId) {
//     let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
//     // Filter out the card to be removed
//     favorites = favorites.filter(fav => fav.id !== cardId);
    
//     // Update localStorage with the new array of favorites
//     localStorage.setItem('favorites', JSON.stringify(favorites));

//     // Re-render the favorites page
//     showFavorites();
// }

// // This function will clone a card to the favorites page
// function addToFavorites(cardId) {
//     // Get the card details dynamically using its ID
//     const card = document.getElementById(cardId);
//     const cardTitle = card.querySelector('.card-title').innerText;
//     const cardImage = card.querySelector('.card-img-top').src;
//     const recipeLink = card.querySelector('a').href;  // Get the "Go to Recipe" link
//     const cardCategories = card.getAttribute('categories'); // Get the categories from the card
//     const starBtn = card.querySelector(`#favorButton${cardId.replace('card', '')}`);

//     // Check if the card is already in favorites
//     let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
//     const existingCardIndex = favorites.findIndex(fav => fav.id === cardId);

//     if (existingCardIndex === -1) {
//         // If the card is not in the favorites, add it
//         // const cardTitle = card.querySelector('.card-title').innerText;
//         // const cardImage = card.querySelector('.card-img-top').src;
//         // const recipeLink = card.querySelector('a').href;
//         // const cardCategories = card.getAttribute('categories');
//         favorites.push({
//             id: cardId,
//             title: cardTitle,
//             image: cardImage,
//             link: recipeLink,  // Store the link as well
//             categories: cardCategories,  // Store the categories as well
//             favorited: true
//         });
//         // ${cardTitle} -> change its image
//         starBtn.src = "./images/smiley_star.svg";
//         // Save the updated favorites back to localStorage
        
//         // img.src = switch_img ? "../images/star.svg" : "../images/smiley_star.svg";
//         // img.setAttribute('favorButton', !switch_img);
//         // card.classList.add('favorited');
//     } else {
//         // // If it's already in favorites, remove it and mark as not favorite
//         favorites[existingCardIndex].favorited = !favorites[existingCardIndex].favorited;

//         // favorites = favorites.filter(fav => fav.id !== cardId); // Remove from favorites
//         // favorites.splice(existingCardIndex, 1);
//         // starBtn.src = "./images/star.svg";
        
//         if (favorites[existingCardIndex].favorited) {
//             starBtn.src = "./images/smiley_star.svg";
//         } else {
//             starBtn.src = "./images/star.svg";
//         }

//         // removeFromFavorites(cardId);
//     }

//     localStorage.setItem('favorites', JSON.stringify(favorites));
// }

// function syncFavoritesUI() {
//     const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

//     document.querySelectorAll('.card').forEach(card => {
//         const cardId = card.id;
//         const starBtn = card.querySelector(`#favorButton${cardId.replace('card', '')}`);
//         if (!starBtn) return;

//         const favoriteData = favorites.find(fav => fav.id === cardId);
        
//         if (favoriteData && favoriteData.favorited) {
//             starBtn.src = "./images/smiley_star.svg";
//         } else {
//             starBtn.src = "./images/star.svg";
//         }
//     });
// }




// // Event listener to apply the filter when a category checkbox is checked/unchecked
// document.querySelectorAll('.category-filter').forEach(filter => {
//     filter.addEventListener('change', function() {
//         filterFavorites();  // Trigger the filtering logic
//     });
// });

// // Show favorites automatically on page load, ONLY if favorites container exists
// window.onload = function() {
//     if (document.getElementById('favorites-container')) {
//         showFavorites();
//     }
//     syncFavoritesUI();
// };