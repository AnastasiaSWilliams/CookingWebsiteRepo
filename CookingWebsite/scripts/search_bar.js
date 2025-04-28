function initSearchFiltering() {
    const urlParams = new URLSearchParams(window.location.search);
    let query = urlParams.get('query') || '';
    const selectedCategories = new Set();

    const searchInput = document.getElementById('search-input');
    const categoryFilters = document.querySelectorAll('.category-filter');

    function updateUrlParams() {
        const params = new URLSearchParams();
        if (query) params.set('query', query);
        categoryFilters.forEach(filter => {
            if (filter.checked) params.append('category', filter.value);
        });
        const newUrl = window.location.pathname + '?' + params.toString();
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    function applyFiltersAndSearch() {
        if (!window.allRecipes || !window.setFilteredRecipes) return;
    
        const queryLower = (searchInput?.value || '').toLowerCase();
        const selected = new Set();
        document.querySelectorAll('.category-filter:checked').forEach(filter => {
            selected.add(filter.value);
        });
    
        // ➡️ KEY: If no search and no filters, show everything
        if (queryLower.trim() === '' && selected.size === 0) {
            window.setFilteredRecipes(window.allRecipes);
            return;
        }
    
        // Otherwise, filter normally
        const newFiltered = window.allRecipes.filter(recipe => {
            const title = recipe.name.toLowerCase();
            const matchesSearch = title.includes(queryLower);
    
            const recipeCategories = [
                recipe.season,
                recipe.cuisine,
                recipe.difficulty,
                ...(recipe.dietary || []),
            ];
            const matchesCategories = [...selected].every(cat => recipeCategories.includes(cat));
    
            return matchesSearch && matchesCategories;
        });
    
        window.setFilteredRecipes(newFiltered);
    }

    searchInput?.addEventListener('input', () => {
        query = searchInput.value;
        updateUrlParams();
        applyFiltersAndSearch();
    });

    categoryFilters.forEach(filter => {
        filter.addEventListener('change', function () {
            if (this.checked) {
                selectedCategories.add(this.value);
            } else {
                selectedCategories.delete(this.value);
            }
            updateUrlParams();
            applyFiltersAndSearch();
        });
    });

    if (query) searchInput.value = query;

    const urlCategories = urlParams.getAll('category');
    urlCategories.forEach(category => {
        selectedCategories.add(category);
        categoryFilters.forEach(filter => {
            if (filter.value === category) filter.checked = true;
        });
    });

    applyFiltersAndSearch();
}

// Allow reinitializing after dynamic content is loaded
function reinitializeFiltering() {
    initSearchFiltering();
}

// First run
setTimeout(() => {
    initSearchFiltering();
}, 200);

// Mobile sidebar toggle
document.addEventListener('DOMContentLoaded', function () {
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const filterSidebar = document.querySelector('.filter-sidebar');

    if (filterToggleBtn && filterSidebar) {
        filterToggleBtn.addEventListener('click', function () {
            filterSidebar.classList.toggle('active');
            if (filterSidebar.classList.contains('active')) {
                filterToggleBtn.textContent = 'Hide Filters';
            } else {
                filterToggleBtn.textContent = 'Show Filters';
            }
        });
    }
});