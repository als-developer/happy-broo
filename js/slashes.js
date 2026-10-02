/* ═══════════════════════════════════════════════════ */
/* ═══════════ SLASHES.JS — Dynamic Effects ════════ */
/* ═══════════════════════════════════════════════════ */

// Random slash generator - inaongeza slash mpya kila wakati
function createRandomSlash() {
  const intro = document.getElementById('cinematicIntro');
  if (!intro || !intro.classList.contains('active')) return;

  const slash = document.createElement('div');
  slash.className = 'slash-super random-slash';
  slash.style.top = Math.random() * 100 + '%';
  slash.style.transform = `rotate(${Math.random() * 80 - 40}deg)`;
  slash.style.animationDuration = (Math.random() * 0.5 + 0.8) + 's';
  slash.style.background = `linear-gradient(90deg, transparent, ${randomColor()}, ${randomColor()}, transparent)`;
  intro.appendChild(slash);
  setTimeout(() => slash.remove(), 1500);
}

function randomColor() {
  const colors = ['#ff2d95', '#00d9ff', '#ffd700', '#8b2fc9', '#00ff88', '#00bfff'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Trigger random slashes when intro is active
setInterval(() => {
  const intro = document.getElementById('cinematicIntro');
  if (intro && intro.classList.contains('active')) {
    createRandomSlash();
  }
}, 250);

// Sound effect for slashes
function playSlashSound() {
  try {
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, audio.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audio.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.15);
    osc.start(audio.currentTime);
    osc.stop(audio.currentTime + 0.15);
  } catch(e) {}
}

// Play slash sound when slash appears
document.addEventListener('animationstart', (e) => {
  if (e.animationName === 'slashSuperAnim') {
    playSlashSound();
  }
});
