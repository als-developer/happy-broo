window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('adminIntro').classList.add('hide');
  }, 2500);
});

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'shadrack2026';
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

if (sessionStorage.getItem('shadrack_admin') === 'true') showDashboard();

loginBtn.addEventListener('click', () => {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem('shadrack_admin', 'true');
    loginError.textContent = '✅ Karibu Admin!';
    loginError.style.color = '#00ff88';
    setTimeout(showDashboard, 800);
  } else {
    loginError.textContent = '❌ Jina au neno la siri si sahihi!';
    loginError.style.color = '#ff3b3b';
    document.querySelector('.login-box').animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(0)' }
    ], { duration: 400 });
  }
});

document.getElementById('password').addEventListener('keypress', e => {
  if (e.key === 'Enter') loginBtn.click();
});

function showDashboard() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  loadAllData();
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('shadrack_admin');
  location.reload();
});

let gallery = JSON.parse(localStorage.getItem('shadrack_gallery') || '[]');
document.getElementById('addPhotoBtn').addEventListener('click', () => {
  const url = document.getElementById('photoUrl').value.trim();
  const caption = document.getElementById('photoCaption').value.trim() || 'Picha 🎉';
  if (!url) return alert('Weka URL ya picha!');
  gallery.push({ url, caption });
  localStorage.setItem('shadrack_gallery', JSON.stringify(gallery));
  document.getElementById('photoUrl').value = '';
  document.getElementById('photoCaption').value = '';
  renderGallery();
});

function renderGallery() {
  const list = document.getElementById('photoList');
  list.innerHTML = '';
  gallery.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `<span>${item.caption}</span><button onclick="deletePhoto(${i})">🗑️</button>`;
    list.appendChild(row);
  });
  document.getElementById('statPhotos').textContent = gallery.length;
}

window.deletePhoto = i => {
  gallery.splice(i, 1);
  localStorage.setItem('shadrack_gallery', JSON.stringify(gallery));
  renderGallery();
};

let timeline = JSON.parse(localStorage.getItem('shadrack_timeline') || '[]');
document.getElementById('addTlBtn').addEventListener('click', () => {
  const year = document.getElementById('tlYear').value.trim();
  const title = document.getElementById('tlTitle').value.trim();
  const text = document.getElementById('tlText').value.trim();
  if (!year || !title || !text) return alert('Jaza sehemu zote!');
  timeline.push({ year, title, text });
  localStorage.setItem('shadrack_timeline', JSON.stringify(timeline));
  document.getElementById('tlYear').value = '';
  document.getElementById('tlTitle').value = '';
  document.getElementById('tlText').value = '';
  renderTimeline();
});

function renderTimeline() {
  const list = document.getElementById('tlList');
  list.innerHTML = '';
  timeline.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `<span>${item.year} - ${item.title}</span><button onclick="deleteTl(${i})">🗑️</button>`;
    list.appendChild(row);
  });
  document.getElementById('statTimeline').textContent = timeline.length;
}

window.deleteTl = i => {
  timeline.splice(i, 1);
  localStorage.setItem('shadrack_timeline', JSON.stringify(timeline));
  renderTimeline();
};

document.getElementById('saveSettingsBtn').addEventListener('click', () => {
  const date = document.getElementById('birthdaySetting').value;
  if (date) {
    localStorage.setItem('shadrack_birthday', date);
    alert('✅ Tarehe imehifadhiwa!');
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Una uhakika unataka kufuta data yote?')) {
    ['shadrack_gallery','shadrack_timeline','shadrack_birthday','shadrack_blessings'].forEach(k => localStorage.removeItem(k));
    gallery = []; timeline = [];
    renderGallery(); renderTimeline();
    alert('🗑️ Data yote imefutwa!');
  }
});

function loadAllData() {
  renderGallery();
  renderTimeline();
  const savedDate = localStorage.getItem('shadrack_birthday');
  if (savedDate) document.getElementById('birthdaySetting').value = savedDate;
}
