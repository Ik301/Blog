// Archive Card Title Centering - Calculate offset to center title in card
document.addEventListener('DOMContentLoaded', () => {
    const archiveCards = document.querySelectorAll('.archive-card');

    archiveCards.forEach(card => {
        const reveal = card.querySelector('.archive-card-reveal');
        if (reveal) {
            // Calculate offset: half of reveal height + half of margin-top
            const revealHeight = reveal.offsetHeight;
            const marginTop = parseFloat(getComputedStyle(reveal).marginTop) || 0;
            const offset = (revealHeight + marginTop) / 2;
            card.style.setProperty('--reveal-offset', `${offset}px`);
        }
    });
});

// Category filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterPills = document.querySelectorAll('.filter-pill');
    const archiveCardLinks = document.querySelectorAll('.archive-card-link');

    if (filterPills.length === 0) return; // Not on posts page

    filterPills.forEach(pill => {
        pill.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all filters
            filterPills.forEach(p => p.classList.remove('active'));

            // Add active class to clicked filter
            this.classList.add('active');

            const selectedCategory = this.getAttribute('data-category');

            // Show/hide posts based on category
            archiveCardLinks.forEach(link => {
                const card = link.querySelector('.archive-card');
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

// --- Da Vinci Network Animation (Pencil Sketch Effect) ---
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('sketchCanvas');
    if (!canvas) return; // Only run on home page

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let time = 0;

    // Mouse tracking
    let mouse = { x: null, y: null };
    const mouseRadius = 150;

    // Colors (Dark Academia palette)
    const dotColor = 'rgba(59, 42, 35, 0.4)';      // Espresso at 40%
    const lineColor = 'rgba(123, 75, 51, 0.15)';   // Wood at 15%

    // Configuration
    const config = {
        particleCount: 60,
        maxRadius: 2,
        minRadius: 1,
        baseSpeed: 0.05,          // Much slower base movement
        connectionDistance: 100,
        lineWidth: 0.5,
        mouseAttraction: 0.08     // Stronger gravitational pull
    };

    // Resize canvas to fill container
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Adjust particle count based on screen size
        config.particleCount = Math.floor((canvas.width * canvas.height) / 20000);
        config.particleCount = Math.max(40, Math.min(80, config.particleCount));

        initParticles();
    }

    // Particle class with organic movement
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * (config.maxRadius - config.minRadius) + config.minRadius;

            // Very slow base velocity
            this.vx = (Math.random() - 0.5) * config.baseSpeed;
            this.vy = (Math.random() - 0.5) * config.baseSpeed;

            // Unique offset for organic noise movement
            this.noiseOffsetX = Math.random() * 1000;
            this.noiseOffsetY = Math.random() * 1000;
        }

        update() {
            // Organic drift using sine waves (simulates perlin noise effect)
            const drift = 0.0003;  // Even slower drift
            this.vx += Math.sin(time * drift + this.noiseOffsetX) * 0.003;
            this.vy += Math.cos(time * drift + this.noiseOffsetY) * 0.003;

            // Stronger damping for very slow ambient movement
            this.vx *= 0.98;
            this.vy *= 0.98;

            // Mouse attraction (strong gravitational pull, speeds up near cursor)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseRadius && distance > 0) {
                    // Exponential force increase as particles get closer
                    const force = Math.pow((mouseRadius - distance) / mouseRadius, 1.5);
                    this.vx += (dx / distance) * force * config.mouseAttraction;
                    this.vy += (dy / distance) * force * config.mouseAttraction;
                }
            }

            // Clamp velocity (higher max when near mouse)
            const maxVel = config.baseSpeed * 3;
            this.vx = Math.max(-maxVel, Math.min(maxVel, this.vx));
            this.vy = Math.max(-maxVel, Math.min(maxVel, this.vy));

            // Update position
            this.x += this.vx;
            this.y += this.vy;

            // Soft edge wrapping (no harsh bouncing)
            const margin = 50;
            if (this.x < -margin) this.x = canvas.width + margin;
            if (this.x > canvas.width + margin) this.x = -margin;
            if (this.y < -margin) this.y = canvas.height + margin;
            if (this.y > canvas.height + margin) this.y = -margin;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.fill();
        }
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Draw connecting lines (constellation effect)
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    // Fade opacity based on distance (darker when closer, mimics pencil pressure)
                    const opacity = (1 - distance / config.connectionDistance) * 0.2;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(123, 75, 51, ${opacity})`;
                    ctx.lineWidth = config.lineWidth;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        time++;

        // Draw connections first (behind particles)
        drawConnections();

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    // Mouse event listeners
    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

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

// --- 3D Featured Carousel (Rotunda) ---
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return; // Only run on featured page

    const cards = track.querySelectorAll('.exhibit-card');
    if (cards.length === 0) return;

    function updateCardStates() {
        const trackRect = track.getBoundingClientRect();
        const centerX = trackRect.left + trackRect.width / 2;

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const distanceFromCenter = Math.abs(centerX - cardCenterX);
            const threshold = cardRect.width * 0.6;

            // Remove all state classes
            card.classList.remove('is-active', 'is-side', 'is-side-left', 'is-side-right');

            if (distanceFromCenter < threshold) {
                // Center card
                card.classList.add('is-active');
            } else {
                // Side cards
                card.classList.add('is-side');
                if (cardCenterX < centerX) {
                    card.classList.add('is-side-left');
                } else {
                    card.classList.add('is-side-right');
                }
            }
        });
    }

    // Scroll listener with requestAnimationFrame throttle
    let ticking = false;
    track.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateCardStates();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Tap-to-center for side cards (mobile and desktop)
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!card.classList.contains('is-active')) {
                // Don't follow link if clicking a side card - scroll it to center instead
                e.preventDefault();
                e.stopPropagation();
                card.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest'
                });
            }
            // If card is active, let the click bubble to the CTA link naturally
        });
    });

    // Initialize card states on load
    updateCardStates();

    // Also update on window resize
    window.addEventListener('resize', updateCardStates);
});