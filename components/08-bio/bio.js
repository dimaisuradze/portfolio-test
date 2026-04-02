export function initBioRouter() {
    // 1. Target ALL possible WORK and BIO buttons (Both Menu & Footer)
    const btnWorks = document.querySelectorAll('#btn-work, a[href="#work-section"]');
    const btnBios = document.querySelectorAll('#btn-bio, #bio-nav-link');

    const bioSection = document.getElementById('bio-section');
    const workLayers = [
        document.getElementById('layer-hero'),
        document.getElementById('layer-marquee'),
        document.getElementById('layer-accordion'),
        document.getElementById('layer-archive')
    ];
    const menuOverlay = document.getElementById('fullscreen-menu');

    if (!bioSection) {
        console.warn('Bio router: bio-section not found in DOM yet.');
        return;
    }

    // Helper to close menu
    const closeMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.remove('is-open');
            menuOverlay.setAttribute('aria-hidden', 'true');
        }
        if (window.lenis) window.lenis.start();
    };

    // --- Switch to BIO ---
    const goToBio = (e) => {
        e.preventDefault(); // STOPS the page from jumping up instantly

        // Update visual active states in menu
        const menuWorkBtn = document.getElementById('btn-work');
        const menuBioBtn = document.getElementById('btn-bio');
        if (menuWorkBtn) menuWorkBtn.classList.remove('is-active');
        if (menuBioBtn) menuBioBtn.classList.add('is-active');

        // Hide work layers, show bio
        workLayers.forEach(layer => { if (layer) layer.style.display = 'none'; });
        bioSection.style.display = 'block';

        // Slight timeout allows CSS to process the display:block before fading in
        setTimeout(() => {
            bioSection.classList.add('is-active');
        }, 50);

        // Reset scroll position to top using Lenis
        if (window.lenis) window.lenis.scrollTo(0, { immediate: true });

        closeMenu();
        ScrollTrigger.refresh(); // Tell GSAP the layout changed
    };

    // --- Switch to WORK ---
    const goToWork = (e) => {
        e.preventDefault(); // STOPS the page from jumping

        // Update visual active states in menu
        const menuWorkBtn = document.getElementById('btn-work');
        const menuBioBtn = document.getElementById('btn-bio');
        if (menuBioBtn) menuBioBtn.classList.remove('is-active');
        if (menuWorkBtn) menuWorkBtn.classList.add('is-active');

        // Hide bio, show work layers
        bioSection.classList.remove('is-active');
        bioSection.style.display = 'none';
        workLayers.forEach(layer => { if (layer) layer.style.display = 'block'; });

        // Reset scroll and close menu
        if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
        closeMenu();
        ScrollTrigger.refresh(); // Tell GSAP the layout changed
    };

    // 2. Attach the click events to ALL buttons found
    btnBios.forEach(btn => btn.addEventListener('click', goToBio));
    btnWorks.forEach(btn => btn.addEventListener('click', goToWork));
}