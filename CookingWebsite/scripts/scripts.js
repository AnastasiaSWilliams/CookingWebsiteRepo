function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Autumn";
  return "Winter";
}

function showSeasonalPicks() {
  const season = getCurrentSeason();
  const seasonalContainer = document.getElementById("seasonal-container");
  const allCards = document.querySelectorAll(".card");

  allCards.forEach(card => {
      const categories = card.getAttribute("categories") || "";
      const cardCategories = categories.split(",").map(c => c.trim());

      if (cardCategories.includes(season)) {
          const clone = card.cloneNode(true);
          seasonalContainer.appendChild(clone);
      }
  });
}

window.addEventListener("DOMContentLoaded", showSeasonalPicks);














































/*    //Reason to believe old data but keeping it in case
document.addEventListener('DOMContentLoaded', function () { //Ensures the Javascript runs when the HTML page is fully loaded and not before, name of the event being listened to is 'DOMContentLoaded'

  const urlParams = new URLSearchParams(window.location.search); //creates an object called urlParams that is aimed at taking the string user types and puts it in the query
  const query = urlParams.get('query'); //where the query string is stored
  
  if (query) { //checks for query

    const searchInput = document.getElementById('search-input'); //sets the value of the query to searchinput by an id, prefilling the search box so the user knows what they typed
    searchInput.value = query; // Optionally, show the query in the search input field
    
    const cards = document.querySelectorAll('.card'); // Assuming all recipe cards have the class 'card', looks for all the elements in the card class

    // Function to filter cards based on search query
    function filterCards(query) {
      const queryLower = query.toLowerCase(); // Convert to lowercase for case-insensitive matching

      cards.forEach(card => {
        const recipeName = card.querySelector('h5').textContent.toLowerCase(); // Now we looked through all the cards we look for their h5 tags and match the strings with the one user typed

        if (recipeName.includes(queryLower)) { //This is the checker, checking to see if whether the string user typed matched anything with the card classes
          card.style.display = '';  // Show card if the recipe name matches the query
        } else {
          card.style.display = 'none';  // Hide card if it doesn't match
        }
      });
    }

    // Filter the cards if there's a query in the URL
    filterCards(query);
  }
});
*/