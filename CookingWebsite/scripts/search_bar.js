document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  let query = urlParams.get('query') || ''; // Get the search query from the URL, default to an empty string if not found
  const selectedCategories = new Set(); // For storing selected categories

  // Elements
  const searchInput = document.getElementById('search-input');
  const categoryFilters = document.querySelectorAll('.category-filter');
  const cards = document.querySelectorAll('.card');

  // Update URL with the new query parameters (search or filters)
  function updateUrlParams() {
    const params = new URLSearchParams();

    if (query) {
      params.set('query', query); // Add the search query to the URL (if there is one)
    }

    categoryFilters.forEach(filter => {
      if (filter.checked) {
        params.append('category', filter.value); // Append each selected category to the URL
      }
    });

    // Update the URL without reloading the page
    const newUrl = window.location.pathname + '?' + params.toString();
    window.history.pushState({ path: newUrl }, '', newUrl);
  }

  // Function to filter cards based on search and selected categories
  function filterCards() {
    const queryLower = query.toLowerCase(); // Case-insensitive matching for search
    const queryRegex = new RegExp('^' + queryLower, 'i'); // Starts with query (case-insensitive)

    cards.forEach(card => {
      const recipeName = card.querySelector('h5').textContent.toLowerCase();
      const cardCategories = card.getAttribute('categories').split(',').map(c => c.trim()); // Split categories and trim spaces

      const matchesSearch = queryRegex.test(recipeName); // Check if the recipe name matches the search query
      const matchesCategory = cardCategories.some(category => selectedCategories.has(category)); // Check if any of the selected categories match

      // Display or hide the card based on the search and category filter results
      if ((query && matchesSearch || !query) && (selectedCategories.size === 0 || matchesCategory)) {
        card.style.display = '';  // Show the card
      } else {
        card.style.display = 'none';  // Hide the card
      }
    });
  }

  // Event listener for search input to trigger filter on change
  searchInput.addEventListener('input', function () {
    query = searchInput.value; // Update query variable as the search input changes
    updateUrlParams(); // Update the URL with the new search query
    filterCards(); // Re-filter the cards immediately based on the new query
  });

  // Event listener for category filters (check/uncheck category boxes)
  categoryFilters.forEach(filter => {
    filter.addEventListener('change', function () {
      // Update the selected categories based on which checkboxes are checked
      if (this.checked) {
        selectedCategories.add(this.value); // Add selected category
      } else {
        selectedCategories.delete(this.value); // Remove unselected category
      }
      updateUrlParams(); // Update the URL with the new filter parameters
      filterCards(); // Apply the new category filter immediately
    });
  });

  // On page load, check for query and category filters in the URL and pre-fill the input/filters
  if (query) {
    searchInput.value = query; // Pre-fill the search input with the query from the URL
  }

  // Set selected categories based on URL filters
  const urlCategories = urlParams.getAll('category');
  urlCategories.forEach(category => {
    selectedCategories.add(category);
    // Check the corresponding category filter checkboxes
    categoryFilters.forEach(filter => {
      if (filter.value === category) {
        filter.checked = true;
      }
    });
  });

  // Initial filtering of cards when the page is loaded (based on URL query and selected categories)
  filterCards();
});