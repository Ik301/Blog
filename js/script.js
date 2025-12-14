// Category filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const categoryFilters = document.querySelectorAll('.category-filter');
    const postCardLinks = document.querySelectorAll('.post-card-link');

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
            postCardLinks.forEach(link => {
                const card = link.querySelector('.post-card');
                const postCategory = card.getAttribute('data-category');

                if (selectedCategory === 'all' || postCategory === selectedCategory) {
                    link.style.display = 'block';
                } else {
                    link.style.display = 'none';
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

// --- Floating Dots Animation ---
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('dotsCanvas');
    if (!canvas) return; // Only run on home page

    const ctx = canvas.getContext('2d');
    let dots = [];
    let animationFrameId;

    // Resize canvas to fill container
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initDots();
    }

    // Dot class
    class Dot {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 3 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
            ctx.fill();
        }
    }

    // Initialize dots
    function initDots() {
        dots = [];
        const numDots = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < numDots; i++) {
            dots.push(new Dot());
        }
    }

    // Draw connecting lines
    function drawLines() {
        const maxDistance = 150;
        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.4;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawLines();

        dots.forEach(dot => {
            dot.update();
            dot.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    // Initialize and start animation
    resizeCanvas();
    animate();

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationFrameId);
    });
});