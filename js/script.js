// Category filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const categoryFilters = document.querySelectorAll('.category-filter');
    const postCards = document.querySelectorAll('.post-card');
    
    if (categoryFilters.length === 0) return; // Not on posts page
    
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all filters
            categoryFilters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            const selectedCategory = this.getAttribute('data-category');
            
            // Show/hide posts based on category
            postCards.forEach(card => {
                const postCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || postCategory === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});