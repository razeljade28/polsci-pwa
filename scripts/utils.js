// utils.js – helpers
export function sanitizeHTML(str) {
  if (!str) return '';
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// PBKDF2 for stronger hashing (optional, but keep simpler for now)
export async function hashPBKDF2(password, salt = 'sepolscis-salt') {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// UI helpers
export const UI = {
  toast(opt) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    const msg = typeof opt === 'string' ? opt : opt.message;
    const type = typeof opt === 'string' ? 'info' : opt.type || 'info';
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    const progress = document.createElement('div');
    progress.className = 'toast-progress';
    el.appendChild(progress);
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => el.remove(), 300);
    }, 3000);
  },

  modal(html) {
    const container = document.getElementById('modal-container');
    const overlay = document.getElementById('overlay');
    if (!container) return;
    container.innerHTML = `<div class="modal show">${html}</div>`;
    overlay.classList.add('show');
    return { close: this.closeModal };
  },

  closeModal() {
    const container = document.getElementById('modal-container');
    const overlay = document.getElementById('overlay');
    if (container) container.innerHTML = '';
    if (overlay) overlay.classList.remove('show');
  },

  showLoading(show = true) {
    const screen = document.getElementById('loading-screen');
    if (screen) screen.style.display = show ? 'flex' : 'none';
  },

  hideLoading() {
    document.getElementById('loading-screen')?.style.setProperty('display', 'none');
  },

  confetti(opts = {}) {
    // ... (same as original)
  },

  floatExp(amount, x, y) {
    // ... (same as original)
  },

  emptyState(message, icon = 'inbox') {
    return `<div class="card text-center" style="padding:40px 20px;">
      <span class="material-symbols-rounded" style="font-size:64px;color:#c5d0b8;display:block;margin-bottom:16px;">${icon}</span>
      <p style="color:var(--text-light);font-size:1rem;">${sanitizeHTML(message)}</p>
    </div>`;
  },

  init() {
    // close modal on overlay click
    document.getElementById('overlay')?.addEventListener('click', this.closeModal);
  }
};