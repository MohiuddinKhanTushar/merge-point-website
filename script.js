document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Intersection Observer for Bento Grid & Header ---
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

    // Observe bento items
    document.querySelectorAll('.bento-item').forEach(item => {
        revealObserver.observe(item);
    });

    // Observe the new section header
    const sectionHeader = document.querySelector('.section-header');
    if (sectionHeader) revealObserver.observe(sectionHeader);

    // --- 2. Main Scroll Animation Logic ---
window.addEventListener('scroll', () => {
    // We calculate based on the sticky section height, not the whole document 
    // to keep the timing consistent regardless of how many sections you add below.
    const scrollProp = window.scrollY / (window.innerHeight * 3); // 3 is from 400vh - 100vh
    
    const heroText = document.getElementById('hero-text');
    const partKnowledge = document.getElementById('text-knowledge');
    const partMerged = document.getElementById('text-merged');
    const logo = document.getElementById('logo-container');
    const sticky = document.querySelector('.sticky-container');
    const cards = Array.from(document.querySelectorAll('.icon-card'));

    // Phase 1: Text & Icons (0% - 30%)
    if (scrollProp < 0.3) {
        const knowledgeProg = Math.min(scrollProp / 0.1, 1);
        partKnowledge.style.opacity = knowledgeProg;

        const iconProg = Math.max(0, (scrollProp - 0.05) / 0.2);
        const easedIconProg = 1 - Math.pow(1 - iconProg, 3);
        
        const mergedProg = Math.max(0, (scrollProp - 0.15) / 0.1);
        partMerged.style.opacity = mergedProg;

        if (cards.length >= 6) {
            cards[0].style.transform = `translateX(${easedIconProg * 60}vw) rotate(8deg)`;
            cards[1].style.transform = `translateX(-${easedIconProg * 60}vw) rotate(-8deg)`;
            cards[2].style.transform = `translate(${easedIconProg * -40}vw, ${easedIconProg * 20}vh) rotate(5deg)`;
            cards[3].style.transform = `translate(${easedIconProg * 40}vw, ${easedIconProg * -20}vh) rotate(-5deg)`;
            cards[4].style.transform = `translateY(-${easedIconProg * 70}vh) rotate(-3deg)`;
            cards[5].style.transform = `translateY(-${easedIconProg * 70}vh) rotate(3deg)`;
        }
        
        const iconFade = Math.sin(iconProg * Math.PI);
        cards.forEach(card => card.style.opacity = iconFade);
        
        heroText.style.opacity = 1;
        logo.style.opacity = 0;
        logo.style.display = 'none'; // Keep hidden to allow text interaction
        sticky.style.transform = `translateY(0)`;
    } 
    // Phase 2: Zoom (30% - 80%)
    else if (scrollProp >= 0.3 && scrollProp < 0.8) {
        const progress = (scrollProp - 0.3) / 0.5; 
        const easedZoomProgress = progress * progress; 
        
        heroText.style.opacity = progress > 0.4 ? 0 : 1 - (progress * 2.5); 
        
        const scaleValue = 0.5 + (easedZoomProgress * 3.5); 
        
        logo.style.display = 'flex';
        logo.style.opacity = Math.min(progress * 2, 1);
        logo.style.transform = `scale(${scaleValue})`;
        
        cards.forEach(card => card.style.opacity = 0);
        sticky.style.transform = `translateY(0)`;
    } 
    // Phase 3: Final Exit (80%+)
    else {
        const finalExitProg = Math.min((scrollProp - 0.8) / 0.2, 1);
        sticky.style.transform = `translateY(-${finalExitProg * 100}vh)`;
        logo.style.opacity = 1 - finalExitProg;
        logo.style.transform = `scale(4)`;
    }
});
});