import confetti from 'canvas-confetti';

/**
 * Trigger an elegant, multi-stage celebratory confetti burst for wedding RSVP submission
 */
export function triggerWeddingConfetti() {
  // Wedding luxury palette: Royal Emerald, Champagne Gold, Rose Gold, Warm Ivory, Glitter Gold
  const colors = ['#C5A880', '#295744', '#E8C547', '#E57373', '#FFD700', '#F3E5AB'];

  // 1. Immediate Center Explosion
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    startVelocity: 45,
    zIndex: 99999,
    disableForReducedMotion: true
  });

  // 2. Left and Right celebratory cannons (staggered slightly for natural festive feel)
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
      startVelocity: 50,
      zIndex: 99999,
      disableForReducedMotion: true
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
      startVelocity: 50,
      zIndex: 99999,
      disableForReducedMotion: true
    });
  }, 200);

  // 3. Gentle falling stars & shimmering petals
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 100,
      origin: { y: 0.4 },
      colors,
      scalar: 1.2,
      gravity: 0.7,
      ticks: 300,
      zIndex: 99999,
      disableForReducedMotion: true
    });
  }, 450);
}
