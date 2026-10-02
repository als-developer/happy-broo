/* ═══════════ ADMIN — FILE UPLOAD ═══════════ */

async function api(url, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  return res.json();
}

/* ═══════════ UPLOAD SYSTEM ═══════════ */
const uploadArea = document.getElementById('uploadArea');
const photoFile = document.getElementById('photoFile');
const previewBox = document.getElementById('previewBox');
const previewContent = document.getElementById('previewContent');
const addPhotoBtn = document.getElementById('addPhotoBtn');
const photoCaption = document.getElementById('photoCaption');
const uploadProgress = document.getElementById('uploadProgress');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

let selectedFile = null;

if (uploadArea) {
  uploadArea.addEventListener('click', () => photoFile.click());
  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });
}

if (photoFile) {
  photoFile.addEventListener('change', e => {
    if (e.target.files.length) handleFile(e.target.files[0]);
  });
}

function handleFile(file) {
  if (file.size > 100 * 1024 * 1024) return alert('❌ File ni kubwa sana! Max 100MB');
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  if (!isImage && !isVideo) return alert('❌ Tumia picha au video tu!');

  selectedFile = file;
  const url = URL.createObjectURL(file);
  previewContent.innerHTML = isImage 
    ? `<img src="${url}" alt="preview">` 
    : `<video src="${url}" controls muted></video>`;

  const info = document.createElement('div');
  info.className = 'preview-info';
  info.innerHTML = `<i class="fas fa-file"></i><span>${file.name}</span><span class="file-size">${formatSize(file.size)}</span>`;
  previewContent.appendChild(info);

  previewBox.style.display = 'block';
  addPhotoBtn.disabled = false;
  uploadArea.style.display = 'none';
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

if (addPhotoBtn) {
  addPhotoBtn.addEventListener('click', async () => {
    if (!selectedFile) return alert('Chagua file!');
    const caption = photoCaption.value.trim() || (selectedFile.type.startsWith('video/') ? 'Video 🎬' : 'Picha 📸');
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('caption', caption);

    uploadProgress.style.display = 'block';
    addPhotoBtn.disabled = true;
    addPhotoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inapakia...';

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable) {
        const p = Math.round((e.loaded / e.total) * 100);
        progressBar.style.width = p + '%';
        progressText.textContent = p + '%';
      }
    });
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (data.success) {
          progressText.textContent = '✅ Imekamilika!';
          setTimeout(() => location.reload(), 800);
        } else {
          alert('❌ ' + data.message);
          resetUpload();
        }
      } else {
        alert('❌ Kosa la mtandao!');
        resetUpload();
      }
    });
    xhr.addEventListener('error', () => { alert('❌ Hitilafu!'); resetUpload(); });
    xhr.open('POST', '/api/gallery');
    xhr.send(formData);
  });
}

function resetUpload() {
  selectedFile = null;
  photoFile.value = '';
  previewBox.style.display = 'none';
  uploadArea.style.display = 'block';
  uploadProgress.style.display = 'none';
  progressBar.style.width = '0%';
  progressText.textContent = '0%';
  addPhotoBtn.disabled = true;
  addPhotoBtn.innerHTML = '<i class="fas fa-upload"></i> Pakia File';
}

/* ═══════════ TIMELINE ═══════════ */
const addTlBtn = document.getElementById('addTlBtn');
if (addTlBtn) {
  addTlBtn.addEventListener('click', async () => {
    const year = document.getElementById('tlYear').value.trim();
    const title = document.getElementById('tlTitle').value.trim();
    const text = document.getElementById('tlText').value.trim();
    if (!year || !title || !text) return alert('Jaza zote!');
    const data = await api('/api/timeline', 'POST', { year, title, text });
    if (data.success) location.reload();
    else alert('Kosa: ' + data.message);
  });
}

/* ═══════════ DELETE ═══════════ */
window.deletePhoto = async (id) => {
  if (confirm('Futa hii?')) { await api('/api/gallery/' + id, 'DELETE'); location.reload(); }
};
window.deleteTl = async (id) => {
  if (confirm('Futa hii?')) { await api('/api/timeline/' + id, 'DELETE'); location.reload(); }
};
window.deleteBless = async (id) => {
  if (confirm('Futa hii?')) { await api('/api/blessings/' + id, 'DELETE'); location.reload(); }
};
