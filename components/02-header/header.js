export function initHeader() {
    const header = document.getElementById('brand-header');

    // Detached Header Logic
    if (header) {
        let isHeaderTicking = false;
        const detachThreshold = 80;

        window.addEventListener('scroll', () => {
            if (!isHeaderTicking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > detachThreshold) {
                        header.classList.add('is-detached');
                    } else {
                        header.classList.remove('is-detached');
                    }
                    isHeaderTicking = false;
                });
                isHeaderTicking = true;
            }
        }, { passive: true });
    }

    // Fullscreen Menu Toggle Logic
    const menuOverlay = document.getElementById('fullscreen-menu');
    const btnMenuDesktop = document.getElementById('btn-menu-desktop');
    const btnMenuMobile = document.getElementById('btn-menu-mobile');
    const btnCloseMenu = document.getElementById('btn-close-menu');

    const toggleMenu = () => {
        if (!menuOverlay) return;
        const isOpen = menuOverlay.classList.contains('is-open');

        if (isOpen) {
            menuOverlay.classList.remove('is-open');
            menuOverlay.setAttribute('aria-hidden', 'true');
            if (window.lenis) window.lenis.start();
        } else {
            menuOverlay.classList.add('is-open');
            menuOverlay.setAttribute('aria-hidden', 'false');
            if (window.lenis) window.lenis.stop();
        }
    };

    if (btnMenuDesktop) btnMenuDesktop.addEventListener('click', toggleMenu);
    if (btnMenuMobile) btnMenuMobile.addEventListener('click', toggleMenu);
    if (btnCloseMenu) btnCloseMenu.addEventListener('click', toggleMenu);
}