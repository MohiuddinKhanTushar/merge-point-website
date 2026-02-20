const scrollPrompt = document.querySelector('.scroll-prompt');
const nav = document.getElementById('main-nav');
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links a');
let lastScrollY = window.scrollY;

// --- 1. MOBILE MENU LOGIC ---
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const isActive = menuToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : 'auto';
    });
}

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// --- 2. NAVIGATION & SCROLL PROMPT LOGIC ---
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Scroll Prompt Fade
    if (scrollPrompt) {
        if (currentScrollY > 50) {
            scrollPrompt.style.opacity = "0";
            scrollPrompt.style.pointerEvents = "none";
        } else {
            scrollPrompt.style.opacity = "0.6";
            scrollPrompt.style.pointerEvents = "auto";
        }
    }

    // Navigation Show/Hide (Only if mobile menu isn't open)
    if (!navLinksContainer.classList.contains('active')) {
        if (currentScrollY <= 10) {
            nav.classList.remove('nav-hidden');
            nav.style.background = "transparent";
            nav.style.boxShadow = "none";
        } 
        else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            nav.classList.add('nav-hidden');
        } 
        else if (currentScrollY < lastScrollY) {
            nav.classList.remove('nav-hidden');
            nav.style.background = "rgba(255, 255, 255, 0.8)";
            nav.style.backdropFilter = "blur(10px)";
            nav.style.webkitBackdropFilter = "blur(10px)";
            nav.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.03)";
        }
    }

    lastScrollY = currentScrollY;
});

document.addEventListener('DOMContentLoaded', () => {
    // --- 3. INTERSECTION OBSERVER ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' 
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                revealObserver.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.bento-item, .process-step, .section-header').forEach(item => {
        revealObserver.observe(item);
    });

    // --- 4. MAIN STICKY SCROLL ANIMATION ---
    window.addEventListener('scroll', () => {
        // Adjust animation scale for mobile (faster progression on smaller screens)
        const isMobile = window.innerWidth <= 768;
        const scrollMultiplier = isMobile ? 2.5 : 3; 
        const scrollProp = window.scrollY / (window.innerHeight * scrollMultiplier); 
        
        const heroText = document.getElementById('hero-text');
        const partKnowledge = document.getElementById('text-knowledge');
        const partMerged = document.getElementById('text-merged');
        const logo = document.getElementById('logo-container');
        const sticky = document.querySelector('.sticky-container');
        const cards = Array.from(document.querySelectorAll('.icon-card'));
        const particles = document.querySelector('.floating-elements');

        const logoMaxScale = isMobile ? 1.2 : 2.0; 

        // Particle Fade Out
        if (particles) {
            particles.style.opacity = Math.max(0, 1 - (scrollProp / 0.05));
        }

        // Phase 1: Text & Icons (0% - 30%)
        if (scrollProp < 0.3) {
            const knowledgeProg = Math.min(scrollProp / 0.1, 1);
            partKnowledge.style.opacity = knowledgeProg;

            const iconProg = Math.max(0, (scrollProp - 0.05) / 0.2);
            const easedIconProg = 1 - Math.pow(1 - iconProg, 3);
            
            const mergedProg = Math.max(0, (scrollProp - 0.15) / 0.1);
            partMerged.style.opacity = mergedProg;

            if (cards.length >= 6) {
                const spread = isMobile ? 40 : 60; // Narrower spread for mobile
                cards[0].style.transform = `translateX(${easedIconProg * spread}vw) rotate(8deg)`;
                cards[1].style.transform = `translateX(-${easedIconProg * spread}vw) rotate(-8deg)`;
                cards[2].style.transform = `translate(${easedIconProg * -30}vw, ${easedIconProg * 20}vh) rotate(5deg)`;
                cards[3].style.transform = `translate(${easedIconProg * 30}vw, ${easedIconProg * -20}vh) rotate(-5deg)`;
                cards[4].style.transform = `translateY(-${easedIconProg * 70}vh) rotate(-3deg)`;
                cards[5].style.transform = `translateY(-${easedIconProg * 70}vh) rotate(3deg)`;
            }
            
            const iconFade = Math.sin(iconProg * Math.PI);
            cards.forEach(card => card.style.opacity = iconFade);
            
            heroText.style.opacity = 1;
            logo.style.opacity = 0;
            logo.style.display = 'none'; 
            sticky.style.transform = `translateY(0)`;
        } 
        // Phase 2: Zoom to Fixed Point (30% - 80%)
        else if (scrollProp >= 0.3 && scrollProp < 0.8) {
            const progress = (scrollProp - 0.3) / 0.5; 
            const easedZoomProgress = progress * progress; 
            
            heroText.style.opacity = progress > 0.4 ? 0 : 1 - (progress * 2.5); 
            
            const scaleValue = 0.5 + (easedZoomProgress * (logoMaxScale - 0.5)); 
            
            logo.style.display = 'flex';
            logo.style.opacity = Math.min(progress * 2, 1);
            logo.style.transform = `scale(${scaleValue})`;
            
            cards.forEach(card => card.style.opacity = 0);
            sticky.style.transform = `translateY(0)`;
        } 
        // Phase 3: Hold Scale & Scroll Out (80%+)
        else {
            const finalExitProg = Math.min((scrollProp - 0.8) / 0.2, 1);
            sticky.style.transform = `translateY(-${finalExitProg * 100}vh)`;
            logo.style.transform = `scale(${logoMaxScale})`;
            logo.style.opacity = 1 - finalExitProg;
        }
    });
});