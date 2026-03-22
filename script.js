document.addEventListener("DOMContentLoaded", () => {
    
    // 1. MARQUEE VELOCITY
    const initMarquee = () => {
        const inner = document.querySelector('.marquee__inner');
        const item = document.querySelector('.marquee__item');
        const clone = item.cloneNode(true);
        inner.appendChild(clone);
        
        const pixelsPerSecond = 80; 
        const duration = inner.offsetWidth / pixelsPerSecond;
        inner.style.animation = `scrollMarquee ${duration}s linear infinite`;
    };
    initMarquee();

    // 2. EMAIL OBFUSCATION
    const emailLink = document.getElementById('secure-email');
    const user = "hello";
    const domain = "mylastname.eu"; 
    emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `mailto:${user}@${domain}`;
    });

    // 3. THE ANTI-GRAVITY FLOATING ENGINE
    const projectList = document.getElementById('project-list');
    const rows = document.querySelectorAll('.project-row');
    
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-el';
    document.body.appendChild(floatEl);

    const imageStacks = {};
    
    // Preload all assets
    rows.forEach(row => {
        const id = row.dataset.id;
        const images = row.dataset.images.split(',');
        
        const stackContainer = document.createElement('div');
        stackContainer.className = 'img-stack';
        stackContainer.dataset.stackId = id;
        
        images.forEach(imgSrc => {
            const img = new Image();
            img.src = imgSrc; 
            img.loading = "eager"; 
            img.style.position = 'absolute';
            img.style.inset = '0';
            img.style.opacity = '0'; 
            stackContainer.appendChild(img);
        });
        
        floatEl.appendChild(stackContainer);
        imageStacks[id] = stackContainer;
    });

    // Scroll Ghosting Fix
    let scrollTimer;
    window.addEventListener('scroll', () => {
        document.body.setAttribute('data-scrolling', 'true');
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            document.body.removeAttribute('data-scrolling');
        }, 100);
    }, { passive: true });

    // The Interaction Loop
    let inputBuffer = [];
    let isTicking = false;
    let hoverController = null; 
    let activeStack = null;
    let stopMotionFrame = 0;
    let lastTime = 0;
    let animationReq;

    const renderPosition = () => {
        if (inputBuffer.length > 0) {
            const latest = inputBuffer[inputBuffer.length - 1];
            
            const floatWidth = floatEl.offsetWidth;
            const floatHeight = floatEl.offsetHeight;
            const padding = 20; 
            
            let x = latest.pageX + padding;
            let y = latest.pageY + padding;

            if (latest.clientX + padding + floatWidth > window.innerWidth) {
                x = latest.pageX - floatWidth - padding;
            }
            if (latest.clientY + padding + floatHeight > window.innerHeight) {
                y = latest.pageY - floatHeight - padding;
            }

            floatEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            inputBuffer = [];
        }
        isTicking = false;
    };

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

    projectList.addEventListener('mouseover', (e) => {
        const targetRow = e.target.closest('.project-row');
        if (!targetRow) return;

        const id = targetRow.dataset.id;
        
        document.querySelectorAll('.img-stack').forEach(stack => stack.classList.remove('is-active'));
        activeStack = imageStacks[id];
        activeStack.classList.add('is-active');
        
        stopMotionFrame = 0;
        lastTime = performance.now();
        cancelAnimationFrame(animationReq);
        animationReq = requestAnimationFrame(renderStopMotion);

        floatEl.classList.add('is-visible');

        if (hoverController) hoverController.abort();
        hoverController = new AbortController();

        targetRow.addEventListener('pointermove', (event) => {
            inputBuffer.push({ 
                pageX: event.pageX, pageY: event.pageY,
                clientX: event.clientX, clientY: event.clientY 
            });
            
            if (event.getCoalescedEvents) {
                const coalesced = event.getCoalescedEvents();
                coalesced.forEach(ce => inputBuffer.push({
                    pageX: ce.pageX, pageY: ce.pageY,
                    clientX: ce.clientX, clientY: ce.clientY
                }));
            }

            if (!isTicking) {
                requestAnimationFrame(renderPosition);
                isTicking = true;
            }
        }, { passive: true, signal: hoverController.signal });
    });

    projectList.addEventListener('mouseout', (e) => {
        const targetRow = e.target.closest('.project-row');
        if (!targetRow) return;

        if (!targetRow.contains(e.relatedTarget)) {
            floatEl.classList.remove('is-visible');
            cancelAnimationFrame(animationReq);
            activeStack = null;
            if (hoverController) hoverController.abort();
        }
    });
});