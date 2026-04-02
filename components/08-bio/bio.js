export function initBioRouter() {
    // 1. Target all layers
    const bioSection = document.getElementById('bio-section');
    const flagshipLayer = document.getElementById('layer-flagship');
    
    const workLayers = [
        document.getElementById('layer-hero'),
        document.getElementById('layer-marquee'),
        flagshipLayer, 
        document.getElementById('layer-accordion'),
        document.getElementById('layer-archive')
    ];

    const menuOverlay = document.getElementById('fullscreen-menu');

    // --- CHANGE IS RIGHT HERE: ADDED .header-logo-mark ---
    const btnWorks = document.querySelectorAll('#btn-work, a[href="#work-section"], .header-logo-mark');
    // ----------------------------------------------------

    const btnBios = document.querySelectorAll('#btn-bio, #bio-nav-link');

    if (!bioSection) {
        console.warn('Bio router: bio-section not found.');
        return;
    }

    const closeMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.remove('is-open');
            menuOverlay.setAttribute('aria-hidden', 'true');
        }
        if (window.lenis) window.lenis.start();
    };

    const goToBio = (e, isInitial = false) => {
        if (e) e.preventDefault();
        document.getElementById('btn-work')?.classList.remove('is-active');
        document.getElementById('btn-bio')?.classList.add('is-active');
        workLayers.forEach(layer => { if (layer) layer.style.display = 'none'; });
        bioSection.style.display = 'block';
        setTimeout(() => { bioSection.classList.add('is-active'); }, 50);
        if (!isInitial) { window.history.pushState({ page: 'bio' }, '', '/bio'); }
        if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
        closeMenu();
        ScrollTrigger.refresh();
    };

    const goToWork = (e, isInitial = false) => {
        if (e) e.preventDefault();
        document.getElementById('btn-bio')?.classList.remove('is-active');
        document.getElementById('btn-work')?.classList.add('is-active');
        bioSection.classList.remove('is-active');
        bioSection.style.display = 'none';
        workLayers.forEach(layer => { if (layer) layer.style.display = 'block'; });
        if (!isInitial) { window.history.pushState({ page: 'work' }, '', '/'); }
        if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
        closeMenu();
        ScrollTrigger.refresh();
    };

    if (window.location.pathname === '/bio') {
        setTimeout(() => goToBio(null, true), 100);
    }

    window.addEventListener('popstate', (event) => {
        if (window.location.pathname === '/bio') { goToBio(null, true); } 
        else { goToWork(null, true); }
    });

    btnBios.forEach(btn => btn.addEventListener('click', goToBio));
    btnWorks.forEach(btn => btn.addEventListener('click', goToWork));
}