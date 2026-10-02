/* ═══════════ CINEMATIC INTRO AUTO-HIDE ═══════════ */
window.addEventListener('load', () => {
  const intro = document.getElementById('cinematicIntro');
  if (intro) {
    setTimeout(() => {
      intro.style.transition = 'opacity 1s';
      intro.style.opacity = '0';
      setTimeout(() => intro.remove(), 1100);
    }, 4500);
  }
  startConfetti();
  setTimeout(() => {
    for (let i = 0; i < 8; i++) setTimeout(() => randomFirework(), i * 300);
  }, 2000);
});

/* ═══════════ CONFETTI ═══════════ */
const confCanvas = document.getElementById('confetti');
let cctx, confetti = [];
if (confCanvas) {
  cctx = confCanvas.getContext('2d');
  resizeConfetti();
  window.addEventListener('resize', resizeConfetti);
}
function resizeConfetti() {
  if (confCanvas) {
    confCanvas.width = window.innerWidth;
    confCanvas.height = window.innerHeight;
  }
}
const colors = ['#ff2d95', '#00d9ff', '#ffd700', '#8b2fc9', '#00ff88', '#ff6b00', '#00bfff'];
function createConf() {
  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: Math.random() * confCanvas.width,
      y: Math.random() * -confCanvas.height,
      w: Math.random() * 10 + 5, h: Math.random() * 8 + 4,
      c: colors[Math.floor(Math.random() * colors.length)],
      sy: Math.random() * 3 + 1.5, sx: Math.random() * 2 - 1,
      r: Math.random() * 360, rs: Math.random() * 6 - 3
    });
  }
}
function drawConfetti() {
  if (!cctx) return;
  cctx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  confetti.forEach(p => {
    cctx.save();
    cctx.translate(p.x, p.y);
    cctx.rotate(p.r * Math.PI / 180);
    cctx.fillStyle = p.c;
    cctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    cctx.restore();
    p.y += p.sy; p.x += p.sx; p.r += p.rs;
    if (p.y > confCanvas.height + 20) { p.y = -20; p.x = Math.random() * confCanvas.width; }
  });
  requestAnimationFrame(drawConfetti);
}
function startConfetti() {
  if (!confCanvas) return;
  createConf();
  drawConfetti();
  setInterval(() => {
    if (confetti.length < 250) {
      for (let i = 0; i < 20; i++) {
        confetti.push({
          x: Math.random() * confCanvas.width, y: -20,
          w: Math.random() * 10 + 5, h: Math.random() * 8 + 4,
          c: colors[Math.floor(Math.random() * colors.length)],
          sy: Math.random() * 3 + 1.5, sx: Math.random() * 2 - 1,
          r: Math.random() * 360, rs: Math.random() * 6 - 3
        });
      }
    }
  }, 3000);
}

/* ═══════════ FIREWORKS ═══════════ */
const fwCanvas = document.getElementById('fireworks');
let fctx, particles = [];
if (fwCanvas) {
  fctx = fwCanvas.getContext('2d');
  resizeFW();
  window.addEventListener('resize', resizeFW);
  animateFW();
}
function resizeFW() {
  if (fwCanvas) {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
  }
}
class Particle {
  constructor(x, y, c) {
    this.x = x; this.y = y; this.c = c;
    const a = Math.random() * Math.PI * 2;
    const s = Math.random() * 6 + 2;
    this.vx = Math.cos(a) * s;
    this.vy = Math.sin(a) * s;
    this.life = 1;
    this.decay = Math.random() * 0.015 + 0.01;
    this.size = Math.random() * 3 + 1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vy += 0.05;
    this.vx *= 0.99; this.vy *= 0.99;
    this.life -= this.decay;
  }
  draw() {
    fctx.globalAlpha = this.life;
    fctx.fillStyle = this.c;
    fctx.beginPath();
    fctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    fctx.fill();
    fctx.globalAlpha = 1;
  }
}
function explode(x, y) {
  const c = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 70; i++) particles.push(new Particle(x, y, c));
}
function randomFirework() {
  if (!fwCanvas) return;
  explode(Math.random() * fwCanvas.width, Math.random() * fwCanvas.height * 0.6 + 50);
}
function burstFireworks() {
  for (let i = 0; i < 5; i++) setTimeout(() => randomFirework(), i * 150);
}
function animateFW() {
  if (!fctx) return;
  fctx.fillStyle = 'rgba(10, 8, 32, 0.15)';
  fctx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => { p.update(); p.draw(); });
  if (Math.random() < 0.02) randomFirework();
  requestAnimationFrame(animateFW);
}

/* ═══════════ FLOWERS ═══════════ */
function burstFlowers() {
  const emojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `position:fixed;left:${Math.random()*window.innerWidth}px;top:-50px;font-size:${Math.random()*20+25}px;pointer-events:none;z-index:9999;transition:all ${Math.random()*2+2}s linear;filter:drop-shadow(0 0 10px currentColor);`;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.top = window.innerHeight + 50 + 'px';
      el.style.transform = `rotate(${Math.random() * 720 - 360}deg)`;
    });
    setTimeout(() => el.remove(), 4000);
  }
}

