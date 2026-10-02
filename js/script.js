/* ═══════════ WELCOME → INTRO → MAIN ═══════════ */
const welcomePage = document.getElementById('welcomePage');
const cinematicIntro = document.getElementById('cinematicIntro');
const enterBtn = document.getElementById('enterBtn');
const mainNav = document.getElementById('mainNav');

if (mainNav) { mainNav.style.opacity = '0'; mainNav.style.pointerEvents = 'none'; }

enterBtn.addEventListener('click', () => {
  const music = document.getElementById('bgMusic');
  music.play().catch(() => {});

  welcomePage.classList.add('hide');

  setTimeout(() => {
    cinematicIntro.classList.add('active');
    for (let i = 0; i < 20; i++) setTimeout(() => randomFirework(), i * 200);
  }, 800);

  setTimeout(() => {
    cinematicIntro.classList.add('hide');
    if (mainNav) {
      mainNav.style.transition = 'opacity 1s';
      mainNav.style.opacity = '1';
      mainNav.style.pointerEvents = 'auto';
    }
    startConfetti();
    startFlowerRain();
    for (let i = 0; i < 25; i++) setTimeout(() => randomFirework(), i * 130);
  }, 7000);

  setTimeout(() => welcomePage.remove(), 2000);
});

/* ═══════════ CONFETTI ═══════════ */
const confettiCanvas = document.getElementById('confetti');
const cctx = confettiCanvas.getContext('2d');
let confettiPieces = [];

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

const confettiColors = ['#ff2d95', '#00d9ff', '#ffd700', '#8b2fc9', '#00ff88', '#ff6b00', '#00bfff'];

function createConfetti() {
  for (let i = 0; i < 130; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 8 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: Math.random() * 3 + 1.5,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 6 - 3
    });
  }
}

function drawConfetti() {
  cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p => {
    cctx.save();
    cctx.translate(p.x, p.y);
    cctx.rotate(p.rotation * Math.PI / 180);
    cctx.fillStyle = p.color;
    cctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    cctx.restore();
    p.y += p.speedY; p.x += p.speedX; p.rotation += p.rotSpeed;
    if (p.y > confettiCanvas.height + 20) {
      p.y = -20;
      p.x = Math.random() * confettiCanvas.width;
    }
  });
  requestAnimationFrame(drawConfetti);
}

function startConfetti() {
  createConfetti();
  drawConfetti();
  setInterval(() => {
    if (confettiPieces.length < 300) {
      for (let i = 0; i < 20; i++) {
        confettiPieces.push({
          x: Math.random() * confettiCanvas.width, y: -20,
          w: Math.random() * 10 + 5, h: Math.random() * 8 + 4,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          speedY: Math.random() * 3 + 1.5, speedX: Math.random() * 2 - 1,
          rotation: Math.random() * 360, rotSpeed: Math.random() * 6 - 3
        });
      }
    }
  }, 3000);
}

/* ═══════════ FIREWORKS ═══════════ */
const fwCanvas = document.getElementById('fireworks');
const fctx = fwCanvas.getContext('2d');
let particles = [];

function resizeFW() {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}
resizeFW();
window.addEventListener('resize', resizeFW);

class Particle {
  constructor(x, y, color) {
    this.x = x; this.y = y; this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
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
    fctx.fillStyle = this.color;
    fctx.beginPath();
    fctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    fctx.fill();
    fctx.globalAlpha = 1;
  }
}

function explode(x, y) {
  const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  for (let i = 0; i < 80; i++) particles.push(new Particle(x, y, color));
}

function randomFirework() {
  explode(Math.random() * fwCanvas.width, Math.random() * fwCanvas.height * 0.6 + 50);
}

function animateFireworks() {
  fctx.fillStyle = 'rgba(15, 12, 41, 0.15)';
  fctx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => { p.update(); p.draw(); });
  if (Math.random() < 0.025) randomFirework();
  requestAnimationFrame(animateFireworks);
}
animateFireworks();

/* ═══════════ FLOWERS ═══════════ */
const flCanvas = document.getElementById('flowers');
const flctx = flCanvas.getContext('2d');
let flowers = [];

function resizeFl() {
  flCanvas.width = window.innerWidth;
  flCanvas.height = window.innerHeight;
}
resizeFl();
window.addEventListener('resize', resizeFl);

const flowerEmojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🏵️', '💮'];

function createFlower() {
  return {
    x: Math.random() * flCanvas.width, y: -50,
    emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
    size: Math.random() * 25 + 20,
    speedY: Math.random() * 2 + 1,
    speedX: Math.random() * 1 - 0.5,
    rotation: Math.random() * 360,
    rotSpeed: Math.random() * 3 - 1.5,
    opacity: Math.random() * 0.5 + 0.5
  };
}

function startFlowerRain() {
  setInterval(() => {
    if (flowers.length < 40) flowers.push(createFlower());
  }, 800);
}

function drawFlowers() {
  flctx.clearRect(0, 0, flCanvas.width, flCanvas.height);
  flowers.forEach((f, i) => {
    flctx.save();
    flctx.globalAlpha = f.opacity;
    flctx.translate(f.x, f.y);
    flctx.rotate(f.rotation * Math.PI / 180);
    flctx.font = `${f.size}px serif`;
    flctx.textAlign = 'center';
    flctx.fillText(f.emoji, 0, 0);
    flctx.restore();
    f.y += f.speedY; f.x += f.speedX; f.rotation += f.rotSpeed;
    if (f.y > flCanvas.height + 50) flowers.splice(i, 1);
  });
  requestAnimationFrame(drawFlowers);
}
drawFlowers();

function burstFlowers(x, y) {
  for (let i = 0; i < 25; i++) {
    flowers.push({
      x: x + (Math.random() * 100 - 50),
      y: y + (Math.random() * 50 - 25),
      emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
      size: Math.random() * 30 + 20,
      speedY: Math.random() * 3 + 1,
      speedX: Math.random() * 4 - 2,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 5 - 2.5,
      opacity: 1
    });
  }
}

/* ═══════════ GIFTS ═══════════ */
const giftEmojis = ['🎁', '🎀', '💝', '🎊', '🎉', '🏆', '👑', '💎'];

