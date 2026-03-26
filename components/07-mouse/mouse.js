export function initMouseTracker() {
    if (!window.isDesktop || !window.isDesktop.matches) return;

    const tooltip = document.getElementById('cursor-tooltip');
    const tooltipText = document.getElementById('tooltip-text');
    const floatingImageEl = document.getElementById('floating-project-image');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const speed = 0.2;

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    const updatePositions = () => {
        pos.x += (mouse.x - pos.x) * speed;
        pos.y += (mouse.y - pos.y) * speed;

        if (tooltip) {
            tooltip.style.transform = `translate3d(${pos.x + 15}px, ${pos.y + 15}px, 0)`;
        }

        if (floatingImageEl && window.isHoveringRow) {
            floatingImageEl.style.transform = `translate3d(${pos.x + 20}px, ${pos.y + 20}px, 0)`;
        }

        // Marquee tooltip: show only when over .mq-item
        if (tooltip && window.isDesktop.matches) {
            const hitEl = document.elementFromPoint(mouse.x, mouse.y);
            const hoveredItem = hitEl?.closest('.mq-item');
            if (hoveredItem) {
                if (!tooltip.classList.contains('is-visible')) {
                    tooltip.classList.add('is-visible');
                }
                const context = hoveredItem.getAttribute('data-context');
                if (context && tooltipText.textContent !== context) {
                    tooltipText.textContent = context;
                }
            } else {
                if (tooltip.classList.contains('is-visible')) {
                    tooltip.classList.remove('is-visible');
                }
            }
        }

        requestAnimationFrame(updatePositions);
    };

    requestAnimationFrame(updatePositions);
}