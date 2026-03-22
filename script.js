document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 0. PROCEDURAL INFINITE MARQUEE TREADMILL
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
            logos.forEach(logo => {
                const clone = logo.cloneNode(true);
                track.appendChild(clone);
            });
            currentWidth += totalWidth;
        }

        let currentX = 0;
        const speed = 1.0; // Adjust speed here

        const animateMarquee = () => {
            currentX -= speed;
            if (Math.abs(currentX) >= totalWidth) {
                currentX = 0;
            }
            track.style.transform = `translate3d(${currentX}px, 0, 0)`;
            requestAnimationFrame(animateMarquee);
        };

        let isPaused = false;
        track.addEventListener('mouseenter', () => isPaused = true);
        track.addEventListener('mouseleave', () => isPaused = false);

        const loopMarquee = () => {
            if (!isPaused) animateMarquee();
            else requestAnimationFrame(loopMarquee);
        };

        animateMarquee();
    }

    // ==========================================
    // 1. EMAIL OBFUSCATION
    // ==========================================
    const emailLink = document.getElementById('secure-email');
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `mailto:hello@mylastname.eu`; // Update this later
        });
    }

    // ==========================================
    // 2. THE FLOATING & ACCORDION ENGINE
    // ==========================================
    const projectList = document.getElementById('project-list');

    // We only run this if the project list exists
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
                let x = latest.pageX + 20;
                let y = latest.pageY + 20;

                if (latest.clientX + 20 + floatWidth > window.innerWidth) x = latest.pageX - floatWidth - 20;
                if (latest.clientY + 20 + floatHeight > window.innerHeight) y = latest.pageY - floatHeight - 20;

                floatEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                inputBuffer = [];
            }
            isTicking = false;
        };

        projectList.addEventListener('mouseover', (e) => {
            const targetRow = e.target.closest('.project-row');
            if (!targetRow || targetRow.classList.contains('is-open')) return;

            const id = targetRow.dataset.id;
            activeStack = imageStacks[id];
            floatEl.appendChild(activeStack);
            activeStack.classList.add('is-active');

            cancelAnimationFrame(animationReq);
            animationReq = requestAnimationFrame(renderStopMotion);
            floatEl.classList.add('is-visible');

            if (hoverController) hoverController.abort();
            hoverController = new AbortController();

            targetRow.addEventListener('pointermove', (event) => {
                inputBuffer.push({ pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY });
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

            cancelAnimationFrame(animationReq);
            animationReq = requestAnimationFrame(renderStopMotion);
        });
    }

    // ==========================================
    // 3. THE TYPOGRAPHIC TICKER (Movie Credits Fix)
    // ==========================================
    const archiveTrack = document.getElementById('archive-track');

    if (archiveTrack) {
        const originalList = archiveTrack.querySelector('.archive-list');

        // Clone the list for infinite looping
        const clone = originalList.cloneNode(true);
        archiveTrack.appendChild(clone);

        let currentY = 0;
        const scrollSpeed = 0.5; // Smooth slow scroll
        let isArchivePaused = false;

        const animateArchive = () => {
            if (!isArchivePaused) {
                currentY -= scrollSpeed;

                // Get exact height dynamically (Fixes the font-loading bug)
                const listHeight = originalList.getBoundingClientRect().height;

                // Reset loop seamlessly
                if (Math.abs(currentY) >= listHeight && listHeight > 0) {
                    currentY = 0;
                }

                archiveTrack.style.transform = `translate3d(0, ${currentY}px, 0)`;
            }
            requestAnimationFrame(animateArchive);
        };

        // Pause on hover
        archiveTrack.addEventListener('mouseenter', () => isArchivePaused = true);
        archiveTrack.addEventListener('mouseleave', () => isArchivePaused = false);

        // Wait a split second to ensure fonts/CSS are loaded before starting
        setTimeout(() => {
            animateArchive();
        }, 100);
    }
});