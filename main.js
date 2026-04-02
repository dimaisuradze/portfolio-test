import { initPreloader } from './components/01-preloader/preloader.js';
import { initHeader } from './components/02-header/header.js';
import { initHeroScramble } from './components/03-hero/hero.js';
import { initMarquee } from './components/04-marquee/marquee.js';
import { initFlagship } from './components/04b-flagship/flagship.js';
import { initAccordion } from './components/05-accordion/accordion.js';
import { initArchive } from './components/06-archive/archive.js';
import { initMouseTracker } from './components/07-mouse/mouse.js';
// [NEW] Import the Bio Router
import { initBioRouter } from './components/08-bio/bio.js';

// =========================================
// 1. Define all component HTML files to inject
// =========================================
const componentsToLoad = [
    { id: 'layer-preloader', url: './components/01-preloader/preloader.html' },
    { id: 'layer-header', url: './components/02-header/header.html' },
    { id: 'layer-mouse-trackers', url: './components/07-mouse/mouse.html' },
    { id: 'layer-hero', url: './components/03-hero/hero.html' },
    { id: 'layer-marquee', url: './components/04-marquee/marquee.html' },
    { id: 'layer-flagship', url: './components/04b-flagship/flagship.html' },
    { id: 'layer-accordion', url: './components/05-accordion/accordion.html' },
    { id: 'layer-archive', url: './components/06-archive/archive.html' },
    // [NEW] Add the Bio layer to the fetch array
    { id: 'layer-bio', url: './components/08-bio/bio.html' }
];

// =========================================
// 2. Helper: fetch and inject HTML
// =========================================
async function loadHTML(containerId, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = html;
        else console.warn(`Container #${containerId} not found.`);
    } catch (err) {
        console.error(`Failed to load ${url}:`, err);
    }
}

// =========================================
// 3. Global Physics: Lenis + GSAP ScrollTrigger
// =========================================
function initGlobalPhysics() {
    // --- Lenis smooth scroll ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2
    });

    // Make Lenis globally accessible for components (header uses it)
    window.lenis = lenis;

    // Sync Lenis with GSAP's ticker
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Register ScrollTrigger with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Sync Lenis updates with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Optional: Set desktop media query for mouse / marquee logic
    window.isDesktop = window.matchMedia('(min-width: 769px)');

    // Global state flags (will be set later but defined now)
    window.isHoveringMarquee = false;
    window.isHoveringRow = false;
}

// =========================================
// 4. Main boot sequence
// =========================================
async function bootApplication() {
    console.log("🚀 Booting Portfolio…");

    // Step 1: Inject all component HTML
    await Promise.all(componentsToLoad.map(comp => loadHTML(comp.id, comp.url)));
    console.log("✅ All HTML injected.");

    // Step 2: Initialize global physics (Lenis, GSAP)
    initGlobalPhysics();

    // Step 3: Initialize all components (except the preloader's callback)
    initHeader();
    initMouseTracker();
    initMarquee();
    initFlagship();
    initAccordion();
    initArchive();

    // [NEW] Boot the Bio SPA Router
    initBioRouter();

    // Step 4: Start the preloader. When it finishes, unlock Lenis and scramble hero text.
    initPreloader(() => {
        window.lenis.start();
        initHeroScramble();
        console.log("🎬 Preloader done. Scrolling & Hero effect active.");
    });
}

// =========================================
// 5. Launch when DOM is ready
// =========================================
document.addEventListener("DOMContentLoaded", bootApplication);