function burstGifts(x, y) {
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.textContent = giftEmojis[Math.floor(Math.random() * giftEmojis.length)];
    el.style.cssText = `
      position: fixed; left: ${x}px; top: ${y}px;
      font-size: ${Math.random() * 20 + 30}px;
      pointer-events: none; z-index: 9999;
      transition: all 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      filter: drop-shadow(0 0 15px gold);
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.left = (x + (Math.random() * 400 - 200)) + 'px';
      el.style.top = (y + (Math.random() * 400 - 200)) + 'px';
      el.style.opacity = '0';
      el.style.transform = `rotate(${Math.random() * 720 - 360}deg) scale(1.5)`;
    });
    setTimeout(() => el.remove(), 2600);
  }
}

/* ═══════════ SOUND ═══════════ */
function playPop() {
  try {
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.connect(gain); gain.connect(audio.destination);
    osc.frequency.setValueAtTime(800, audio.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audio.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.2);
    osc.start(audio.currentTime);
    osc.stop(audio.currentTime + 0.2);
  } catch(e) {}
}

/* ═══════════ BUTTONS ═══════════ */
document.getElementById('fireBtn')?.addEventListener('click', () => {
  playPop();
  for (let i = 0; i < 8; i++) setTimeout(() => randomFirework(), i * 150);
});
document.getElementById('flowerBtn')?.addEventListener('click', (e) => {
  playPop();
  const rect = e.target.getBoundingClientRect();
  for (let i = 0; i < 4; i++) setTimeout(() => burstFlowers(rect.left + rect.width / 2, rect.top), i * 250);
});
document.getElementById('giftBtn')?.addEventListener('click', (e) => {
  playPop();
  const rect = e.target.getBoundingClientRect();
  burstGifts(rect.left + rect.width / 2, rect.top);
  for (let i = 0; i < 3; i++) setTimeout(() => randomFirework(), i * 200);
});

/* ═══════════ COUNTDOWN ═══════════ */
const birthdayDate = new Date('October 2, 2026 00:00:00').getTime();
function updateCountdown() {
  const now = new Date().getTime();
  const diff = birthdayDate - now;
  if (diff < 0) {
    ['days','hours','minutes','seconds'].forEach((id,i) => {
      document.getElementById(id).textContent = ['🎉','🎂','🎈','🎊'][i];
    });
    return;
  }
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  document.getElementById('days').textContent = String(d).padStart(2, '0');
  document.getElementById('hours').textContent = String(h).padStart(2, '0');
  document.getElementById('minutes').textContent = String(m).padStart(2, '0');
  document.getElementById('seconds').textContent = String(s).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ═══════════ MUSIC ═══════════ */
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let playing = false;
musicBtn.addEventListener('click', () => {
  if (!playing) {
    music.play().catch(() => alert('Bofya tena kuwasha muziki 🎵'));
    musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Zima Muziki';
    playing = true;
  } else {
    music.pause();
    musicBtn.innerHTML = '<i class="fas fa-music"></i> Washa Muziki';
    playing = false;
  }
});

/* ═══════════ SMOOTH SCROLL ═══════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if (a.classList.contains('nav-link')) a.classList.add('active');
    document.getElementById('navLinks')?.classList.remove('open');
  });
});

/* ═══════════ SCROLL REVEAL ═══════════ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal-page, .reveal').forEach(el => observer.observe(el));

/* ═══════════ PAGE DOTS ═══════════ */
document.querySelectorAll('.dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const target = document.querySelector('#' + dot.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

window.addEventListener('scroll', () => {
  const sections = ['home', 'gallery', 'history', 'congrats', 'wishes'];
  const scrollPos = window.scrollY + window.innerHeight / 2;
  sections.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.dot')[i]?.classList.add('active');
        document.querySelectorAll('.nav-link')[i]?.classList.add('active');
      }
    }
  });
});

/* ═══════════ MOBILE MENU ═══════════ */
document.getElementById('menuToggle')?.addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

/* ═══════════ TITLE CLICK ═══════════ */
document.querySelector('.name-title')?.addEventListener('click', e => {
  playPop();
  for (let i = 0; i < 4; i++) {
    setTimeout(() => explode(
      e.clientX + (Math.random() * 200 - 100),
      e.clientY + (Math.random() * 200 - 100)
    ), i * 150);
  }
});

/* ═══════════ BLESSING FORM ═══════════ */
const blessingForm = document.getElementById('blessingForm');
const blessingList = document.getElementById('blessingList');
let blessings = JSON.parse(localStorage.getItem('shadrack_blessings') || '[]');
renderBlessings();

blessingForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('blessName').value.trim();
  const relation = document.getElementById('blessRelation').value;
  const msg = document.getElementById('blessMsg').value.trim();
  if (!name || !relation || !msg) return;
  blessings.unshift({ name, relation, msg, date: new Date().toLocaleDateString() });
  localStorage.setItem('shadrack_blessings', JSON.stringify(blessings));
  blessingForm.reset();
  renderBlessings();
  playPop();
  for (let i = 0; i < 3; i++) setTimeout(() => randomFirework(), i * 200);
  burstGifts(window.innerWidth / 2, window.innerHeight / 2);
});

function renderBlessings() {
  blessingList.innerHTML = '';
  blessings.slice(0, 10).forEach(b => {
    const card = document.createElement('div');
    card.className = 'bless-card';
    card.innerHTML = `
      <h4>💝 ${b.name} <small>(${b.relation})</small></h4>
      <p>${b.msg}</p>
      <small>📅 ${b.date}</small>
    `;
    blessingList.appendChild(card);
  });
}

/* ═══════════ LOAD ADMIN DATA ═══════════ */
function loadAdminData() {
  const savedGallery = JSON.parse(localStorage.getItem('shadrack_gallery') || '[]');
  if (savedGallery.length > 0) {
    const grid = document.getElementById('galleryGrid');
    savedGallery.forEach(item => {
      const div = document.createElement('div');
      div.className = 'gallery-item glass';
      div.innerHTML = `<img src="${item.url}" alt="${item.caption}"><div class="overlay"><span>${item.caption}</span></div>`;
      grid.appendChild(div);
    });
  }
  const savedTimeline = JSON.parse(localStorage.getItem('shadrack_timeline') || '[]');
  if (savedTimeline.length > 0) {
    const container = document.getElementById('timelineContainer');
    savedTimeline.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = `timeline-item ${i % 2 === 0 ? 'left' : 'right'}`;
      div.innerHTML = `<div class="content"><h3>${item.year} - ${item.title}</h3><p>${item.text}</p></div>`;
      container.appendChild(div);
    });
  }
}
setTimeout(loadAdminData, 200);
