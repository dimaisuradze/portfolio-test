export function initBioRouter() {
    const btnWork = document.getElementById('btn-work');
    const btnBio = document.getElementById('btn-bio');
    const bioSection = document.getElementById('bio-section');
    const workLayers = [
        document.getElementById('layer-hero'),
        document.getElementById('layer-marquee'),
        document.getElementById('layer-accordion'),
        document.getElementById('layer-archive')
    ];
    const menuOverlay = document.getElementById('fullscreen-menu');

    if (!btnWork || !btnBio || !bioSection || workLayers.some(layer => !layer)) {
        console.warn('Bio router missing required elements');
        return;
    }

    // Helper to close menu (reuse existing logic)
    const closeMenu = () => {
        menuOverlay.classList.remove('is-open');
        menuOverlay.setAttribute('aria-hidden', 'true');
        if (window.lenis) window.lenis.start();
    };

    // Switch to BIO
    btnBio.addEventListener('click', () => {
        // Update active states
        btnWork.classList.remove('is-active');
        btnBio.classList.add('is-active');

        // Hide work layers, show bio
        workLayers.forEach(layer => { layer.style.display = 'none'; });
        bioSection.style.display = 'block';

        // Force bio to be visible
        bioSection.classList.add('is-active');

        // Reset scroll position to top
        if (window.lenis) window.lenis.scrollTo(0, { immediate: true });

        // Close menu
        closeMenu();
    });

    // Switch to WORK
    btnWork.addEventListener('click', () => {
        // Update active states
        btnBio.classList.remove('is-active');
        btnWork.classList.add('is-active');

        // Hide bio, show work layers
        bioSection.style.display = 'none';
        bioSection.classList.remove('is-active');
        workLayers.forEach(layer => { layer.style.display = 'block'; });

        // Reset scroll and close menu
        if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
        closeMenu();

        // Refresh ScrollTrigger after layout change
        ScrollTrigger.refresh();
    });
}