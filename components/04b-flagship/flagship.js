export function initFlagship() {
    const section = document.getElementById('flagship-section');
    const container = document.getElementById('flagship-flipbook');
    if (!section || !container) return;

    const frames = container.querySelectorAll('.flip-frame');
    const flipbookTl = gsap.timeline({ repeat: -1, paused: true });
    const frameDuration = 0.45;

    gsap.set(frames, { opacity: 0 });
    gsap.set(frames[0], { opacity: 1 });

    frames.forEach((frame) => {
        flipbookTl
            .set(frames, { opacity: 0 })
            .set(frame, { opacity: 1 })
            .to({}, { duration: frameDuration });
    });

    ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => flipbookTl.play(),
        onLeave: () => flipbookTl.pause(),
        onEnterBack: () => flipbookTl.play(),
        onLeaveBack: () => flipbookTl.pause()
    });
}