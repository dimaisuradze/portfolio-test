document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 0. TAB SWITCHING LOGIC (SPA)
    // ==========================================
    const btnWork = document.getElementById('btn-work');
    const btnBio = document.getElementById('btn-bio');
    const secWork = document.getElementById('work-section');
    const secBio = document.getElementById('bio-section');

    const switchTab = (showBtn, hideBtn, showSec, hideSec) => {
        hideBtn.classList.remove('is-active');
        showBtn.classList.add('is-active');

        hideSec.classList.remove('is-active');
        setTimeout(() => {
            showSec.classList.add('is-active');
        }, 50);
    };

    if (btnWork && btnBio) {
        btnWork.addEventListener('click', () => switchTab(btnWork, btnBio, secWork, secBio));
        btnBio.addEventListener('click', () => switchTab(btnBio, btnWork, secBio, secWork));
    }

    // ==========================================
    // 1. PROCEDURAL MARQUEE
    // ==========================================
    const track = document.getElementById('marquee-track');
    if (track) {
        const logos = Array.from(track.children);
        let totalWidth = 0;
        logos.forEach(logo => {
            const style = window.getComputedStyle(logo);
            const margin = parseFloat(style.marginRight);
            totalWidth += logo.offsetWidth + margin;
        });

        const requiredWidth = window.innerWidth * 2;
        let currentWidth = totalWidth;
        while (currentWidth < requiredWidth) {
            logos.forEach(logo => track.appendChild(logo.cloneNode(true)));
            currentWidth += totalWidth;
        }

        let currentX = 0;
        const speed = 1.0;
        let isPaused = false;

        const animateMarquee = () => {
            if (!isPaused) {
                currentX -= speed;
                if (Math.abs(currentX) >= totalWidth) currentX = 0;
                track.style.transform = `translate3d(${currentX}px, 0, 0)`;
            }
            requestAnimationFrame(animateMarquee);
        };

        track.addEventListener('mouseenter', () => isPaused = true);
        track.addEventListener('mouseleave', () => isPaused = false);
        animateMarquee();
    }

    // ==========================================
    // 2. EMAIL OBFUSCATION
    // ==========================================
    const emailLink = document.getElementById('secure-email');
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `mailto:hello@dimimaisuradze.eu`;
        });
    }

    // ==========================================
    // 3. FLOATING & ACCORDION ENGINE
    // ==========================================
    const projectList = document.getElementById('project-list');
    if (projectList) {
        const floatEl = document.createElement('div');
        floatEl.className = 'floating-el';
        document.body.appendChild(floatEl);

        const imageStacks = {};
        let activeStack = null;
        let stopMotionFrame = 0;
        let lastTime = 0;
        let animationReq;

        document.querySelectorAll('.project-row').forEach(row => {
            const id = row.dataset.id;
            const images = row.dataset.images.split(',');
            const stackContainer = document.createElement('div');
            stackContainer.className = 'img-stack';

            images.forEach(imgSrc => {
                const img = new Image();
                img.src = imgSrc;
                img.style.position = 'absolute';
                img.style.inset = '0';
                img.style.opacity = '0';
                stackContainer.appendChild(img);
            });
            imageStacks[id] = stackContainer;
        });

        const renderStopMotion = (time) => {
            if (!activeStack) return;
            if (time - lastTime > 300) {
                const imgs = activeStack.querySelectorAll('img');
                imgs.forEach(img => img.style.opacity = '0');
                imgs[stopMotionFrame].style.opacity = '1';
                stopMotionFrame = (stopMotionFrame + 1) % imgs.length;
                lastTime = time;
            }
            animationReq = requestAnimationFrame(renderStopMotion);
        };

        let inputBuffer = [];
        let isTicking = false;
        let hoverController = null;

        const renderPosition = () => {
            if (inputBuffer.length > 0) {
                const latest = inputBuffer[inputBuffer.length - 1];
                const floatWidth = floatEl.offsetWidth;
                const floatHeight = floatEl.offsetHeight;

                // FIXED to clientX/Y to immune scroll repaints
                let x = latest.clientX + 20;
                let y = latest.clientY + 20;

                if (latest.clientX + 20 + floatWidth > window.innerWidth) x = latest.clientX - floatWidth - 20;
                if (latest.clientY + 20 + floatHeight > window.innerHeight) y = latest.clientY - floatHeight - 20;

                floatEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                inputBuffer = [];
            }
            isTicking = false;
        };

        projectList.addEventListener('mouseover', (e) => {
            const targetRow = e.target.closest('.project-row');
            if (!targetRow || targetRow.classList.contains('is-open')) return;

            const id = targetRow.dataset.id;
            floatEl.innerHTML = '';

            activeStack = imageStacks[id];
            floatEl.appendChild(activeStack);
            activeStack.classList.add('is-active');
            stopMotionFrame = 0;

            cancelAnimationFrame(animationReq);
            animationReq = requestAnimationFrame(renderStopMotion);
            floatEl.classList.add('is-visible');

            if (hoverController) hoverController.abort();
            hoverController = new AbortController();

            targetRow.addEventListener('pointermove', (event) => {
                inputBuffer.push({ clientX: event.clientX, clientY: event.clientY });
                if (!isTicking) { requestAnimationFrame(renderPosition); isTicking = true; }
            }, { passive: true, signal: hoverController.signal });
        });

        projectList.addEventListener('mouseout', (e) => {
            const targetRow = e.target.closest('.project-row');
            if (!targetRow || targetRow.contains(e.relatedTarget)) return;
            floatEl.classList.remove('is-visible');
            if (hoverController) hoverController.abort();
        });

        projectList.addEventListener('click', (e) => {
            const targetRow = e.target.closest('.project-row');
            if (!targetRow) return;

            const id = targetRow.dataset.id;
            const gridVisual = targetRow.querySelector('.grid-visual');

            if (targetRow.classList.contains('is-open')) {
                targetRow.classList.remove('is-open');
                gridVisual.innerHTML = '';
                return;
            }

            document.querySelectorAll('.project-row').forEach(row => {
                row.classList.remove('is-open');
                const visual = row.querySelector('.grid-visual');
                if (visual) visual.innerHTML = '';
            });

            floatEl.classList.remove('is-visible');
            if (hoverController) hoverController.abort();

            targetRow.classList.add('is-open');
            activeStack = imageStacks[id];
            gridVisual.appendChild(activeStack);
            activeStack.classList.add('is-active');

            stopMotionFrame = 0;
            cancelAnimationFrame(animationReq);
            animationReq = requestAnimationFrame(renderStopMotion);
        });
    }

    // ==========================================
    // 4. ARCHIVE TICKER (Synced Native Scroll)
    // ==========================================
    const archiveWindow = document.getElementById('archive-window');
    const archiveTrack = document.getElementById('archive-track');

    if (archiveWindow && archiveTrack) {
        const originalList = archiveTrack.querySelector('.archive-list');
        const clone = originalList.cloneNode(true);
        archiveTrack.appendChild(clone);

        // Slowed down by 25%
        const scrollSpeed = 0.35;
        let isHoveringArchive = false;

        // High-precision tracker synced with actual browser scroll
        let currentScroll = 0;

        const animateArchive = () => {
            if (!isHoveringArchive) {
                currentScroll += scrollSpeed;

                // If we reach the bottom of the original list, teleport to top
                if (currentScroll >= originalList.offsetHeight) {
                    currentScroll = 0;
                }

                // Physically scrolls the div window
                archiveWindow.scrollTop = currentScroll;
            }
            requestAnimationFrame(animateArchive);
        };

        // When user hovers, we pause our auto-engine so they can manual scroll
        archiveWindow.addEventListener('mouseenter', () => {
            isHoveringArchive = true;
        });

        // When manual scrolling happens, we continuously sync our engine tracker 
        // to their exact scrollbar position so it doesn't jump when they leave
        archiveWindow.addEventListener('scroll', () => {
            if (isHoveringArchive) {
                currentScroll = archiveWindow.scrollTop;
            }
        });

        archiveWindow.addEventListener('mouseleave', () => {
            isHoveringArchive = false;
        });

        setTimeout(() => { animateArchive(); }, 200);
    }
});