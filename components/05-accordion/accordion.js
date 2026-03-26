export function initAccordion() {
    let stopMotionInterval = null;
    const floatingImageEl = document.getElementById('floating-project-image');
    const tooltip = document.getElementById('cursor-tooltip');

    document.querySelectorAll('.project-row').forEach(row => {
        const animatedBgSrc = row.dataset.bg;
        const visualContainer = row.querySelector('.grid-visual');

        // 1. Inject Video
        const parallaxVideo = document.createElement('video');
        parallaxVideo.className = 'parallax-bg-img';
        parallaxVideo.muted = true; parallaxVideo.loop = true;
        parallaxVideo.playsInline = true; parallaxVideo.preload = 'none';
        parallaxVideo.src = animatedBgSrc;
        parallaxVideo.setAttribute('aria-hidden', 'true');
        if (visualContainer) visualContainer.appendChild(parallaxVideo);

        // 2. GSAP Parallax
        gsap.fromTo(parallaxVideo,
            { yPercent: 0, scale: 1.05 },
            {
                yPercent: -15, scale: 1.05, ease: "none",
                scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true }
            }
        );

        // 3. Desktop Hover Logic
        if (window.isDesktop && window.isDesktop.matches) {
            const stillImages = row.dataset.images ? row.dataset.images.split(',') : [];
            let floatStack = null;
            if (stillImages.length) {
                floatStack = document.createElement('div');
                floatStack.className = 'img-stack';
                stillImages.forEach((src, idx) => {
                    const img = document.createElement('img');
                    img.src = src; img.decoding = 'async';
                    if (idx === 0) img.classList.add('is-active');
                    floatStack.appendChild(img);
                });
            }

            row.addEventListener('mouseenter', () => {
                window.isHoveringRow = true;
                if (!row.classList.contains('is-open') && floatStack && floatingImageEl) {
                    floatingImageEl.textContent = '';
                    floatingImageEl.appendChild(floatStack);
                    floatingImageEl.classList.add('is-visible');
                    if (tooltip) tooltip.style.opacity = '0';

                    let currentFrame = 0;
                    const frames = floatStack.querySelectorAll('img');
                    clearInterval(stopMotionInterval);
                    stopMotionInterval = setInterval(() => {
                        frames.forEach(f => f.classList.remove('is-active'));
                        frames[currentFrame].classList.add('is-active');
                        currentFrame = (currentFrame + 1) % frames.length;
                    }, 350);
                }
            });

            row.addEventListener('mouseleave', () => {
                window.isHoveringRow = false;
                if (floatingImageEl) floatingImageEl.classList.remove('is-visible');
                clearInterval(stopMotionInterval);
                if (tooltip) tooltip.style.opacity = '';
            });
        }

        // 4. Click to Open Logic
        row.addEventListener('click', () => {
            const isOpen = row.classList.contains('is-open');
            const btn = row.querySelector('.row-header');
            const content = row.querySelector('.row-content');

            // Close others
            document.querySelectorAll('.project-row.is-open').forEach(r => {
                const vid = r.querySelector('video.parallax-bg-img');
                const siblingBtn = r.querySelector('.row-header');
                const siblingContent = r.querySelector('.row-content');
                if (vid) vid.pause();
                r.classList.remove('is-open');
                if (siblingBtn) siblingBtn.setAttribute('aria-expanded', 'false');
                if (siblingContent) siblingContent.setAttribute('aria-hidden', 'true');
            });

            if (!isOpen) {
                row.classList.add('is-open');
                if (btn) btn.setAttribute('aria-expanded', 'true');
                if (content) content.setAttribute('aria-hidden', 'false');
                parallaxVideo.play().catch(e => { });
                if (floatingImageEl) floatingImageEl.classList.remove('is-visible');
                clearInterval(stopMotionInterval);
            }

            if (content) {
                const onEnd = (e) => {
                    if (e.propertyName === 'grid-template-rows') {
                        content.removeEventListener('transitionend', onEnd);
                        ScrollTrigger.refresh();
                    }
                };
                content.addEventListener('transitionend', onEnd);
            }
        });
    });
}