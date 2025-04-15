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
  
    function filterCards() {
        const cards = document.querySelectorAll('.card');
        const queryLower = query.toLowerCase();
        const queryRegex = new RegExp(queryLower, 'i');
        cards.forEach(card => {
            const recipeName = card.querySelector('h5')?.textContent.toLowerCase() || '';
            const rawCategories = card.getAttribute('categories') || "";
            const cardCategories = rawCategories.split(',').map(c => c.trim());
            const matchesSearch = queryRegex.test(recipeName);
            const matchesCategory = selectedCategories.size === 0 ||
            [...selectedCategories].every(selected => cardCategories.includes(selected));
            if ((query && matchesSearch || !query) && (selectedCategories.size === 0 || matchesCategory)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
        document.querySelector('.card-container')?.offsetHeight;
    }
  
    searchInput?.addEventListener('input', () => {
        query = searchInput.value;
        updateUrlParams();
        filterCards();
    });
  
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', function () {
            if (this.checked) {
                selectedCategories.add(this.value);
            } else {
                selectedCategories.delete(this.value);
            }
            updateUrlParams();
            filterCards();
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
  
    filterCards();
}
  
setTimeout(() => {
    initSearchFiltering();
}, 200);

// MOBILE FILTER SIDEBAR TOGGLE
document.addEventListener('DOMContentLoaded', function() {
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const filterSidebar = document.querySelector('.filter-sidebar');
  
    if (filterToggleBtn && filterSidebar) {
      filterToggleBtn.addEventListener('click', function () {
        filterSidebar.classList.toggle('active');
        // Optionally, update button text:
        if (filterSidebar.classList.contains('active')) {
          filterToggleBtn.textContent = 'Hide Filters';
        } else {
          filterToggleBtn.textContent = 'Show Filters';
        }
      });
    }
  });