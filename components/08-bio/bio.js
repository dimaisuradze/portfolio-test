export function initBioRouter() {
    // 1. Target all layers
    const bioSection = document.getElementById('bio-section');
    const flagshipLayer = document.getElementById('layer-flagship');
    
    // The "Work" world (Everything we hide when Bio is open)
    const workLayers = [
        document.getElementById('layer-hero'),
        document.getElementById('layer-marquee'),
        flagshipLayer, // Now included to fix the overlap issue
        document.getElementById('layer-accordion'),
        document.getElementById('layer-archive')
    ];

    const menuOverlay = document.getElementById('fullscreen-menu');
    const btnWorks = document.querySelectorAll('#btn-work, a[href="#work-section"]');
    const btnBios = document.querySelectorAll('#btn-bio, #bio-nav-link');

    if (!bioSection) {
        console.warn('Bio router: bio-section not found.');
        return;
    }

    // Helper: Close the menu and restart scrolling
    const closeMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.remove('is-open');
            menuOverlay.setAttribute('aria-hidden', 'true');
        }
        if (window.lenis) window.lenis.start();
    };

    // --- LOGIC: SWITCH TO BIO ---
    const goToBio = (e, isInitial = false) => {
        if (e) e.preventDefault();

        // Update menu active states
        document.getElementById('btn-work')?.classList.remove('is-active');
        document.getElementById('btn-bio')?.classList.add('is-active');

        // Hide Work, Show Bio
        workLayers.forEach(layer => { if (layer) layer.style.display = 'none'; });
        bioSection.style.display = 'block';

        setTimeout(() => {
            bioSection.classList.add('is-active');
        }, 50);

        // Update URL to /bio (only if not the first page load)
        if (!isInitial) {
            window.history.pushState({ page: 'bio' }, '', '/bio');
        }

        if (window.lenis) window.lenis.scrollTo(0, { immediate: true });

        closeMenu();
        ScrollTrigger.refresh();
    };

    // --- LOGIC: SWITCH TO WORK ---
    const goToWork = (e, isInitial = false) => {
        if (e) e.preventDefault();

        // Update menu active states
        document.getElementById('btn-bio')?.classList.remove('is-active');
        document.getElementById('btn-work')?.classList.add('is-active');

        // Hide Bio, Show Work
        bioSection.classList.remove('is-active');
        bioSection.style.display = 'none';
        workLayers.forEach(layer => { if (layer) layer.style.display = 'block'; });

        // Update URL to root / (only if not the first page load)
        if (!isInitial) {
            window.history.pushState({ page: 'work' }, '', '/');
        }

        if (window.lenis) window.lenis.scrollTo(0, { immediate: true });

        closeMenu();
        ScrollTrigger.refresh();
    };

    // 2. Initial Deep-Link Check (e.g. if someone types dimitri.maisuradze.eu/bio)
    if (window.location.pathname === '/bio') {
        // Wait slightly for components to be injected by main.js
        setTimeout(() => goToBio(null, true), 100);
    }

    // 3. Listen for Browser Back/Forward buttons
    window.addEventListener('popstate', (event) => {
        if (window.location.pathname === '/bio') {
            goToBio(null, true);
        } else {
            goToWork(null, true);
        }
    });

    // 4. Attach Event Listeners
    btnBios.forEach(btn => btn.addEventListener('click', goToBio));
    btnWorks.forEach(btn => btn.addEventListener('click', goToWork));
}