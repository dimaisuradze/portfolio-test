export function initHeroScramble() {
    const hookElement = document.getElementById('hero-hook');
    if (!hookElement) return;

    const finalString = hookElement.getAttribute('data-text');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let iteration = 0;

    const scrambleInterval = setInterval(() => {
        hookElement.textContent = finalString.split('').map((letter, index) => {
            if (index < iteration) return finalString[index];
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');

        if (iteration >= finalString.length) clearInterval(scrambleInterval);
        iteration += 2;
    }, 20);
}