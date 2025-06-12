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

// --- Mobile Menu Toggle Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuClose = document.getElementById('menu-close');
    const navLinks = mobileMenu.querySelectorAll('.nav-link');

    if (menuToggle && mobileMenu && menuClose) {
        // Function to open the menu
        const openMenu = () => {
            mobileMenu.classList.add('is-open');
            document.body.classList.add('no-scroll');
        };

        // Function to close the menu
        const closeMenu = () => {
            mobileMenu.classList.remove('is-open');
            document.body.classList.remove('no-scroll');
        };

        // Event listeners
        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);

        // Also close the menu if a nav link is clicked (good UX)
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
});