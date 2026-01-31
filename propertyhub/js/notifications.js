export const playSuccessSound = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(1320, context.currentTime + 0.1); // E6

    gain.gain.setValueAtTime(0.1, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
};

export const triggerCoinAnimation = () => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    for (let i = 0; i < 20; i++) {
        const coin = document.createElement('div');
        coin.innerHTML = '🪙';
        coin.style.position = 'absolute';
        coin.style.left = Math.random() * 100 + 'vw';
        coin.style.top = '-50px';
        coin.style.fontSize = (Math.random() * 20 + 20) + 'px';
        coin.style.transition = `all ${Math.random() * 2 + 1}s linear`;
        container.appendChild(coin);

        setTimeout(() => {
            coin.style.top = '110vh';
            coin.style.transform = `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 100 - 50}px)`;
        }, 10);
    }

    setTimeout(() => container.remove(), 3000);
};
