import { Storage } from './storage.js';
import { UI } from './utils.js';

export const NotifCenter = {
  render() {
    const data = Storage.getAppData();
    const notifs = data.notifications || [];
    if (!notifs.length) {
      UI.modal(`
        <div style="text-align:center;padding:20px 0;">
          <span class="material-symbols-rounded" style="font-size:64px;color:#c5d0b8;">notifications_off</span>
          <h3 style="margin-top:12px;">No Notifications</h3>
          <p style="color:var(--text-light);">You're all caught up!</p>
          <button class="btn-primary" style="margin-top:16px;width:auto;padding:12px 28px;display:inline-flex;" data-close-modal>Close</button>
        </div>
      `);
      return;
    }

    let html = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h3>Notifications</h3>
        <button class="text-btn" id="mark-all-read" style="font-weight:600;color:var(--primary);">Mark all read</button>
      </div>
      <div style="max-height:400px;overflow-y:auto;">
    `;
    notifs.forEach(n => {
      html += `
        <div style="display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);${n.read ? 'opacity:0.6;' : ''}">
          <span class="material-symbols-rounded" style="color:var(--primary);font-size:28px;">${n.icon || 'notifications'}</span>
          <div style="flex:1;">
            <strong>${UI.sanitize(n.title || 'Update')}</strong>
            <p style="color:var(--text-light);font-size:0.9rem;margin-top:2px;">${UI.sanitize(n.message || '')}</p>
            <small style="color:#b0b8a8;font-size:0.75rem;">${n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}</small>
          </div>
        </div>
      `;
    });
    html += `</div><button class="btn-primary" style="margin-top:16px;width:auto;padding:12px 28px;display:inline-flex;" data-close-modal>Close</button>`;
    UI.modal(html);
    document.getElementById('mark-all-read')?.addEventListener('click', () => {
      Storage.markAllRead();
      UI.toast('All notifications marked as read.');
      this.updateBadge();
      UI.closeModal();
      this.render();
    });
  },

  updateBadge() {
    const count = Storage.getUnreadCount();
    const dot = document.getElementById('notif-dot');
    if (dot) dot.style.display = count > 0 ? 'block' : 'none';
  },

  add(title, message, type = 'info', icon = 'notifications') {
    Storage.addNotification({ title, message, type, icon });
    this.updateBadge();
    UI.toast({ message: title, type });
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: '/icons/icon-192.png' });
    }
  }
};