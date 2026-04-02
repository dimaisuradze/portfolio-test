export function initArchive() {
    const archiveSection = document.getElementById('archive-section');
    const archiveMask = document.getElementById('archive-mask');
    const staggeredGrid = document.getElementById('staggered-grid');
    const footerContent = document.getElementById('footer-content');
    const archiveBlocks = document.querySelectorAll('.archive-block');
    const archiveBgPlate = document.getElementById('archive-bg-plate');
    const doorGroup = document.getElementById('archive-door-group');

    if (!archiveMask || !staggeredGrid) return;

    // Apply column styling for the "staggered" look
    const columnOrder = [3, 2, 3, 1, 3, 2, 1, 2, 1, 3, 2, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1];
    archiveBlocks.forEach((block, idx) => {
        block.setAttribute('data-col', columnOrder[idx] || 1);
    });

    const splitTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#archive-section",
            start: "top top",
            end: "+=800%", // Controlled duration for better pacing
            pin: "#archive-pin",
            scrub: 1,
            onUpdate: (self) => {
                // Initialize particles as we approach the footer phase
                if (self.progress > 0.8 && !window.particlesCreated) {
                    initParticles();
                    window.particlesCreated = true;
                }
                
                // DYNAMIC POINTER EVENTS: 
                // If we are in the "opening" or "scrolling" phase, doors allow clicks.
                // If we are in the "footer" phase (progress > 0.9), doors become invisible to mouse.
                if (doorGroup) {
                    doorGroup.style.pointerEvents = self.progress > 0.9 ? 'none' : 'auto';
                }
            }
        }
    });

    // Start video on enter
    splitTl.call(() => {
        const video = document.getElementById('archive-video');
        if (video && video.paused) video.play().catch(e => {});
    }, null, null, 0);

    // 1. OPEN DOORS (0% to 100% visible)
    splitTl.fromTo(archiveMask,
        { clipPath: "inset(0% 50% 0% 50%)", webkitClipPath: "inset(0% 50% 0% 50%)" },
        { clipPath: "inset(0% 0% 0% 0%)", webkitClipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power3.inOut" }
    );

    // 2. SCROLL THE PROJECT GRID
    // We scroll until the very last project is seen
    splitTl.to(staggeredGrid, {
        y: () => -(staggeredGrid.scrollHeight - window.innerHeight * 0.7),
        ease: "none",
        duration: 6
    }, "-=0.5");

    // 3. TRANSITION TO FOOTER
    splitTl.set(archiveBgPlate, { autoAlpha: 0 });

    // 4. CLOSE DOORS & PARALLAX FOOTER UP
    splitTl.to(archiveMask, {
        clipPath: "inset(0% 50% 0% 50%)",
        webkitClipPath: "inset(0% 50% 0% 50%)",
        duration: 3,
        ease: "power3.inOut"
    }, "closePhase");

    if (footerContent) {
        splitTl.fromTo(footerContent, 
            { yPercent: 40, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 3, ease: "power3.out" }, 
            "closePhase"
        );
    }

    // --- PARTICLE SYSTEM ---
    function initParticles() {
        const container = document.getElementById('ash-particles');
        if (!container) return;
        container.innerHTML = '';
        const PARTICLE_COUNT = 100;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            particle.classList.add('ash-particle');
            const size = 1 + Math.random() * 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.animationDuration = `${10 + Math.random() * 20}s`;
            particle.style.opacity = 0.4 + Math.random() * 0.5;
            container.appendChild(particle);
        }
    }

    // REFRESH: Crucial for ensuring the grid height is calculated after injection
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);
}