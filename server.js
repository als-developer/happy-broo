/* ═══════════════════════════════════════════════════════ */
/* ═══════════ AILIFESOLUTION (ALS) SERVER v3.0 ═══════ */
/* ═══════════ File Upload (Image + Video) ════════════ */
/* ═══════════════════════════════════════════════════════ */

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* ═══════════ CONFIG ═══════════ */
const CONFIG = {
  COMPANY: 'AiliFesolution (ALS)',
  NAME: 'Dr. Shadrack Ahazi Sanga',
  AGE: 24,
  DATE: 'Octoba 2, 2002',
  ADMIN_USER: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASS: process.env.ADMIN_PASSWORD || 'shadrack2026'
};

/* ═══════════ MULTER CONFIG ═══════════ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExt = /jpeg|jpg|png|gif|webp|mp4|webm|mov|avi|mkv|m4v/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;
  if (allowedExt.test(ext) && (mime.startsWith('image/') || mime.startsWith('video/'))) {
    cb(null, true);
  } else {
    cb(new Error('Aina ya file hairuhusiwi! Tumia picha au video.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }
});

/* ═══════════ HELPERS ═══════════ */
function readData(file) {
  try {
    const p = path.join(DATA_DIR, file);
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
  } catch { return []; }
}

function writeData(file, data) {
  try {
    fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
    return true;
  } catch { return false; }
}

/* ═══════════ MIDDLEWARE ═══════════ */
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'als-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000 }
}));
app.use(express.static(path.join(__dirname, 'public')));