/* ═══════════ GIFTS ═══════════ */
function burstGifts() {
  const emojis = ['🎁', '🎀', '💝', '🎊', '🎉', '🏆', '👑', '💎'];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  for (let i = 0; i < 15; i++) {
    const el = document.createElement('div');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;font-size:${Math.random()*20+30}px;pointer-events:none;z-index:9999;transition:all 2s cubic-bezier(0.25,0.46,0.45,0.94);filter:drop-shadow(0 0 15px gold);`;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.left = (cx + (Math.random() * 500 - 250)) + 'px';
      el.style.top = (cy + (Math.random() * 500 - 250)) + 'px';
      el.style.opacity = '0';
      el.style.transform = `rotate(${Math.random() * 720}deg) scale(1.5)`;
    });
    setTimeout(() => el.remove(), 2200);
  }
}

/* ═══════════ PARTY ═══════════ */
function startParty() {
  burstFireworks();
  burstFlowers();
  burstGifts();
  playSound(880, 0.1);
}

/* ═══════════ OPEN GIFT ═══════════ */
function openGift(el, emoji, message) {
  if (el.classList.contains('opened')) return;
  el.classList.add('opened');
  const icon = el.querySelector('.gift-inner');
  if (icon) icon.innerHTML = `<span style="font-size:2rem">${emoji}</span>`;
  playSound(660, 0.15);
  burstFireworks();
  setTimeout(() => showToast('🎉 ' + message), 300);
}

/* ═══════════ TOAST ═══════════ */
function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `position:fixed;bottom:calc(75px + 80px);left:50%;transform:translateX(-50%) translateY(30px);background:linear-gradient(135deg,#ff2d95,#8b2fc9);color:#fff;padding:14px 24px;border-radius:50px;font-family:Poppins,sans-serif;font-weight:600;font-size:0.9rem;box-shadow:0 10px 40px rgba(255,45,149,0.6);z-index:99999;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);opacity:0;pointer-events:none;`;
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(30px)';
    setTimeout(() => t.remove(), 400);
  }, 2500);
}

/* ═══════════ SOUND ═══════════ */
let audioCtx;
function playSound(freq, dur) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + dur);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + dur);
  } catch(e) {}
}

/* ═══════════ COUNTDOWN ═══════════ */
const bdayDate = new Date('2026-10-02T00:00:00').getTime();
function updateCountdown() {
  const days = document.getElementById('days');
  if (!days) return;
  const diff = bdayDate - Date.now();
  if (diff <= 0) {
    ['days','hours','minutes','seconds'].forEach((id,i) => {
      const el = document.getElementById(id);
      if (el) el.textContent = ['🎉','🎂','🎈','🎊'][i];
    });
    return;
  }
  document.getElementById('days').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
  document.getElementById('hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  document.getElementById('minutes').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  document.getElementById('seconds').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ═══════════ MUSIC ═══════════ */
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicToggle');
let musicPlaying = false;
if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    if (!musicPlaying) {
      music.play().then(() => {
        musicPlaying = true;
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
        showToast('🎵 Muziki umeanza!');
      }).catch(() => showToast('⚠️ Bofya tena kuwasha muziki'));
    } else {
      music.pause();
      musicPlaying = false;
      musicBtn.classList.remove('playing');
      musicBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  });
}

/* ═══════════ BLESSINGS ═══════════ */
const blessForm = document.getElementById('blessingForm');
const blessList = document.getElementById('blessingList');
async function loadBlessings() {
  if (!blessList) return;
  try {
    const res = await fetch('/api/blessings');
    const data = await res.json();
    if (data.success) renderBlessings(data.data);
  } catch(e) {}
}
function renderBlessings(list) {
  if (!blessList) return;
  if (!list || list.length === 0) {
    blessList.innerHTML = '<div class="item-empty">Hakuna baraka bado. Kuwa wa kwanza!</div>';
    return;
  }
  blessList.innerHTML = list.map(b => `
    <div class="bless-item">
      <h4>💝 ${b.name} <small>(${b.relation})</small></h4>
      <p>${b.msg}</p>
      <small>📅 ${b.date}</small>
    </div>
  `).join('');
}
if (blessForm) {
  blessForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('blessName').value.trim();
    const relation = document.getElementById('blessRelation').value;
    const msg = document.getElementById('blessMsg').value.trim();
    if (!name || !relation || !msg) return;
    try {
      const res = await fetch('/api/blessings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, relation, msg })
      });
      const data = await res.json();
      if (data.success) {
        blessForm.reset();
        loadBlessings();
        burstFireworks();
        burstGifts();
        showToast('✅ Baraka zako zimetumwa!');
      }
    } catch(e) { showToast('❌ Hitilafu ya mtandao'); }
  });
  loadBlessings();
}
