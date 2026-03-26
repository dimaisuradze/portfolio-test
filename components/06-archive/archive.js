export function initArchive() {
    const archiveMask = document.getElementById('archive-mask');
    const staggeredGrid = document.getElementById('staggered-grid');
    const footerContent = document.getElementById('footer-content');
    const archiveBlocks = document.querySelectorAll('.archive-block');
    const archiveBgPlate = document.getElementById('archive-bg-plate');

    if (!archiveMask || !staggeredGrid) return;

    // Optional column ordering (unchanged)
    const columnOrder = [3, 2, 3, 1, 3, 2, 1, 2, 1, 3, 2, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1];
    archiveBlocks.forEach((block, idx) => {
        block.setAttribute('data-col', columnOrder[idx] || 1);
    });

    const splitTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#archive-section",
            start: "top top",
            end: "+=850%",
            pin: "#archive-pin",
            scrub: 1,
            onUpdate: (self) => {
                // When scroll progress > 0.75 (i.e., nearing the closing phase), create particles if not yet created
                if (self.progress > 0.75 && !window.particlesCreated) {
                    initParticles();
                    window.particlesCreated = true;
                }
            }
        }
    });
    splitTl.call(() => {
        const video = document.getElementById('archive-video');
        if (video && video.paused) video.play().catch(e => console.warn('Video autoplay blocked', e));
    }, null, null, 0); // at the very start of the timeline


    // 1. OPENING: 50% -> 0%
    splitTl.fromTo(archiveMask,
        { clipPath: "inset(0% 50% 0% 50%)", webkitClipPath: "inset(0% 50% 0% 50%)" },
        { clipPath: "inset(0% 0% 0% 0%)", webkitClipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power3.inOut" }
    );

    // 2. SCROLL THE GRID – adjusted to end closer to the top
    splitTl.to(staggeredGrid, {
        y: () => -(staggeredGrid.offsetHeight - window.innerHeight * 0.8),
        ease: "none",
        duration: 5
    }, "-=0.5");

    // 3. STEALTH SWAP & PREP FOOTER
    splitTl.set(archiveBgPlate, { autoAlpha: 0 });
    if (footerContent) { splitTl.set(footerContent, { yPercent: 40 }); }

    // 4. CLOSING: 0% -> 50% & FOOTER PARALLAX
    splitTl.to(archiveMask, {
        clipPath: "inset(0% 50% 0% 50%)",
        webkitClipPath: "inset(0% 50% 0% 50%)",
        duration: 3,
        ease: "power3.inOut"
    }, "closePhase");

    if (footerContent) {
        splitTl.to(footerContent, {
            yPercent: 0,
            duration: 8,
            ease: "power3.out"
        }, "closePhase");
    }

    // Inside initArchive, after timeline creation
    splitTl.eventCallback("onComplete", () => {
        const doorGroup = document.getElementById('archive-door-group');
        if (doorGroup) doorGroup.style.pointerEvents = 'none';
    });

    // --- PARTICLE SYSTEM (VISIBLE) ---
    function initParticles() {
        const container = document.getElementById('ash-particles');
        if (!container) return;

        // Clear existing particles to avoid duplicates (safe)
        container.innerHTML = '';

        const PARTICLE_COUNT = 150; // more particles for density
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            particle.classList.add('ash-particle');

            // Random size between 2px and 5px
            const size = 2 + Math.random() * 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Random left position
            particle.style.left = `${Math.random() * 100}%`;

            // Random animation delay and duration
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${10 + Math.random() * 20}s`;

            // Slight random opacity (0.6 to 1)
            particle.style.opacity = 0.6 + Math.random() * 0.4;

            container.appendChild(particle);
        }
    }

    // Call after a short delay to ensure DOM is ready (optional, but safe)
    setTimeout(initParticles, 100);
}