/* ═══════════ FAVICON ═══════════ */
app.get('/favicon.ico', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎂</text></svg>`);
});

/* ═══════════════════════════════════════════════════ */
/* ═══════════ HTML LAYOUT BASE ═══════════════════ */
/* ═══════════════════════════════════════════════════ */
function layout({ title, body, active = '' }) {
  return `<!DOCTYPE html>
<html lang="sw">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#0f0c29">
<title>${title}</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;600;700;800;900&family=Cinzel:wght@700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css">
</head>
<body class="page-${active}">

<header class="app-topbar">
  <div class="topbar-left">
    <div class="als-logo-small"><i class="fas fa-heart-pulse"></i></div>
    <div>
      <div class="topbar-title">Dr. Shadrack</div>
      <div class="topbar-sub">Miaka ${CONFIG.AGE} • ALS</div>
    </div>
  </div>
  <a href="/admin" class="topbar-btn"><i class="fas fa-user-shield"></i></a>
</header>

<main class="app-main">${body}</main>

<nav class="bottom-nav">
  <a href="/home" class="nav-btn ${active === 'home' ? 'active' : ''}">
    <div class="nav-icon"><i class="fas fa-house"></i></div><span>Nyumbani</span>
  </a>
  <a href="/happybirthday" class="nav-btn ${active === 'birthday' ? 'active' : ''}">
    <div class="nav-icon"><i class="fas fa-cake-candles"></i></div><span>Sherehe</span>
  </a>
  <a href="/gift" class="nav-btn ${active === 'gift' ? 'active' : ''}">
    <div class="nav-icon"><i class="fas fa-gift"></i></div><span>Zawadi</span>
  </a>
  <a href="/dr.shadrack" class="nav-btn ${active === 'profile' ? 'active' : ''}">
    <div class="nav-icon"><i class="fas fa-user-doctor"></i></div><span>Wasifu</span>
  </a>
  <a href="/music" class="nav-btn ${active === 'music' ? 'active' : ''}">
    <div class="nav-icon"><i class="fas fa-music"></i></div><span>Muziki</span>
  </a>
</nav>

<button id="musicToggle" class="music-float" title="Washa/Zima Muziki">
  <i class="fas fa-play"></i>
</button>

<audio id="bgMusic" loop>
  <source src="/audio/birthday.mp3" type="audio/mpeg">
</audio>

<canvas id="fireworks"></canvas>
<canvas id="confetti"></canvas>

<script src="/js/app.js"></script>
</body>
</html>`;
}

/* ═══════════════════════════════════════════════════ */
/* ═══════════ SLASH: / ═══════════════════════════ */
/* ═══════════════════════════════════════════════════ */
app.get('/', (req, res) => {
  const body = `
<div class="welcome-hero">
  <div class="welcome-logo">
    <div class="logo-ring"></div>
    <div class="logo-ring r2"></div>
    <div class="logo-ring r3"></div>
    <div class="logo-core">
      <i class="fas fa-heart-pulse"></i>
      <div class="logo-als">ALS</div>
    </div>
  </div>
  <div class="welcome-text">
    <div class="badge-company">✦ AILIFESOLUTION ✦</div>
    <h1 class="welcome-heading">Karibu Kwenye</h1>
    <h2 class="welcome-title">Sherehe ya Miaka ${CONFIG.AGE}</h2>
    <div class="welcome-name">${CONFIG.NAME}</div>
    <p class="welcome-sub">🎂 Octoba 2, 2002 → Octoba 2, 2026 🎂</p>
  </div>
  <div class="welcome-buttons">
    <a href="/home" class="btn-main"><i class="fas fa-rocket"></i><span>INGIA KWENYE SHEREHE</span></a>
    <a href="/happybirthday" class="btn-sec"><i class="fas fa-cake-candles"></i><span>Tazama Sherehe</span></a>
  </div>
  <div class="welcome-footer-text">
    <i class="fas fa-shield-heart"></i> Powered by ${CONFIG.COMPANY} © 2026
  </div>
</div>
`;
  res.send(layout({ title: 'Karibu — Dr. Shadrack', body, active: 'welcome' }));
});

app.get('/welcome', (req, res) => res.redirect('/'));

/* ═══════════════════════════════════════════════════ */
/* ═══════════ SLASH: /home ═══════════════════════ */
/* ═══════════════════════════════════════════════════ */
app.get('/home', (req, res) => {
  const gallery = readData('gallery.json');
  const defaultPhotos = [
    { url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600', caption: 'Daktari Bingwa', type: 'image' },
    { url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600', caption: 'Kazini', type: 'image' },
    { url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600', caption: 'Sherehe', type: 'image' }
  ];
  const photos = gallery.length > 0 ? gallery : defaultPhotos;

  const body = `
<div id="cinematicIntro" class="cinematic-intro">
  ${Array.from({length: 15}).map((_, i) => `<div class="slash-line" style="--i:${i}"></div>`).join('')}
  <div class="cinematic-text">
    <div class="cine-line" style="--d:0.3s">🎊 HAPPY BIRTHDAY 🎊</div>
    <div class="cine-line big" style="--d:1s">DR. SHADRACK</div>
    <div class="cine-line" style="--d:1.7s">Ahazi Sanga</div>
    <div class="cine-line small" style="--d:2.4s">Miaka ${CONFIG.AGE} • Octoba 2, 2026</div>
    <div class="cine-line tiny" style="--d:3s">Powered by ${CONFIG.COMPANY}</div>
  </div>
</div>

<section class="hero-card">
  <div class="hero-badge">👑 Birthday Boy</div>
  <h1 class="hero-title-shine">HAPPY BIRTHDAY</h1>
  <h2 class="hero-name">DR. SHADRACK</h2>
  <p class="hero-sub">Ahazi Sanga</p>
  <div class="hero-age-pill">🎊 Miaka ${CONFIG.AGE} 🎊</div>
  <p class="hero-birth">Kuzaliwa: Octoba 2, 2002</p>
</section>

<section class="countdown-card">
  <h3><i class="fas fa-hourglass-half"></i> Siku Yako Kuu</h3>
  <div class="countdown-grid">
    <div class="countdown-item"><div class="cd-num" id="days">00</div><div class="cd-lbl">Siku</div></div>
    <div class="countdown-item"><div class="cd-num" id="hours">00</div><div class="cd-lbl">Saa</div></div>
    <div class="countdown-item"><div class="cd-num" id="minutes">00</div><div class="cd-lbl">Dakika</div></div>
    <div class="countdown-item"><div class="cd-num" id="seconds">00</div><div class="cd-lbl">Sekunde</div></div>
  </div>
</section>

<section class="quick-actions">
  <h3><i class="fas fa-bolt"></i> Vitendo vya Haraka</h3>
  <div class="actions-grid">
    <button class="action-btn fire" onclick="burstFireworks()"><i class="fas fa-fire"></i><span>Fataki</span></button>
    <button class="action-btn flower" onclick="burstFlowers()"><i class="fas fa-seedling"></i><span>Maua</span></button>
    <button class="action-btn gift" onclick="burstGifts()"><i class="fas fa-gift"></i><span>Zawadi</span></button>
    <button class="action-btn party" onclick="startParty()"><i class="fas fa-champagne-glasses"></i><span>Party</span></button>
  </div>
</section>

<section class="gallery-card">
  <h3><i class="fas fa-images"></i> Picha za Kumbukumbu</h3>
  <div class="photo-grid">
    ${photos.slice(0, 6).map(p => `
      <div class="photo-item">
        ${p.type === 'video' 
          ? `<video src="${p.url}" muted loop autoplay playsinline></video>`
          : `<img src="${p.url}" alt="${p.caption}" onerror="this.src='https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600'">`
        }
        <div class="photo-overlay">
          <span>${p.type === 'video' ? '🎬 ' : '📸 '}${p.caption}</span>
        </div>
      </div>
    `).join('')}
  </div>
</section>

<section class="wishes-card">
  <h3><i class="fas fa-star"></i> Matakwa ya Heri</h3>
  <div class="wishes-list">
    <div class="wish-chip">🎂 Heri ya Kuzaliwa!</div>
    <div class="wish-chip">💚 Afya Njema</div>
    <div class="wish-chip">💰 Mafanikio</div>
    <div class="wish-chip">😊 Furaha</div>
    <div class="wish-chip">🙏 Baraka</div>
    <div class="wish-chip">🚀 Maendeleo</div>
    <div class="wish-chip">💖 Upendo</div>
    <div class="wish-chip">⚕️ Uponyaji</div>
  </div>
</section>
`;
  res.send(layout({ title: 'Nyumbani — Dr. Shadrack', body, active: 'home' }));
});

/* ═══════════════════════════════════════════════════ */
/* ═══════════ SLASH: /happybirthday ══════════════ */
/* ═══════════════════════════════════════════════════ */
app.get('/happybirthday', (req, res) => {
  const body = `
<div class="birthday-hero">
  <div class="bday-emoji-row">
    <span class="bday-emoji">🎉</span>
    <span class="bday-emoji">🎂</span>
    <span class="bday-emoji">🎊</span>
  </div>
  <h1 class="bday-title">HAPPY BIRTHDAY</h1>
  <h2 class="bday-name">DR. SHADRACK</h2>
  <p class="bday-sub">Ahazi Sanga</p>
  <div class="hero-age-pill">🎊 Miaka ${CONFIG.AGE} 🎊</div>
</div>

<section class="congrats-section">
  <h3><i class="fas fa-trophy"></i> Hongera Zako</h3>
  <div class="congrats-grid">
    <div class="congrats-item"><div class="cg-icon"><i class="fas fa-stethoscope"></i></div><h4>Daktari Bingwa</h4><p>Weledi na upendo</p></div>
    <div class="congrats-item"><div class="cg-icon"><i class="fas fa-award"></i></div><h4>Mafanikio</h4><p>Miaka ${CONFIG.AGE} ya hekima</p></div>
    <div class="congrats-item"><div class="cg-icon"><i class="fas fa-heart"></i></div><h4>Upendo</h4><p>Familia inakupenda</p></div>
    <div class="congrats-item"><div class="cg-icon"><i class="fas fa-star"></i></div><h4>Mustakabali</h4><p>Safari ndefu</p></div>
  </div>
</section>

<section class="message-card">
  <div class="msg-quote"><i class="fas fa-quote-left"></i></div>
  <p class="msg-text">"Kaka yetu mpendwa Dr. Shadrack, tunakupenda sana. Umekuwa mfano wetu, mlinzi wetu, na rafiki yetu. Miaka ${CONFIG.AGE} yako iwe ya baraka, furaha na mafanikio makubwa. Mungu akubariki milele!"</p>
  <div class="msg-sign">— Mdogo wako Mpendwa ❤️</div>
</section>

<section class="party-controls">
  <button class="party-btn fire" onclick="burstFireworks()"><i class="fas fa-fire-flame-curved"></i> Zindua Fataki!</button>
  <button class="party-btn flower" onclick="burstFlowers()"><i class="fas fa-spa"></i> Tupa Maua!</button>
  <button class="party-btn gift" onclick="burstGifts()"><i class="fas fa-gifts"></i> Fungua Zawadi!</button>
</section>
`;
  res.send(layout({ title: 'Happy Birthday — Dr. Shadrack', body, active: 'birthday' }));
});

/* ═══════════════════════════════════════════════════ */
/* ═══════════ SLASH: /dr.shadrack ════════════════ */
/* ═══════════════════════════════════════════════════ */
app.get('/dr.shadrack', (req, res) => {
  const body = `
<div class="profile-hero">
  <div class="profile-avatar"><i class="fas fa-user-doctor"></i></div>
  <h1 class="profile-name">DR. SHADRACK</h1>
  <p class="profile-sub">Ahazi Sanga • Daktari</p>
  <div class="profile-stats">
    <div class="stat"><div class="stat-num">${CONFIG.AGE}</div><div class="stat-lbl">Miaka</div></div>
    <div class="stat"><div class="stat-num">1</div><div class="stat-lbl">First Bro</div></div>
    <div class="stat"><div class="stat-num">∞</div><div class="stat-lbl">Mapenzi</div></div>
  </div>
</div>

<section class="info-card">
  <h3><i class="fas fa-briefcase-medical"></i> Kitaalamu</h3>
  <p>Daktari wa binadamu mwenye maono makubwa, anayeamini katika kutoa huduma ya afya yenye usawa, weledi, na upendo wa dhati.</p>
</section>

<section class="info-card">
  <h3><i class="fas fa-crown"></i> Kifamilia</h3>
  <p>Kaka mkubwa (First Bro) wa mfano, msikilizaji mzuri, na mtu mwenye upendo usio na kikomo kwa familia yake.</p>
</section>

<section class="timeline-card">
  <h3><i class="fas fa-timeline"></i> Safari ya Maisha</h3>
  <div class="timeline-list">
    <div class="tl-item"><div class="tl-dot"></div><div class="tl-content"><div class="tl-year">2002</div><h4>Kuzaliwa 🎂</h4><p>Alizaliwa tarehe 2 Octoba</p></div></div>
    <div class="tl-item"><div class="tl-dot"></div><div class="tl-content"><div class="tl-year">2018</div><h4>Chuo Kikuu 🎓</h4><p>Alianza safari ya Udaktari</p></div></div>
    <div class="tl-item"><div class="tl-dot"></div><div class="tl-content"><div class="tl-year">2023</div><h4>Kuwa Daktari 🩺</h4><p>Alihitimu kama Daktari!</p></div></div>
    <div class="tl-item"><div class="tl-dot"></div><div class="tl-content"><div class="tl-year">2026</div><h4>Miaka ${CONFIG.AGE} 🎉</h4><p>Tunasherehekea!</p></div></div>
  </div>
</section>
`;
  res.send(layout({ title: 'Dr. Shadrack — Wasifu', body, active: 'profile' }));
});

/* ═══════════════════════════════════════════════════ */
/* ═══════════ SLASH: /gift ═══════════════════════ */
/* ═══════════════════════════════════════════════════ */
app.get('/gift', (req, res) => {
  const body = `
<div class="gift-hero">
  <h1 class="gift-title"><i class="fas fa-gift"></i> ZAWADI</h1>
  <p class="gift-sub">Fungua zawadi za upendo</p>
</div>

<section class="gifts-container">
  <div class="gift-box" onclick="openGift(this, '🎁', 'Heri ya Kuzaliwa!')"><div class="gift-inner"><i class="fas fa-gift"></i></div><div class="gift-label">Zawadi 1</div></div>
  <div class="gift-box" onclick="openGift(this, '💝', 'Upendo wa Familia!')"><div class="gift-inner"><i class="fas fa-heart"></i></div><div class="gift-label">Zawadi 2</div></div>
  <div class="gift-box" onclick="openGift(this, '💎', 'Mafanikio Tele!')"><div class="gift-inner"><i class="fas fa-gem"></i></div><div class="gift-label">Zawadi 3</div></div>
  <div class="gift-box" onclick="openGift(this, '👑', 'Heshima na Baraka!')"><div class="gift-inner"><i class="fas fa-crown"></i></div><div class="gift-label">Zawadi 4</div></div>
  <div class="gift-box" onclick="openGift(this, '🏆', 'Ushindi!')"><div class="gift-inner"><i class="fas fa-trophy"></i></div><div class="gift-label">Zawadi 5</div></div>
  <div class="gift-box" onclick="openGift(this, '⭐', 'Nyota ya Kesho!')"><div class="gift-inner"><i class="fas fa-star"></i></div><div class="gift-label">Zawadi 6</div></div>
</section>

<section class="blessing-card">
  <h3><i class="fas fa-envelope-open-text"></i> Tuma Baraka Zako</h3>
  <form id="blessingForm" class="blessing-form">
    <input type="text" id="blessName" placeholder="Jina Lako" required>
    <select id="blessRelation" required>
      <option value="">Chagua Uhusiano...</option>
      <option value="Ndugu">Ndugu</option>
      <option value="Rafiki">Rafiki</option>
      <option value="Mzazi">Mzazi</option>
      <option value="Mgonjwa">Mgonjwa</option>
      <option value="Daktari Mwenzake">Daktari Mwenzake</option>
    </select>
    <textarea id="blessMsg" placeholder="Andika ujumbe wako..." rows="4" required></textarea>
    <button type="submit" class="btn-send"><i class="fas fa-paper-plane"></i> Tuma Ujumbe</button>
  </form>
  <div id="blessingList" class="blessing-list"></div>
</section>
`;
  res.send(layout({ title: 'Zawadi — Dr. Shadrack', body, active: 'gift' }));
});

/* ═══════════════════════════════════════════════════ */
/* ═══════════ SLASH: /music ══════════════════════ */
/* ═══════════════════════════════════════════════════ */
app.get('/music', (req, res) => {
  const body = `
<div class="music-hero">
  <div class="music-disc"><i class="fas fa-compact-disc"></i></div>
  <h1 class="music-title">Muziki wa Sherehe</h1>
  <p class="music-sub">Sikiliza nyimbo za furaha</p>
</div>

<section class="music-controls">
  <button class="music-btn big" onclick="document.getElementById('musicToggle').click()">
    <i class="fas fa-play-circle"></i> Cheza / Simamisha
  </button>
</section>

<section class="playlist-card">
  <h3><i class="fas fa-list-music"></i> Playlist</h3>
  <div class="playlist-item"><i class="fas fa-music"></i> Happy Birthday Song</div>
  <div class="playlist-item"><i class="fas fa-music"></i> Celebration Mix</div>
  <div class="playlist-item"><i class="fas fa-music"></i> Party Vibes</div>
</section>
`;
  res.send(layout({ title: 'Muziki — Dr. Shadrack', body, active: 'music' }));
});

/* ═══════════════════════════════════════════════════ */
/* ═══════════ SLASH: /admin ═════════════════════ */
/* ═══════════════════════════════════════════════════ */
app.get('/admin', (req, res) => {
  if (req.session.isAdmin) return res.redirect('/admin/dashboard');
  const body = `
<div class="login-container">
  <div class="login-card">
    <div class="login-lock"><i class="fas fa-lock"></i></div>
    <h1 class="login-title">Admin Login</h1>
    <p class="login-sub">Ingiza taarifa zako</p>
    ${req.query.error ? '<div class="login-error"><i class="fas fa-times-circle"></i> Jina au neno la siri si sahihi!</div>' : ''}
    <form method="POST" action="/admin">
      <div class="form-group">
        <i class="fas fa-user"></i>
        <input type="text" name="username" placeholder="Jina la Admin" required>
      </div>
      <div class="form-group">
        <i class="fas fa-key"></i>
        <input type="password" name="password" placeholder="Neno la Siri" required>
      </div>
      <button type="submit" class="btn-login"><i class="fas fa-sign-in-alt"></i> Ingia</button>
    </form>
    <div class="login-hint">💡 Default: <b>admin</b> / <b>shadrack2026</b></div>
    <a href="/" class="login-back"><i class="fas fa-arrow-left"></i> Rudi Nyumbani</a>
  </div>
</div>
`;
  res.send(layout({ title: 'Admin — Dr. Shadrack', body, active: 'admin' }));
});

app.post('/admin', (req, res) => {
  const { username, password } = req.body;
  if (username === CONFIG.ADMIN_USER && password === CONFIG.ADMIN_PASS) {
    req.session.isAdmin = true;
    return res.redirect('/admin/dashboard');
  }
  res.redirect('/admin?error=1');
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

/* ═══════════ ADMIN DASHBOARD ═══════════ */
function requireAuth(req, res, next) {
  if (req.session.isAdmin) return next();
  res.redirect('/admin');
}

app.get('/admin/dashboard', requireAuth, (req, res) => {
  const gallery = readData('gallery.json');
  const timeline = readData('timeline.json');
  const blessings = readData('blessings.json');

  const body = `
<div class="dashboard-header">
  <h1><i class="fas fa-sliders"></i> Admin Dashboard</h1>
  <div class="dash-actions">
    <a href="/home" class="dash-btn"><i class="fas fa-eye"></i> Tazama</a>
    <a href="/admin/logout" class="dash-btn danger"><i class="fas fa-sign-out-alt"></i> Toka</a>
  </div>
</div>

<div class="dashboard-stats">
  <div class="stat-card"><i class="fas fa-image"></i><div class="stat-num">${gallery.length}</div><div class="stat-lbl">Picha/Video</div></div>
  <div class="stat-card"><i class="fas fa-timeline"></i><div class="stat-num">${timeline.length}</div><div class="stat-lbl">Historia</div></div>
  <div class="stat-card"><i class="fas fa-comment-dots"></i><div class="stat-num">${blessings.length}</div><div class="stat-lbl">Baraka</div></div>
</div>

<div class="dashboard-sections">
  <div class="dash-card">
    <h2><i class="fas fa-plus-circle"></i> Ongeza Picha / Video</h2>
    
    <div id="uploadArea" class="upload-area">
      <input type="file" id="photoFile" accept="image/*,video/*" hidden>
      <div class="upload-icon"><i class="fas fa-cloud-upload-alt"></i></div>
      <div class="upload-text">Bofya kuchagua Picha au Video</div>
      <div class="upload-sub">JPG, PNG, GIF, MP4, MOV (Max 100MB)</div>
    </div>
    
    <div id="previewBox" class="preview-box" style="display:none;">
      <div id="previewContent"></div>
    </div>
    
    <input type="text" id="photoCaption" placeholder="Maelezo (mfano: Sherehe 🎉)">
    
    <button id="addPhotoBtn" class="dash-submit" disabled>
      <i class="fas fa-upload"></i> Pakia File
    </button>
    
    <div id="uploadProgress" class="upload-progress" style="display:none;">
      <div id="progressBar" class="progress-bar"></div>
      <div id="progressText" class="progress-text">0%</div>
    </div>
    
    <div id="photoList" class="item-list">
      ${gallery.map(g => `
        <div class="item-row">
          ${g.type === 'video' 
            ? `<video src="${g.url}" class="item-thumb" muted></video>` 
            : `<img src="${g.url}" class="item-thumb">`
          }
          <span>${g.type === 'video' ? '🎬 ' : '📸 '} ${g.caption}</span>
          <button onclick="deletePhoto(${g.id})" class="item-del"><i class="fas fa-trash"></i></button>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="dash-card">
    <h2><i class="fas fa-plus-circle"></i> Ongeza Historia</h2>
    <input type="text" id="tlYear" placeholder="Mwaka">
    <input type="text" id="tlTitle" placeholder="Kichwa">
    <textarea id="tlText" placeholder="Maelezo..." rows="3"></textarea>
    <button id="addTlBtn" class="dash-submit"><i class="fas fa-upload"></i> Ongeza</button>
    <div id="tlList" class="item-list">
      ${timeline.map(t => `
        <div class="item-row">
          <span><b>${t.year}</b> - ${t.title}</span>
          <button onclick="deleteTl(${t.id})" class="item-del"><i class="fas fa-trash"></i></button>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="dash-card full">
    <h2><i class="fas fa-comments"></i> Baraka za Wageni</h2>
    <div class="item-list">
      ${blessings.slice(-10).reverse().map(b => `
        <div class="item-row">
          <span><b>${b.name}</b> (${b.relation}): ${b.msg.substring(0, 60)}...</span>
          <button onclick="deleteBless(${b.id})" class="item-del"><i class="fas fa-trash"></i></button>
        </div>
      `).join('') || '<div class="item-empty">Hakuna baraka bado</div>'}
    </div>
  </div>
</div>

<script src="/js/admin.js"></script>
`;
  res.send(layout({ title: 'Dashboard — Admin', body, active: 'admin' }));
});

/* ═══════════════════════════════════════════════════ */
/* ═══════════ API ENDPOINTS ═════════════════════ */
/* ═══════════════════════════════════════════════════ */
app.get('/api/gallery', (req, res) => res.json({ success: true, data: readData('gallery.json') }));

app.post('/api/gallery', requireAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Chagua file!' });
    const isVideo = req.file.mimetype.startsWith('video/');
    const fileUrl = '/uploads/' + req.file.filename;
    const caption = req.body.caption || (isVideo ? 'Video 🎬' : 'Picha 📸');
    
    const gallery = readData('gallery.json');
    const newItem = {
      id: Date.now(),
      url: fileUrl,
      type: isVideo ? 'video' : 'image',
      caption,
      size: req.file.size,
      createdAt: new Date().toISOString()
    };
    gallery.push(newItem);
    writeData('gallery.json', gallery);
    res.json({ success: true, data: newItem });
  } catch (e) {
    console.error('Upload error:', e);
    res.status(500).json({ success: false, message: e.message });
  }
});

app.delete('/api/gallery/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const gallery = readData('gallery.json');
  const item = gallery.find(g => g.id === id);
  
  if (item && item.url && item.url.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, 'public', item.url);
    try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) {}
  }
  
  writeData('gallery.json', gallery.filter(g => g.id !== id));
  res.json({ success: true });
});

app.get('/api/timeline', (req, res) => res.json({ success: true, data: readData('timeline.json') }));

app.post('/api/timeline', requireAuth, (req, res) => {
  const { year, title, text } = req.body;
  if (!year || !title || !text) return res.status(400).json({ success: false, message: 'Jaza zote!' });
  const timeline = readData('timeline.json');
  const newItem = { id: Date.now(), year, title, text, createdAt: new Date().toISOString() };
  timeline.push(newItem);
  writeData('timeline.json', timeline);
  res.json({ success: true, data: newItem });
});

app.delete('/api/timeline/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  writeData('timeline.json', readData('timeline.json').filter(t => t.id !== id));
  res.json({ success: true });
});

app.get('/api/blessings', (req, res) => {
  const blessings = readData('blessings.json');
  res.json({ success: true, data: blessings.slice(-20).reverse() });
});

app.post('/api/blessings', (req, res) => {
  const { name, relation, msg } = req.body;
  if (!name || !relation || !msg) return res.status(400).json({ success: false, message: 'Jaza zote!' });
  const blessings = readData('blessings.json');
  const newItem = {
    id: Date.now(), name, relation, msg,
    date: new Date().toLocaleDateString('sw-TZ'),
    createdAt: new Date().toISOString()
  };
  blessings.push(newItem);
  writeData('blessings.json', blessings);
  res.json({ success: true, data: newItem });
});

app.delete('/api/blessings/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  writeData('blessings.json', readData('blessings.json').filter(b => b.id !== id));
  res.json({ success: true });
});

/* ═══════════ 404 ═══════════ */
app.use((req, res) => {
  const body = `
<div class="error-404">
  <div class="error-emoji">🔍</div>
  <h1>404</h1>
  <p>Ukurasa haupatikani!</p>
  <a href="/" class="btn-main"><i class="fas fa-home"></i> Rudi Nyumbani</a>
</div>
`;
  res.status(404).send(layout({ title: '404', body, active: 'error' }));
});

app.use((err, req, res, next) => {
  console.error('❌', err);
  res.status(500).json({ success: false, error: err.message });
});

process.on('uncaughtException', e => console.error('💥', e));
process.on('unhandledRejection', e => console.error('💥', e));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n╔══════════════════════════════════════════════╗`);
  console.log(`║  🎂 AILIFESOLUTION (ALS) — BIRTHDAY APP  🎂 ║`);
  console.log(`╚══════════════════════════════════════════════╝`);
  console.log(`✅ Server: http://localhost:${PORT}\n`);
  console.log(`📌 SLASHES:`);
  console.log(`   /                → Welcome`);
  console.log(`   /home            → Home`);
  console.log(`   /happybirthday   → Birthday`);
  console.log(`   /dr.shadrack     → Profile`);
  console.log(`   /gift            → Zawadi`);
  console.log(`   /music           → Muziki`);
  console.log(`   /admin           → Admin Login`);
  console.log(`   /admin/dashboard → Dashboard\n`);
  console.log(`👤 Admin: ${CONFIG.ADMIN_USER} / ${CONFIG.ADMIN_PASS}\n`);
});
