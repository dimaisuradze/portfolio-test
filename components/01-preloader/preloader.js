export function initPreloader(onCompleteCallback) {
    const preloader = document.getElementById('preloader');
    const counterElement = document.getElementById('preloader-counter');
    if (!preloader || !counterElement) return;

    // --- Enhanced Accessibility ---
    counterElement.setAttribute('role', 'progressbar');
    counterElement.setAttribute('aria-valuemin', '0');
    counterElement.setAttribute('aria-valuemax', '100');
    counterElement.setAttribute('aria-valuenow', '0');

    let currentProgress = 0;
    const steps = 50;           // number of increments
    const increment = 100 / steps; // linear increment per step
    const intervalTime = 20;    // ms per step => total 1000ms (steps * intervalTime)
    let step = 0;

    const preloaderInterval = setInterval(() => {
        step++;
        currentProgress = Math.min(step * increment, 100);
        counterElement.textContent = `[ ${Math.floor(currentProgress)}% ]`;
        counterElement.setAttribute('aria-valuenow', Math.floor(currentProgress));

        if (step >= steps) {
            clearInterval(preloaderInterval);
            counterElement.textContent = '[ 100% ]';
            counterElement.setAttribute('aria-valuenow', '100');

            // Start fade-out
            preloader.classList.add('is-hidden');
            preloader.setAttribute('aria-busy', 'false');

            // Wait for the fade transition to complete before callback
            const onTransitionEnd = () => {
                preloader.removeEventListener('transitionend', onTransitionEnd);
                document.body.classList.remove('is-loading');

                // Move focus to the main content or first interactive element
                const focusTarget = document.querySelector('main, [tabindex="-1"], .hero-header');
                if (focusTarget) {
                    focusTarget.setAttribute('tabindex', '-1');
                    focusTarget.focus();
                }

                if (typeof onCompleteCallback === 'function') {
                    onCompleteCallback();
                }
            };
            preloader.addEventListener('transitionend', onTransitionEnd);

            // Fallback in case transitionend doesn't fire
            setTimeout(() => {
                if (preloader.classList.contains('is-hidden')) {
                    onTransitionEnd();
                }
            }, 900);
        }
    }, intervalTime);
}