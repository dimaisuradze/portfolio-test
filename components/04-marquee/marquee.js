export function initMarquee() {
    const marqueeInner = document.getElementById('marquee-inner');
    const marqueeContainer = document.querySelector('.marquee');
    const tooltip = document.getElementById('cursor-tooltip');
    const tooltipText = document.getElementById('tooltip-text');

    // Duplicate nodes for infinite loop
    if (marqueeInner) {
        Array.from(marqueeInner.children).forEach(child => {
            marqueeInner.appendChild(child.cloneNode(true));
        });
    }

    // Hover Logic
    if (marqueeContainer && window.isDesktop && window.isDesktop.matches) {
        marqueeContainer.addEventListener('mouseenter', () => {
            window.isHoveringMarquee = true;
            if (tooltip) {
                tooltip.classList.add('is-visible');
                if (tooltipText && tooltipText.textContent === "") {
                    tooltipText.textContent = "ARCHIVE";
                }
            }
        });
        marqueeContainer.addEventListener('mouseleave', () => {
            window.isHoveringMarquee = false;
            if (tooltip) tooltip.classList.remove('is-visible');
        });
    }
}