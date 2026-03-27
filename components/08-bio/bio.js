export function initBioRouter() {
    const btnWork = document.getElementById('btn-work');
    const btnBio = document.getElementById('btn-bio');
    
    const viewWork = document.getElementById('view-work');
    const viewBio = document.getElementById('bio-section');
    const menuOverlay = document.getElementById('fullscreen-menu');

    if (!btnWork || !btnBio || !viewWork || !viewBio) return;

    // Switch to BIO
    btnBio.addEventListener('click', () => {
        // 1. Update active states on menu
        btnWork.classList.remove('is-active');
        btnBio.classList.add('is-active');

        // 2. Hide Work, Show Bio
        viewWork.style.display = 'none';
        viewBio.classList.add('is-active');

        // 3. Reset scroll position to top
        if (window.lenis) window.lenis.scrollTo(0, { immediate: true });

        // 4. Close the menu overlay
        closeMenu(menuOverlay);
    });

    // Switch to WORK
    btnWork.addEventListener('click', () => {
        // 1. Update active states
        btnBio.classList.remove('is-active');
        btnWork.classList.add('is-active');

        // 2. Hide Bio, Show Work
        viewBio.classList.remove('is-active');
        setTimeout(() => {
            viewBio.style.display = 'none';
            viewWork.style.display = 'block';
            // Force GSAP to recalculate triggers since DOM changed
            ScrollTrigger.refresh();
        }, 500); // Wait for fade out

        // 3. Reset scroll and close menu
        if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
        closeMenu(menuOverlay);
    });
}

function closeMenu(menuOverlay) {
    menuOverlay.classList.remove('is-open');
    menuOverlay.setAttribute('aria-hidden', 'true');
    if (window.lenis) window.lenis.start(); 
}