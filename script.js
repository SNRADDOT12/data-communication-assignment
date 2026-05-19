/* ═══════════════════════════════════════════════════════════════
   DATA COMMUNICATION ASSIGNMENT — MAIN JAVASCRIPT
   Author: Student Name
   Description: All interactivity, animations, and dynamic features
═══════════════════════════════════════════════════════════════ */

/* ── Wait for DOM to be fully loaded ──────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

    // ── 1. AOS (Animate On Scroll) Initialisation ─────────────────
    AOS.init({
        duration: 750,
        once: true,
        offset: 80,
        easing: 'ease-out-cubic',
    });


    // ── 2. NAVBAR — Scroll shadow & active state ──────────────────
    const navbar = document.getElementById('navbar');

    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });


    // ── 3. HAMBURGER MENU — Toggle mobile drawer ──────────────────
    const hamburger = document.getElementById('hamburger');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const navLinks = document.getElementById('nav-links');

    const toggleMenu = () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        // Swap icon between bars and X
        hamburgerIcon.classList.toggle('fa-bars', !isOpen);
        hamburgerIcon.classList.toggle('fa-times', isOpen);
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close mobile menu when any nav link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
            hamburgerIcon.classList.add('fa-bars');
            hamburgerIcon.classList.remove('fa-times');
        });
    });


    // ── 4. ACTIVE NAV LINK — Highlight based on scroll position ───
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all links
                allNavLinks.forEach(link => link.classList.remove('active'));
                // Add active to matching link
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));


    // ── 5. TYPING ANIMATION — Hero name typewriter effect ─────────
    const typedNameEl = document.getElementById('typed-name');
    // ↓↓ Replace this with your actual full name ↓↓
    const fullName = 'ADDOTEY VINCENT';
    let charIndex = 0;
    let isDeleting = false;
    let typingPaused = false;

    const typeCharacter = () => {
        if (typingPaused) return;

        if (!isDeleting && charIndex <= fullName.length) {
            // Typing forward
            typedNameEl.textContent = fullName.slice(0, charIndex);
            charIndex++;
            if (charIndex > fullName.length) {
                // Pause at full name, then stop (no delete — keep name visible)
                typingPaused = true;
                return;
            }
            setTimeout(typeCharacter, 95);
        }
    };

    // Start typing after a short delay for cinematic effect
    setTimeout(typeCharacter, 800);


    // ── 6. CANVAS PARTICLE ANIMATION — Hero background ────────────
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    // Resize canvas to fill hero section
    const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // Particle constructor
    const createParticle = () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
    });

    // Initialise particle array
    const initParticles = () => {
        const count = Math.floor((canvas.width * canvas.height) / 14000);
        particles = Array.from({ length: Math.min(count, 90) }, createParticle);
    };

    initParticles();

    // Draw one frame
    const drawParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            // Move particle
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(96,165,250,${p.opacity})`;
            ctx.fill();

            // Draw connecting lines to nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dist = Math.hypot(p.x - q.x, p.y - q.y);
                if (dist < 130) {
                    const alpha = (1 - dist / 130) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(96,165,250,${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        });

        animFrame = requestAnimationFrame(drawParticles);
    };

    drawParticles();


    // ── 7. BACK TO TOP BUTTON ─────────────────────────────────────
    const backToTopBtn = document.getElementById('back-to-top');

    const handleBackToTop = () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleBackToTop, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ── 8. FOOTER YEAR — Auto-update copyright year ───────────────
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    // ── 9. TOPIC CARD HOVER — Subtle entrance observer ────────────
    // Adds a CSS class when a topic card enters the viewport
    const topicCards = document.querySelectorAll('.topic-card');

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.15 });

    topicCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        cardObserver.observe(card);
    });


    // ── 10. SMOOTH SCROLL for all anchor links ─────────────────────
    // Ensures links always account for the sticky navbar height
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;
            e.preventDefault();
            const navHeight = navbar.offsetHeight;
            const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 10;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        });
    });

}); // end DOMContentLoaded