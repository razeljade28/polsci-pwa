// ================================================================
// CONSTANTS
// ================================================================
const C = {
  STORAGE_KEYS: {
    APP_DATA: 'appData',
    CURRENT_USER: 'currentUser',
    DARK_MODE: 'darkMode',
    LAST_BACKUP: 'lastBackup',
  },
  ROLES: {
    MEMBER: 'member',
    OFFICER: 'officer',
    ADVISER: 'adviser',
    GRIEVANCE: 'grievance',
  },
  EVENT_TYPES: ['assembly', 'competition', 'sports', 'volunteer'],
  DEFAULT_EXP: 50,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  LEVELS: [
    { level: 1, exp: 0, title: 'New Member' },
    { level: 2, exp: 100, title: 'Active Member' },
    { level: 3, exp: 300, title: 'Dedicated Member' },
    { level: 4, exp: 600, title: 'Senior Member' },
    { level: 5, exp: 1000, title: 'Elite Member' },
    { level: 6, exp: 1500, title: 'Master Member' },
    { level: 7, exp: 2100, title: 'Legend' },
  ],
};

// ================================================================
// UTILITY: Password Hashing (with fallback)
// ================================================================
async function hashPassword(password) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'SEPOLSCIS_SALT');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (e) {
    console.warn('Crypto not available, using simple hash fallback');
    // Fallback (not secure, but better than plain text)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'fallback_' + hash;
  }
}

async function verifyPassword(password, hash) {
  if (hash.startsWith('fallback_')) {
    // Simple fallback verification
    const simpleHash = await hashPassword(password);
    return simpleHash === hash;
  }
  const hashed = await hashPassword(password);
  return hashed === hash;
}

// ================================================================
// SERVICE: MemberService
// ================================================================
const MemberService = {
  getActive() {
    return Storage.getAppData().members.filter(m => m.membership === 'Active');
  },
  getTop(limit = 5) {
    return [...Storage.getAppData().members]
      .sort((a, b) => b.exp - a.exp)
      .slice(0, limit);
  },
  getByYear(year) {
    return Storage.getAppData().members.filter(m => m.year === year);
  },
  getBadgeCount(badgeId) {
    return Storage.getAppData().members.filter(m => m.badges?.includes(badgeId)).length;
  },
};

// ================================================================
// SERVICE: EventService
// ================================================================
const EventService = {
  getUpcoming() {
    const now = new Date();
    return Storage.getAppData().events
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  },
  getPast() {
    const now = new Date();
    return Storage.getAppData().events
      .filter(e => new Date(e.date) < now)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },
};

// ================================================================
// MODULE: Storage (with migration & error handling)
// ================================================================
const Storage = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  getAppData() {
    let data = this.get(C.STORAGE_KEYS.APP_DATA);
    if (!data) {
      data = this.getDefaultData();
      this.saveAppData(data);
    }
    return data;
  },
  saveAppData(data) {
    this.set(C.STORAGE_KEYS.APP_DATA, data);
  },
  getDefaultData() {
    return {
      events: [
        { id: 1, title: 'General Assembly', date: '2026-07-20', type: 'assembly', exp: 50, location: 'Room 101',
          description: 'Monthly general assembly for all members.' },
        { id: 2, title: 'Debate Competition', date: '2026-07-25', type: 'competition', exp: 100,
          location: 'Auditorium', description: 'Inter-school debate competition.' },
        { id: 3, title: 'Basketball Intrams', date: '2026-08-01', type: 'sports', exp: 75,
          location: 'Gymnasium', description: 'Intramural basketball tournament.' },
        { id: 4, title: 'Quiz Bee', date: '2026-08-10', type: 'competition', exp: 80, location: 'Room 203',
          description: 'Political Science quiz bee.' },
        { id: 5, title: 'Volunteer Drive', date: '2026-08-15', type: 'volunteer', exp: 50,
          location: 'Community Center', description: 'Community outreach program.' },
      ],
      members: [{
        studentId: '2024-0001',
        name: 'Juan dela Cruz',
        year: '2',
        course: 'B.A. Political Science',
        position: '',
        membership: 'Active',
        exp: 320,
        attendance: ['2026-07-01', '2026-07-08', '2026-07-15'],
        badges: ['b1'],
        achievements: ['Debate Winner Q1'],
        gradeConvRequested: false,
        email: 'juan@example.com',
        password: '',
        role: 'member',
      }, {
        studentId: 'officer1',
        name: 'Maria Santos',
        year: '3',
        course: 'B.A. Political Science',
        position: 'President',
        membership: 'Active',
        exp: 560,
        attendance: ['2026-07-01', '2026-07-08', '2026-07-15', '2026-07-22'],
        badges: ['b5', 'b3'],
        achievements: ['Best Leader 2025'],
        gradeConvRequested: false,
        email: 'maria@example.com',
        password: '',
        role: 'officer',
      }, {
        studentId: '2024-0002',
        name: 'Pedro Reyes',
        year: '1',
        course: 'B.A. Political Science',
        position: '',
        membership: 'Active',
        exp: 180,
        attendance: ['2026-07-01', '2026-07-15'],
        badges: [],
        achievements: [],
        gradeConvRequested: false,
        email: 'pedro@example.com',
        password: '',
        role: 'member',
      }, {
        studentId: '2024-0003',
        name: 'Ana Flores',
        year: '2',
        course: 'B.A. Political Science',
        position: 'Secretary',
        membership: 'Active',
        exp: 420,
        attendance: ['2026-07-01', '2026-07-08', '2026-07-15', '2026-07-22'],
        badges: ['b2'],
        achievements: ['Top Performer Q2'],
        gradeConvRequested: false,
        email: 'ana@example.com',
        password: '',
        role: 'member',
      }, {
        studentId: '2024-0004',
        name: 'Carlos Mendoza',
        year: '3',
        course: 'B.A. Political Science',
        position: '',
        membership: 'Active',
        exp: 720,
        attendance: ['2026-07-01', '2026-07-08', '2026-07-15', '2026-07-22', '2026-07-29'],
        badges: ['b1', 'b4'],
        achievements: ['Quiz Bee Champion 2025', 'Debate Finalist'],
        gradeConvRequested: true,
        email: 'carlos@example.com',
        password: '',
        role: 'member',
      }],
      grievances: [{
        id: 'g1',
        memberId: '2024-0001',
        title: 'Schedule Conflict',
        description: 'The general assembly conflicts with my class schedule.',
        anonymous: false,
        status: 'submitted',
        createdAt: '2026-07-10T10:00:00',
        updatedAt: '2026-07-10T10:00:00',
        notes: '',
        resolution: ''
      }, {
        id: 'g2',
        memberId: 'officer1',
        title: 'Event Venue Issue',
        description: 'The debate venue is too small for the expected participants.',
        anonymous: true,
        status: 'in-progress',
        createdAt: '2026-07-12T14:30:00',
        updatedAt: '2026-07-14T09:00:00',
        notes: 'Looking for alternative venue.',
        resolution: ''
      }],
      announcements: [
        'Welcome to SEPOLSCIS! Please complete your profile.',
        'General Assembly on July 20 at Room 101. See you there!',
        'Debate Competition registration is now open until July 22.'
      ],
      notifications: [],
      checkIns: [],
      learningResources: {
        constitution: 'The Political Science Student Organization Constitution...',
        bylaws: 'Article I: Name and Purpose...',
        news: 'Latest updates from the department...',
        government: 'Recent government policies and updates...',
        reviewer: 'Midterm reviewer for POLSCI 101...'
      }
    };
  },
  getCurrentUser() {
    return this.get(C.STORAGE_KEYS.CURRENT_USER);
  },
  setCurrentUser(user) {
    this.set(C.STORAGE_KEYS.CURRENT_USER, user);
  },
  removeCurrentUser() {
    this.remove(C.STORAGE_KEYS.CURRENT_USER);
  },
  getMember(studentId) {
    const data = this.getAppData();
    return data.members.find(m => m.studentId === studentId) || null;
  },
  updateMember(studentId, updates) {
    const data = this.getAppData();
    const idx = data.members.findIndex(m => m.studentId === studentId);
    if (idx === -1) return null;
    data.members[idx] = { ...data.members[idx], ...updates };
    this.saveAppData(data);
    return data.members[idx];
  },
  addEvent(event) {
    const data = this.getAppData();
    event.id = Date.now();
    data.events.push(event);
    this.saveAppData(data);
    return event;
  },
  updateEvent(id, updates) {
    const data = this.getAppData();
    const idx = data.events.findIndex(e => e.id === id);
    if (idx === -1) return null;
    data.events[idx] = { ...data.events[idx], ...updates };
    this.saveAppData(data);
    return data.events[idx];
  },
  deleteEvent(id) {
    const data = this.getAppData();
    data.events = data.events.filter(e => e.id !== id);
    this.saveAppData(data);
  },
  addAnnouncement(text) {
    const data = this.getAppData();
    data.announcements.unshift(text);
    this.saveAppData(data);
  },
  addGrievance(g) {
    const data = this.getAppData();
    g.id = 'g' + Date.now();
    g.createdAt = new Date().toISOString();
    g.updatedAt = g.createdAt;
    data.grievances.push(g);
    this.saveAppData(data);
    return g;
  },
  updateGrievance(id, updates) {
    const data = this.getAppData();
    const idx = data.grievances.findIndex(g => g.id === id);
    if (idx === -1) return null;
    data.grievances[idx] = { ...data.grievances[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveAppData(data);
    return data.grievances[idx];
  },
  addNotification(notif) {
    const data = this.getAppData();
    notif.id = 'n' + Date.now();
    notif.read = false;
    notif.createdAt = new Date().toISOString();
    if (!data.notifications) data.notifications = [];
    data.notifications.unshift(notif);
    this.saveAppData(data);
    return notif;
  },
  getUnreadCount() {
    const data = this.getAppData();
    if (!data.notifications) return 0;
    return data.notifications.filter(n => !n.read).length;
  },
  markAllRead() {
    const data = this.getAppData();
    if (data.notifications) {
      data.notifications.forEach(n => n.read = true);
      this.saveAppData(data);
    }
  },
  // Migration: hash all plain-text passwords on load (with error handling)
  async migratePasswords() {
    try {
      const data = this.getAppData();
      let changed = false;
      for (const member of data.members) {
        if (member.password && member.password.length < 60 && !member.password.startsWith('fallback_')) {
          member.password = await hashPassword(member.password);
          changed = true;
        }
      }
      if (changed) {
        this.saveAppData(data);
      }
    } catch (e) {
      console.warn('Password migration failed:', e);
    }
  }
};

// ================================================================
// MODULE: Auth (with robust validation)
// ================================================================
const Auth = {
  currentUser: null,
  sessionTimer: null,

  async init() {
    try {
      await Storage.migratePasswords();
      this.currentUser = Storage.getCurrentUser();
      if (this.currentUser) {
        const member = Storage.getMember(this.currentUser.studentId);
        if (member) {
          this.currentUser = { ...member, role: member.role || C.ROLES.MEMBER };
          Storage.setCurrentUser(this.currentUser);
          this.startSessionTimer();
          return true;
        } else {
          // Stale user – remove and return false
          Storage.removeCurrentUser();
          this.currentUser = null;
          return false;
        }
      }
      return false;
    } catch (e) {
      console.error('Auth.init error:', e);
      return false;
    }
  },

  startSessionTimer() {
    this.clearSessionTimer();
    this.sessionTimer = setTimeout(() => {
      UI.toast({ message: 'Session expired. Please login again.', type: 'warning' });
      this.logout();
      window.location.href = 'login.html';
    }, C.SESSION_TIMEOUT);
  },

  clearSessionTimer() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  },

  resetSessionTimer() {
    if (this.currentUser) {
      this.clearSessionTimer();
      this.startSessionTimer();
    }
  },

  async login(studentId, password) {
    if (!studentId) return { success: false, message: 'Student ID is required.' };
    if (!password) return { success: false, message: 'Password is required.' };

    const data = Storage.getAppData();
    let member = data.members.find(m => m.studentId === studentId);

    if (!member) {
      return { success: false, message: 'Account not found. Please sign up.' };
    }

    // If password is plain text (migration missed), hash it
    let isValid = false;
    if (member.password && member.password.length < 60 && !member.password.startsWith('fallback_')) {
      member.password = await hashPassword(member.password);
      Storage.saveAppData(data);
    }

    if (member.password) {
      isValid = await verifyPassword(password, member.password);
    } else {
      // No password set – set it now
      member.password = await hashPassword(password);
      Storage.saveAppData(data);
      isValid = true;
    }

    if (!isValid) {
      return { success: false, message: 'Invalid password.' };
    }

    // Ensure role is set
    member.role = member.role || C.ROLES.MEMBER;
    this.currentUser = { ...member, role: member.role };
    Storage.setCurrentUser(this.currentUser);
    this.startSessionTimer();

    Storage.addNotification({
      type: 'info',
      title: 'Welcome back!',
      message: `You logged in as ${member.name}`,
      icon: 'login'
    });

    return { success: true, user: this.currentUser };
  },

  async signup(studentId, password, name, year, course) {
    const data = Storage.getAppData();
    const existing = data.members.find(m => m.studentId === studentId);
    if (existing) {
      return { success: false, message: 'Student ID already registered.' };
    }

    const hashedPassword = await hashPassword(password);
    const newMember = {
      studentId,
      name: name || studentId,
      year: year || '1',
      course: course || 'B.A. Political Science',
      position: '',
      membership: 'Active',
      exp: 0,
      attendance: [],
      badges: [],
      achievements: [],
      gradeConvRequested: false,
      email: '',
      password: hashedPassword,
      role: C.ROLES.MEMBER,
    };

    data.members.push(newMember);
    Storage.saveAppData(data);

    return { success: true, user: newMember };
  },

  logout() {
    this.clearSessionTimer();
    Storage.removeCurrentUser();
    this.currentUser = null;
  },

  isOfficer() {
    return this.currentUser && [C.ROLES.OFFICER, C.ROLES.ADVISER, C.ROLES.GRIEVANCE].includes(this.currentUser.role);
  },

  isAdviser() {
    return this.currentUser && this.currentUser.role === C.ROLES.ADVISER;
  },

  isGrievance() {
    return this.currentUser && this.currentUser.role === C.ROLES.GRIEVANCE;
  },

  getRole() {
    return this.currentUser ? this.currentUser.role : C.ROLES.MEMBER;
  },

  // Officer-only: assign role
  assignRole(studentId, role) {
    if (!this.isOfficer()) return null;
    const member = Storage.getMember(studentId);
    if (!member) return null;
    member.role = role;
    Storage.updateMember(studentId, { role });
    return member;
  }
};

// ================================================================
// MODULE: UI Helpers (enhanced)
// ================================================================
const UI = {
  toast(opt) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    const msg = typeof opt === 'string' ? opt : opt.message;
    const type = typeof opt === 'string' ? 'info' : opt.type || 'info';
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => el.remove(), 300);
    }, 3000);
  },

  modal(html, opts = {}) {
    const container = document.getElementById('modal-container');
    if (!container) return;
    const overlay = document.getElementById('overlay');
    const div = document.createElement('div');
    div.className = 'modal show';
    div.innerHTML = html;
    container.innerHTML = '';
    container.appendChild(div);
    overlay.classList.add('show');

    const close = () => {
      div.classList.remove('show');
      overlay.classList.remove('show');
      setTimeout(() => { container.innerHTML = ''; }, 300);
    };

    overlay.onclick = close;

    div.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', close);
    });

    return { close, element: div };
  },

  closeModal() {
    const container = document.getElementById('modal-container');
    const overlay = document.getElementById('overlay');
    if (container) container.innerHTML = '';
    if (overlay) overlay.classList.remove('show');
  },

  showLoading(message = 'Loading...') {
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.style.cssText = `
        position:fixed; inset:0; background:rgba(0,0,0,0.5);
        display:flex; flex-direction:column; justify-content:center; align-items:center;
        z-index:9999; backdrop-filter:blur(4px);
      `;
      overlay.innerHTML = `
        <div style="background:white; border-radius:24px; padding:30px 40px; text-align:center; max-width:280px;">
          <div class="loader-ring" style="width:50px; height:50px; margin:0 auto 16px;"></div>
          <p style="font-weight:600;" id="loading-message">${message}</p>
        </div>
      `;
      document.body.appendChild(overlay);
    } else {
      document.getElementById('loading-message').textContent = message;
      overlay.style.display = 'flex';
    }
  },

  hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
  },

  confetti(options = {}) {
    const count = options.count || 80;
    const colors = ['#759954', '#A9C88B', '#FFD54F', '#FF6B6B', '#4ECDC4', '#45B7D1'];
    const container = document.createElement('div');
    container.style.cssText =
      'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const size = 6 + Math.random() * 8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 0.5;
      const duration = 1.5 + Math.random() * 2;
      const rotation = Math.random() * 720;

      el.style.cssText = `
        position:absolute;
        top:-10px;
        left:${left}%;
        width:${size}px;
        height:${size * (0.5 + Math.random() * 0.5)}px;
        background:${color};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confettiFall ${duration}s ease-in ${delay}s forwards;
        transform: rotate(${rotation}deg);
        opacity:1;
      `;
      container.appendChild(el);
    }

    if (!document.getElementById('confetti-style')) {
      const style = document.createElement('style');
      style.id = 'confetti-style';
      style.textContent = `
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity:1; }
          100% { transform: translateY(100vh) rotate(720deg) scale(0.3); opacity:0; }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => container.remove(), 3000);
  },

  floatExp(amount, x, y) {
    const el = document.createElement('div');
    el.textContent = `+${amount} EXP`;
    el.style.cssText = `
      position:fixed;
      left:${x}px;
      top:${y}px;
      font-weight:800;
      font-size:28px;
      color:#759954;
      pointer-events:none;
      z-index:9999;
      animation: floatExpUp 1.2s ease-out forwards;
      text-shadow:0 2px 10px rgba(117,153,84,0.3);
    `;
    document.body.appendChild(el);

    if (!document.getElementById('float-exp-style')) {
      const style = document.createElement('style');
      style.id = 'float-exp-style';
      style.textContent = `
        @keyframes floatExpUp {
          0% { opacity:1; transform: translateY(0) scale(1); }
          100% { opacity:0; transform: translateY(-80px) scale(1.4); }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => el.remove(), 1300);
  },

  skeleton(count = 3, type = 'card') {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="card skeleton" style="padding:20px;animation:shimmer 1.5s infinite;">
          <div style="height:20px;width:70%;background:#e8ece4;border-radius:8px;margin-bottom:12px;"></div>
          <div style="height:14px;width:90%;background:#e8ece4;border-radius:6px;margin-bottom:8px;"></div>
          <div style="height:14px;width:60%;background:#e8ece4;border-radius:6px;"></div>
        </div>
      `;
    }
    return html;
  },

  emptyState(message, icon = 'inbox', action = null, emoji = '📭') {
    let html = `
      <div class="card text-center" style="padding:40px 20px;">
        <div style="font-size:64px;margin-bottom:16px;">${emoji}</div>
        <p style="color:var(--text-light);font-size:1rem;">${message}</p>
    `;
    if (action) {
      html += `<button class="btn-primary" style="margin-top:16px;width:auto;padding:12px 28px;display:inline-flex;" onclick="${action}">Take Action</button>`;
    }
    html += `</div>`;
    return html;
  }
};

// ================================================================
// MODULE: Notifications
// ================================================================
const NotifCenter = {
  render() {
    const data = Storage.getAppData();
    const notifs = data.notifications || [];

    if (notifs.length === 0) {
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
      const icon = n.icon || 'notifications';
      html += `
        <div style="display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);${n.read ? 'opacity:0.6;' : ''}">
          <span class="material-symbols-rounded" style="color:var(--primary);font-size:28px;">${icon}</span>
          <div style="flex:1;">
            <strong>${n.title || 'Update'}</strong>
            <p style="color:var(--text-light);font-size:0.9rem;margin-top:2px;">${n.message || ''}</p>
            <small style="color:#b0b8a8;font-size:0.75rem;">${n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}</small>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    html +=
      `<button class="btn-primary" style="margin-top:16px;width:auto;padding:12px 28px;display:inline-flex;" data-close-modal>Close</button>`;

    UI.modal(html);

    document.getElementById('mark-all-read')?.addEventListener('click', () => {
      Storage.markAllRead();
      UI.toast('All notifications marked as read.');
      NotifCenter.updateBadge();
      UI.closeModal();
      NotifCenter.render();
    });
  },

  updateBadge() {
    const count = Storage.getUnreadCount();
    const dot = document.getElementById('notif-dot');
    if (dot) {
      dot.style.display = count > 0 ? 'block' : 'none';
    }
  },

  add(title, message, type = 'info', icon = 'notifications') {
    Storage.addNotification({ title, message, type, icon });
    this.updateBadge();
    UI.toast({ message: title, type: type });
  }
};

// ================================================================
// MODULE: EXP & Gamification (uses constants)
// ================================================================
const Gamification = {
  LEVELS: C.LEVELS,

  getLevel(exp) {
    let result = this.LEVELS[0];
    for (const lv of this.LEVELS) {
      if (exp >= lv.exp) result = lv;
    }
    return result;
  },

  getNextLevel(exp) {
    for (const lv of this.LEVELS) {
      if (exp < lv.exp) return lv;
    }
    return null;
  },

  getProgress(exp) {
    const current = this.getLevel(exp);
    const next = this.getNextLevel(exp);
    if (!next) return 100;
    const range = next.exp - current.exp;
    const progress = ((exp - current.exp) / range) * 100;
    return Math.min(Math.max(progress, 0), 100);
  },

  addExp(studentId, amount, reason) {
    const data = Storage.getAppData();
    const member = data.members.find(m => m.studentId === studentId);
    if (!member) return null;

    const oldExp = member.exp;
    const oldLevel = this.getLevel(oldExp);
    member.exp += amount;
    const newLevel = this.getLevel(member.exp);

    Storage.saveAppData(data);

    if (newLevel.level > oldLevel.level) {
      NotifCenter.add(
        `Level Up! ${newLevel.title}`,
        `You reached Level ${newLevel.level} with ${member.exp} EXP!`,
        'success',
        'rocket_launch'
      );
      UI.confetti({ count: 100 });
      this.checkBadges(studentId);
    }

    if (Auth.currentUser && Auth.currentUser.studentId === studentId) {
      Auth.currentUser.exp = member.exp;
      Storage.setCurrentUser(Auth.currentUser);
    }

    return { oldExp, newExp: member.exp, gained: amount, level: newLevel };
  },

  getBadgeDefinitions() {
    return [
      { id: 'b1', name: 'New Member', icon: '🌟', condition: 'exp >= 0', desc: 'Joined the organization' },
      { id: 'b2', name: 'Active Member', icon: '🔥', condition: 'exp >= 100', desc: 'Reached 100 EXP' },
      { id: 'b3', name: 'Perfect Attendance', icon: '✅', condition: 'attendance >= 5',
      desc: '5 events attended' },
      { id: 'b4', name: 'Best Debater', icon: '🎤', condition: 'achievements.includes("Debate Winner")',
        desc: 'Won a debate competition' },
      { id: 'b5', name: 'MVP', icon: '🏀', condition: 'achievements.includes("Sports MVP")',
        desc: 'MVP in sports' },
      { id: 'b6', name: 'Quiz Bee Champ', icon: '🏆', condition: 'achievements.includes("Quiz Bee Champion")',
        desc: 'Won the Quiz Bee' },
      { id: 'b7', name: 'Volunteer', icon: '🤝', condition: 'exp >= 200', desc: 'Reached 200 EXP' },
      { id: 'b8', name: 'President', icon: '👑', condition: 'position === "President"',
      desc: 'Served as President' },
      { id: 'b9', name: 'Dean\'s Award', icon: '🎓', condition: 'exp >= 500', desc: 'Reached 500 EXP' },
      { id: 'b10', name: 'Senior Member', icon: '⭐', condition: 'exp >= 300', desc: 'Reached 300 EXP' },
    ];
  },

  checkBadges(studentId) {
    const data = Storage.getAppData();
    const member = data.members.find(m => m.studentId === studentId);
    if (!member) return;

    const definitions = this.getBadgeDefinitions();
    let unlocked = 0;

    definitions.forEach(def => {
      if (member.badges.includes(def.id)) return;
      let conditionMet = false;
      try {
        const exp = member.exp;
        const attendance = member.attendance ? member.attendance.length : 0;
        const achievements = member.achievements || [];
        const position = member.position || '';
        conditionMet = new Function('exp', 'attendance', 'achievements', 'position',
          `return ${def.condition};`)(exp, attendance, achievements, position);
      } catch {
        conditionMet = false;
      }

      if (conditionMet) {
        member.badges.push(def.id);
        unlocked++;
        NotifCenter.add(
          `Badge Unlocked: ${def.name}`,
          `You earned the "${def.name}" badge! ${def.desc}`,
          'success',
          'workspace_premium'
        );
        UI.confetti({ count: 60 });
      }
    });

    if (unlocked > 0) {
      Storage.saveAppData(data);
      if (Auth.currentUser && Auth.currentUser.studentId === studentId) {
        Auth.currentUser.badges = member.badges;
        Storage.setCurrentUser(Auth.currentUser);
      }
    }
  },

  getMemberBadges(studentId) {
    const data = Storage.getAppData();
    const member = data.members.find(m => m.studentId === studentId);
    if (!member) return [];
    const definitions = this.getBadgeDefinitions();
    return definitions.map(def => ({
      ...def,
      unlocked: member.badges.includes(def.id)
    }));
  }
};

// ================================================================
// MODULE: Dashboard (with Activity Feed)
// ================================================================
const Dashboard = {
  render() {
    try {
      const user = Auth.currentUser;
      if (!user) return;
      const data = Storage.getAppData();
      const member = data.members.find(m => m.studentId === user.studentId);
      if (!member) return;

      const level = Gamification.getLevel(member.exp);
      const progress = Gamification.getProgress(member.exp);
      const nextLevel = Gamification.getNextLevel(member.exp);
      const badges = Gamification.getMemberBadges(member.studentId);
      const unlocked = badges.filter(b => b.unlocked);
      const upcoming = EventService.getUpcoming().slice(0, 3);

      // Activity feed (recent check-ins)
      let activities = [];
      (data.checkIns || []).forEach(c => {
        const ev = data.events.find(e => e.id === c.eventId);
        activities.push({
          type: 'checkin',
          memberId: c.memberId,
          title: `Checked in to ${ev?.title || 'an event'}`,
          date: c.date,
          exp: c.exp,
          isYou: c.memberId === user.studentId
        });
      });
      activities.sort((a, b) => new Date(b.date) - new Date(a.date));
      const recentActivities = activities.slice(0, 5);

      let html = `
        <!-- EXP Card -->
        <div class="card exp-card">
          <div style="position:relative;z-index:1;">
            <p style="opacity:0.8;">${user.role === C.ROLES.OFFICER ? '👋 Officer' : '👋 Member'}</p>
            <h2>Hello, ${member.name}</h2>
            <div style="display:flex;gap:20px;margin-top:6px;flex-wrap:wrap;">
              <span><strong>${member.exp}</strong> EXP</span>
              <span><strong>Level ${level.level}</strong> ${level.title}</span>
              <span><strong>${member.attendance?.length || 0}</strong> Attendances</span>
            </div>
            <div class="exp-progress" style="margin-top:12px;">
              <span style="width:${progress}%;"></span>
            </div>
            ${nextLevel ? `<p style="margin-top:6px;font-size:0.8rem;opacity:0.7;">${nextLevel.exp - member.exp} EXP until ${nextLevel.title}</p>` : '<p style="margin-top:6px;font-size:0.8rem;opacity:0.7;">🏆 Max Level!</p>'}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-title">
            <h3>Quick Actions</h3>
          </div>
          <div class="quick-grid">
            <div class="quick-item" onclick="window.__nav('events')">
              <span class="material-symbols-rounded">event</span>
              <h4>Events</h4>
              <p>View upcoming</p>
            </div>
            <div class="quick-item" onclick="window.__nav('profile')">
              <span class="material-symbols-rounded">person</span>
              <h4>Profile</h4>
              <p>Your stats</p>
            </div>
            <div class="quick-item" onclick="window.__checkin()">
              <span class="material-symbols-rounded">qr_code_scanner</span>
              <h4>Check In</h4>
              <p>Scan QR</p>
            </div>
            <div class="quick-item" onclick="window.__showGrievance()">
              <span class="material-symbols-rounded">gavel</span>
              <h4>Grievance</h4>
              <p>Submit report</p>
            </div>
          </div>
        </div>
      `;

      // Badges
      if (unlocked.length > 0) {
        html += `
          <div class="card">
            <div class="card-title">
              <h3>Your Badges</h3>
              <span style="font-size:0.8rem;color:var(--text-light);">${unlocked.length} unlocked</span>
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              ${unlocked.slice(0,6).map(b => `
                <div style="text-align:center;width:60px;">
                  <div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#FFD54F,#FFB300);display:flex;justify-content:center;align-items:center;font-size:24px;margin:auto;box-shadow:0 4px 12px rgba(255,193,7,0.3);">${b.icon}</div>
                  <small style="font-size:0.65rem;color:var(--text-light);display:block;margin-top:4px;">${b.name}</small>
                </div>
              `).join('')}
              ${unlocked.length > 6 ? `<div style="text-align:center;width:60px;display:flex;flex-direction:column;justify-content:center;align-items:center;"><span style="font-size:1.2rem;font-weight:700;color:var(--primary);">+${unlocked.length-6}</span><small style="font-size:0.65rem;color:var(--text-light);">more</small></div>` : ''}
            </div>
          </div>
        `;
      }

      // Officer panel
      if (Auth.isOfficer()) {
        const pendingGrievance = data.grievances.filter(g => g.status === 'submitted' || g.status === 'in-progress').length;
        const pendingGradeConv = data.members.filter(m => m.gradeConvRequested).length;
        const totalMembers = data.members.length;

        html += `
          <div class="card" style="background:var(--accent);">
            <div class="card-title">
              <h3>🛡️ Officer Dashboard</h3>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
              <div style="background:white;border-radius:16px;padding:14px;text-align:center;">
                <div style="font-size:1.8rem;font-weight:800;color:var(--primary);">${totalMembers}</div>
                <small style="color:var(--text-light);">Members</small>
              </div>
              <div style="background:white;border-radius:16px;padding:14px;text-align:center;cursor:pointer;" onclick="window.__viewGrievances()">
                <div style="font-size:1.8rem;font-weight:800;color:var(--danger);">${pendingGrievance}</div>
                <small style="color:var(--text-light);">Grievances</small>
              </div>
              <div style="background:white;border-radius:16px;padding:14px;text-align:center;cursor:pointer;" onclick="window.__viewGradeRequests()">
                <div style="font-size:1.8rem;font-weight:800;color:var(--warning);">${pendingGradeConv}</div>
                <small style="color:var(--text-light);">Grade Req</small>
              </div>
            </div>
            <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;">
              <button class="btn-primary" style="flex:1;padding:10px;font-size:0.85rem;" onclick="window.__awardBadge()">Award Badge</button>
              <button class="btn-primary" style="flex:1;padding:10px;font-size:0.85rem;background:var(--primary-dark);" onclick="window.__showAnnouncementForm()">Post Announcement</button>
            </div>
            <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;">
              <button class="btn-primary" style="flex:1;padding:10px;font-size:0.85rem;background:var(--text-light);" onclick="window.__createEvent()">+ Create Event</button>
            </div>
          </div>
        `;
      }

      // Announcements
      html += `
        <div class="card">
          <div class="card-title">
            <h3>📢 Announcements</h3>
          </div>
          ${data.announcements.length === 0 ? '<p style="color:var(--text-light);">No announcements yet.</p>' :
          data.announcements.slice(0,3).map(a => `
            <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:flex-start;">
              <span class="material-symbols-rounded" style="color:var(--primary);font-size:20px;">campaign</span>
              <p style="margin:0;flex:1;">${a}</p>
            </div>
          `).join('')}
          ${data.announcements.length > 3 ? `<p style="margin-top:8px;color:var(--text-light);font-size:0.85rem;">+${data.announcements.length-3} more</p>` : ''}
        </div>
      `;

      // Upcoming Events
      html += `
        <div class="card">
          <div class="card-title">
            <h3>📅 Upcoming Events</h3>
            <a href="#" onclick="window.__nav('events');return false;" style="color:var(--primary);font-weight:600;font-size:0.85rem;">See all</a>
          </div>
          ${upcoming.length === 0 ? '<p style="color:var(--text-light);">No upcoming events.</p>' :
          upcoming.map(e => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">
              <div>
                <strong>${e.title}</strong>
                <p style="font-size:0.8rem;color:var(--text-light);margin:0;">${e.date} • ${e.type}</p>
              </div>
              <span style="background:#EEF6E8;padding:4px 12px;border-radius:20px;font-weight:700;font-size:0.8rem;color:var(--primary-dark);">+${e.exp} EXP</span>
            </div>
          `).join('')}
        </div>
      `;

      // Leaderboard
      const topMembers = MemberService.getTop(5);
      html += `
        <div class="card">
          <div class="card-title">
            <h3>🏆 Leaderboard</h3>
            <a href="#" onclick="window.__showLeaderboard();return false;" style="color:var(--primary);font-weight:600;font-size:0.85rem;">View all</a>
          </div>
          ${topMembers.map((m, i) => `
            <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:${i < topMembers.length-1 ? '1px solid var(--border)' : 'none'};">
              <span style="font-weight:700;width:24px;color:${i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--text-light)'};">#${i+1}</span>
              <span style="flex:1;font-weight:${i < 3 ? '600' : '400'};">${m.name}</span>
              <span style="font-weight:700;color:var(--primary);">${m.exp} EXP</span>
            </div>
          `).join('')}
        </div>
      `;

      // Activity Feed
      if (recentActivities.length > 0) {
        html += `
          <div class="card">
            <div class="card-title">
              <h3>📋 Activity Feed</h3>
            </div>
            ${recentActivities.map(a => `
              <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border);">
                <span class="material-symbols-rounded" style="color:var(--primary);font-size:22px;">${a.isYou ? 'person' : 'people'}</span>
                <div style="flex:1;">
                  <span style="font-weight:${a.isYou ? '600' : '400'};">${a.isYou ? 'You' : 'Someone'}</span>
                  <span style="color:var(--text-light);font-size:0.9rem;">${a.title}</span>
                  <span style="font-size:0.8rem;color:var(--text-light);margin-left:8px;">+${a.exp} EXP</span>
                </div>
                <small style="color:var(--text-light);font-size:0.7rem;">${new Date(a.date).toLocaleDateString()}</small>
              </div>
            `).join('')}
          </div>
        `;
      }

      document.getElementById('content').innerHTML = html;
    } catch (e) {
      console.error('Dashboard render error:', e);
      document.getElementById('content').innerHTML = UI.emptyState('Something went wrong. Please refresh.', 'error', 'location.reload()', '⚠️');
    }
  }
};

// ================================================================
// MODULE: Events (with edit support)
// ================================================================
const Events = {
  render() {
    try {
      const data = Storage.getAppData();
      const events = [...data.events].sort((a, b) => new Date(a.date) - new Date(b.date));

      let html = `
        <div style="display:flex;gap:12px;margin-bottom:18px;flex-wrap:wrap;">
          <input type="text" id="event-search" placeholder="Search events..." style="flex:1;padding:12px 18px;border:2px solid var(--border);border-radius:18px;font-size:0.9rem;outline:none;background:white;">
          <select id="event-filter" style="padding:12px 18px;border:2px solid var(--border);border-radius:18px;font-size:0.9rem;outline:none;background:white;color:var(--text);">
            <option value="all">All Types</option>
            <option value="assembly">Assembly</option>
            <option value="competition">Competition</option>
            <option value="sports">Sports</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>
        <div id="event-list">
      `;

      if (events.length === 0) {
        html += UI.emptyState('No events scheduled yet.', 'event', '__createEvent()', '📅');
      } else {
        events.forEach(e => {
          const isPast = new Date(e.date) < new Date();
          const isOfficer = Auth.isOfficer();
          html += `
            <div class="event-card" data-title="${e.title.toLowerCase()}" data-type="${e.type}">
              <div class="event-banner" style="background:${isPast ? 'var(--border)' : 'linear-gradient(135deg,var(--primary),var(--primary-light))'};">
                <span class="material-symbols-rounded" style="font-size:60px;">${isPast ? 'event_busy' : 'event'}</span>
              </div>
              <div class="event-content">
                <div class="event-title">
                  <h3>${e.title}</h3>
                  <span style="font-size:0.8rem;color:${isPast ? 'var(--text-light)' : 'var(--primary)'};font-weight:600;">${isPast ? 'Past' : 'Upcoming'}</span>
                </div>
                <div class="event-meta">
                  <span>📅 ${e.date}</span>
                  <span>📍 ${e.location || 'TBA'}</span>
                  <span>🏷️ ${e.type}</span>
                </div>
                <p style="color:var(--text-light);font-size:0.9rem;margin:8px 0;">${e.description || 'No description.'}</p>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;flex-wrap:wrap;gap:10px;">
                  <span class="event-reward">⭐ +${e.exp} EXP</span>
                  <div style="display:flex;gap:8px;">
                    ${!isPast ? `<button class="btn-primary" style="padding:8px 20px;width:auto;font-size:0.85rem;" onclick="window.__checkinEvent(${e.id})">Check In</button>` : ''}
                    ${isOfficer ? `<button class="btn-primary" style="padding:8px 16px;width:auto;font-size:0.8rem;background:var(--warning);color:var(--text);" onclick="window.__editEvent(${e.id})">Edit</button>` : ''}
                    ${isOfficer ? `<button class="btn-primary" style="padding:8px 16px;width:auto;font-size:0.8rem;background:var(--danger);" onclick="window.__deleteEvent(${e.id})">Delete</button>` : ''}
                  </div>
                </div>
              </div>
            </div>
          `;
        });
      }

      html += `</div>`;
      document.getElementById('content').innerHTML = html;

      document.getElementById('event-search')?.addEventListener('input', function() {
        const val = this.value.toLowerCase();
        document.querySelectorAll('.event-card').forEach(c => {
          const title = c.dataset.title || '';
          c.style.display = title.includes(val) ? '' : 'none';
        });
      });

      document.getElementById('event-filter')?.addEventListener('change', function() {
        const val = this.value;
        document.querySelectorAll('.event-card').forEach(c => {
          const type = c.dataset.type || '';
          c.style.display = val === 'all' || type === val ? '' : 'none';
        });
      });
    } catch (e) {
      console.error('Events render error:', e);
      document.getElementById('content').innerHTML = UI.emptyState('Could not load events.', 'error', 'location.reload()', '⚠️');
    }
  },

  checkin(eventId) {
    const user = Auth.currentUser;
    if (!user) return;
    const data = Storage.getAppData();
    const event = data.events.find(e => e.id === eventId);
    if (!event) return UI.toast({ message: 'Event not found.', type: 'error' });

    const member = data.members.find(m => m.studentId === user.studentId);
    if (!member) return;

    // Prevent duplicate check-in to same event
    if (!data.checkIns) data.checkIns = [];
    const alreadyChecked = data.checkIns.some(c => c.memberId === user.studentId && c.eventId === eventId);
    if (alreadyChecked) {
      return UI.toast({ message: `You already checked in to "${event.title}"!`, type: 'warning' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (member.attendance && member.attendance.includes(today)) {
      return UI.toast({ message: 'You already checked in today!', type: 'warning' });
    }

    if (!member.attendance) member.attendance = [];
    member.attendance.push(today);

    const result = Gamification.addExp(user.studentId, event.exp, `Attended ${event.title}`);

    data.checkIns.push({
      memberId: user.studentId,
      eventId: event.id,
      date: today,
      exp: event.exp
    });

    Storage.saveAppData(data);

    Auth.currentUser = { ...Auth.currentUser, ...member };
    Storage.setCurrentUser(Auth.currentUser);

    UI.toast({ message: `✅ Checked in to ${event.title}! +${event.exp} EXP`, type: 'success' });
    UI.confetti({ count: 40 });

    const rect = document.querySelector('.event-card')?.getBoundingClientRect();
    if (rect) {
      UI.floatExp(event.exp, rect.left + rect.width / 2, rect.top);
    }

    this.render();
    Dashboard.render();
  }
};

// ================================================================
// MODULE: Profile (with edit option)
// ================================================================
const Profile = {
  render() {
    try {
      const user = Auth.currentUser;
      if (!user) return;
      const data = Storage.getAppData();
      const member = data.members.find(m => m.studentId === user.studentId);
      if (!member) return;

      const level = Gamification.getLevel(member.exp);
      const badges = Gamification.getMemberBadges(member.studentId);
      const unlocked = badges.filter(b => b.unlocked);
      const attendanceCount = member.attendance?.length || 0;

      let html = `
        <div class="profile-card">
          <div class="profile-avatar">
            <span class="material-symbols-rounded" style="font-size:60px;">person</span>
          </div>
          <h2>${member.name}</h2>
          <p>${member.position || 'Member'} • ${member.year} Year</p>
          <div class="profile-stats">
            <div class="profile-stat">
              <h3>${member.exp}</h3>
              <small>EXP</small>
            </div>
            <div class="profile-stat">
              <h3>${level.level}</h3>
              <small>Level</small>
            </div>
            <div class="profile-stat">
              <h3>${attendanceCount}</h3>
              <small>Attendance</small>
            </div>
          </div>
        </div>

        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h4>📋 Member Details</h4>
            <button class="btn-primary" style="width:auto;padding:8px 16px;font-size:0.8rem;" onclick="window.__editProfile()">Edit</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
            <div><strong>Student ID</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.studentId}</span></div>
            <div><strong>Course</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.course || 'B.A. Political Science'}</span></div>
            <div><strong>Year</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.year}</span></div>
            <div><strong>Membership</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.membership}</span></div>
            <div><strong>Position</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.position || 'N/A'}</span></div>
            <div><strong>Email</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.email || 'N/A'}</span></div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">
            <h4>🏅 Badges</h4>
            <span style="font-size:0.8rem;color:var(--text-light);">${unlocked.length}/${badges.length}</span>
          </div>
          <div class="badge-grid">
            ${badges.map(b => `
              <div class="badge-card ${b.unlocked ? '' : 'locked'}">
                <div class="badge-icon" style="background:${b.unlocked ? 'linear-gradient(135deg,#FFD54F,#FFB300)' : '#e0e0e0'};">
                  ${b.icon}
                </div>
                <strong style="font-size:0.8rem;">${b.name}</strong>
                <p style="font-size:0.65rem;color:var(--text-light);margin-top:4px;">${b.unlocked ? '✅ Unlocked' : '🔒 Locked'}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      if (member.achievements && member.achievements.length > 0) {
        html += `
          <div class="card">
            <h4>🏆 Achievements</h4>
            <ul style="list-style:none;padding:0;margin-top:8px;">
              ${member.achievements.map(a => `<li style="padding:6px 0;border-bottom:1px solid var(--border);display:flex;gap:10px;"><span class="material-symbols-rounded" style="color:var(--primary);font-size:20px;">emoji_events</span>${a}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      html += `
        <div class="card">
          <div class="card-title">
            <h4>📝 Grade Conversion</h4>
          </div>
          <p style="color:var(--text-light);font-size:0.9rem;">Request to convert your organization participation into academic grade credits.</p>
          ${member.gradeConvRequested ?
            '<p style="margin-top:10px;color:var(--success);font-weight:600;">✅ Request submitted. Awaiting approval.</p>' :
            `<button class="btn-primary" style="margin-top:12px;width:auto;padding:10px 24px;display:inline-flex;" onclick="window.__requestGrade()">Request Grade Conversion</button>`
          }
        </div>

        <div class="card">
          <div class="card-title">
            <h4>⚙️ Settings</h4>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);">
              <span>Dark Mode</span>
              <label class="toggle-switch">
                <input type="checkbox" id="dark-mode-toggle" ${document.body.classList.contains('dark') ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
            <button class="text-btn" style="text-align:left;color:var(--danger);padding:8px 0;" onclick="window.__resetApp()">🗑️ Reset App Data</button>
            <button class="text-btn" style="text-align:left;color:var(--primary);padding:8px 0;" onclick="window.__exportData()">📤 Export Data</button>
          </div>
        </div>
      `;

      document.getElementById('content').innerHTML = html;

      document.getElementById('dark-mode-toggle')?.addEventListener('change', function() {
        document.body.classList.toggle('dark', this.checked);
        localStorage.setItem(C.STORAGE_KEYS.DARK_MODE, this.checked);
      });
    } catch (e) {
      console.error('Profile render error:', e);
      document.getElementById('content').innerHTML = UI.emptyState('Could not load profile.', 'error', 'location.reload()', '⚠️');
    }
  },

  edit() {
    const user = Auth.currentUser;
    if (!user) return;
    const data = Storage.getAppData();
    const member = data.members.find(m => m.studentId === user.studentId);
    if (!member) return;

    UI.modal(`
      <h3>✏️ Edit Profile</h3>
      <form id="edit-profile-form">
        <div class="form-group">
          <label>Full Name</label>
          <div class="input-box">
            <span class="material-symbols-rounded">person</span>
            <input type="text" id="edit-name" value="${member.name}" required>
          </div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <div class="input-box">
            <span class="material-symbols-rounded">email</span>
            <input type="email" id="edit-email" value="${member.email || ''}">
          </div>
        </div>
        <div class="form-group">
          <label>Year Level</label>
          <div class="input-box">
            <span class="material-symbols-rounded">school</span>
            <select id="edit-year">
              ${[1,2,3,4].map(y => `<option value="${y}" ${member.year == y ? 'selected' : ''}>${y}${y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'} Year</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Course</label>
          <div class="input-box">
            <span class="material-symbols-rounded">menu_book</span>
            <input type="text" id="edit-course" value="${member.course || ''}" required>
          </div>
        </div>
        <button type="submit" class="btn-primary">Save Changes</button>
        <button type="button" class="text-btn" data-close-modal>Cancel</button>
      </form>
    `);

    document.getElementById('edit-profile-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('edit-name').value.trim();
      const email = document.getElementById('edit-email').value.trim();
      const year = document.getElementById('edit-year').value;
      const course = document.getElementById('edit-course').value.trim();

      if (!name || !course) return UI.toast({ message: 'Name and course are required.', type: 'error' });

      Storage.updateMember(member.studentId, { name, email, year, course });
      Auth.currentUser = { ...Auth.currentUser, name, email, year, course };
      Storage.setCurrentUser(Auth.currentUser);
      UI.closeModal();
      UI.toast({ message: 'Profile updated!', type: 'success' });
      Profile.render();
    });
  }
};

// ================================================================
// MODULE: Leaderboard (unchanged)
// ================================================================
const Leaderboard = {
  render() {
    try {
      const data = Storage.getAppData();
      const sorted = [...data.members].sort((a, b) => b.exp - a.exp);

      let html = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h3>🏆 Leaderboard</h3>
          <span style="color:var(--text-light);font-size:0.9rem;">${sorted.length} members</span>
        </div>
      `;

      if (sorted.length === 0) {
        html += UI.emptyState('No members yet.', 'groups', null, '👥');
      } else {
        html += `<div class="leaderboard">`;
        sorted.forEach((m, i) => {
          const isCurrent = m.studentId === Auth.currentUser?.studentId;
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`;
          html += `
            <div class="rank" style="${isCurrent ? 'border:2px solid var(--primary);' : ''}">
              <div class="rank-number" style="background:${i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--primary)'};">${medal}</div>
              <div class="rank-avatar">
                <span class="material-symbols-rounded">person</span>
              </div>
              <div class="rank-info">
                <strong>${m.name}</strong>
                <div style="font-size:0.8rem;color:var(--text-light);">${m.position || 'Member'} • ${m.year} Year</div>
              </div>
              <div class="rank-exp">${m.exp} EXP</div>
            </div>
          `;
        });
        html += `</div>`;
      }

      document.getElementById('content').innerHTML = html;
    } catch (e) {
      console.error('Leaderboard render error:', e);
      document.getElementById('content').innerHTML = UI.emptyState('Could not load leaderboard.', 'error', 'location.reload()', '⚠️');
    }
  }
};

// ================================================================
// MODULE: Grievance (unchanged)
// ================================================================
const Grievance = {
  render() {
    try {
      const data = Storage.getAppData();
      const user = Auth.currentUser;
      const isOfficer = Auth.isOfficer();

      let grievances = data.grievances || [];

      if (!isOfficer) {
        grievances = grievances.filter(g => g.memberId === user.studentId || g.anonymous);
      }

      let html = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
          <h3>📋 Grievances</h3>
          <button class="btn-primary" style="width:auto;padding:10px 20px;display:inline-flex;gap:8px;" onclick="window.__showGrievanceForm()">
            <span class="material-symbols-rounded" style="font-size:20px;">add</span> New
          </button>
        </div>
      `;

      if (grievances.length === 0) {
        html += UI.emptyState('No grievances found.', 'gavel', '__showGrievanceForm()', '📭');
      } else {
        grievances.forEach(g => {
          const statusMap = {
            'submitted': { label: 'Submitted', color: 'var(--warning)' },
            'in-progress': { label: 'In Progress', color: 'var(--primary)' },
            'resolved': { label: 'Resolved', color: 'var(--success)' },
            'rejected': { label: 'Rejected', color: 'var(--danger)' }
          };
          const status = statusMap[g.status] || statusMap['submitted'];
          html += `
            <div class="card">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                  <h4>${g.title}</h4>
                  <p style="color:var(--text-light);font-size:0.9rem;margin-top:4px;">${g.description}</p>
                  ${g.anonymous ? '<p style="font-size:0.8rem;color:var(--text-light);">🔒 Anonymous</p>' : ''}
                </div>
                <span style="padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;background:${status.color}20;color:${status.color};">${status.label}</span>
              </div>
              <div style="margin-top:10px;font-size:0.8rem;color:var(--text-light);">
                <span>📅 ${new Date(g.createdAt).toLocaleDateString()}</span>
                ${g.notes ? `<p style="margin-top:4px;">📝 ${g.notes}</p>` : ''}
                ${g.resolution ? `<p style="margin-top:4px;color:var(--success);">✅ Resolution: ${g.resolution}</p>` : ''}
              </div>
              ${isOfficer && g.status !== 'resolved' ? `
                <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
                  <button class="btn-primary" style="padding:6px 16px;font-size:0.8rem;width:auto;" onclick="window.__updateGrievance('${g.id}','in-progress')">In Progress</button>
                  <button class="btn-primary" style="padding:6px 16px;font-size:0.8rem;width:auto;background:var(--success);" onclick="window.__resolveGrievance('${g.id}')">Resolve</button>
                  <button class="btn-primary" style="padding:6px 16px;font-size:0.8rem;width:auto;background:var(--danger);" onclick="window.__updateGrievance('${g.id}','rejected')">Reject</button>
                </div>
              ` : ''}
            </div>
          `;
        });
      }

      document.getElementById('content').innerHTML = html;
    } catch (e) {
      console.error('Grievance render error:', e);
      document.getElementById('content').innerHTML = UI.emptyState('Could not load grievances.', 'error', 'location.reload()', '⚠️');
    }
  },

  showForm() {
    UI.modal(`
      <h3>📝 Submit Grievance</h3>
      <form id="grievance-form">
        <div class="form-group">
          <label>Title</label>
          <div class="input-box">
            <span class="material-symbols-rounded">title</span>
            <input type="text" id="grievance-title" placeholder="Brief title" required>
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <div class="input-box" style="align-items:flex-start;">
            <span class="material-symbols-rounded" style="margin-top:12px;">description</span>
            <textarea id="grievance-desc" style="flex:1;border:none;outline:none;background:transparent;resize:vertical;min-height:80px;font-family:inherit;font-size:14px;color:var(--text);" placeholder="Describe your grievance in detail..." required></textarea>
          </div>
        </div>
        <div class="form-group">
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
            <input type="checkbox" id="grievance-anon"> Submit Anonymously
          </label>
        </div>
        <button type="submit" class="btn-primary" style="margin-top:8px;">Submit Grievance</button>
        <button type="button" class="text-btn" data-close-modal style="margin-top:8px;">Cancel</button>
      </form>
    `);

    document.getElementById('grievance-form')?.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('grievance-title').value.trim();
      const desc = document.getElementById('grievance-desc').value.trim();
      const anon = document.getElementById('grievance-anon').checked;

      if (!title || !desc) return UI.toast({ message: 'Please fill in all fields.', type: 'error' });

      const user = Auth.currentUser;
      const grievance = {
        memberId: user.studentId,
        title,
        description: desc,
        anonymous: anon,
        status: 'submitted',
        notes: '',
        resolution: ''
      };

      Storage.addGrievance(grievance);
      UI.closeModal();
      UI.toast({ message: 'Grievance submitted successfully.', type: 'success' });
      NotifCenter.add('New Grievance Submitted', `${title} - Awaiting review.`, 'info', 'gavel');
      Grievance.render();
    });
  },

  updateStatus(id, status) {
    const result = Storage.updateGrievance(id, { status });
    if (result) {
      UI.toast({ message: `Grievance updated to ${status}.`, type: 'success' });
      Grievance.render();
    }
  },

  resolve(id) {
    UI.modal(`
      <h3>✅ Resolve Grievance</h3>
      <div class="form-group">
        <label>Resolution Notes</label>
        <div class="input-box" style="align-items:flex-start;">
          <span class="material-symbols-rounded" style="margin-top:12px;">edit</span>
          <textarea id="resolution-text" style="flex:1;border:none;outline:none;background:transparent;resize:vertical;min-height:80px;font-family:inherit;font-size:14px;color:var(--text);" placeholder="Describe how this grievance was resolved..."></textarea>
        </div>
      </div>
      <button class="btn-primary" id="resolve-submit">Mark as Resolved</button>
      <button class="text-btn" data-close-modal>Cancel</button>
    `);

    document.getElementById('resolve-submit')?.addEventListener('click', function() {
      const notes = document.getElementById('resolution-text').value.trim();
      const result = Storage.updateGrievance(id, { status: 'resolved', resolution: notes || 'Resolved.' });
      if (result) {
        UI.closeModal();
        UI.toast({ message: 'Grievance resolved!', type: 'success' });
        Grievance.render();
      }
    });
  }
};

// ================================================================
// MODULE: Learning (unchanged)
// ================================================================
const Learning = {
  currentTab: 'constitution',

  render() {
    try {
      const data = Storage.getAppData();
      const resources = data.learningResources || {};

      const tabs = [
        { id: 'constitution', label: 'Constitution', icon: 'gavel' },
        { id: 'bylaws', label: 'By-Laws', icon: 'menu_book' },
        { id: 'news', label: 'News', icon: 'newspaper' },
        { id: 'government', label: 'Government', icon: 'account_balance' },
        { id: 'reviewer', label: 'Reviewer', icon: 'school' },
      ];

      let html = `
        <h3 style="margin-bottom:16px;">📚 Learning Center</h3>
        <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;overflow-x:auto;padding-bottom:4px;">
          ${tabs.map(t => `
            <button class="tab-btn ${this.currentTab === t.id ? 'active' : ''}" data-tab="${t.id}" style="padding:10px 18px;border-radius:16px;border:none;background:${this.currentTab === t.id ? 'var(--primary)' : 'white'};color:${this.currentTab === t.id ? 'white' : 'var(--text)'};font-weight:600;font-size:0.85rem;display:flex;align-items:center;gap:6px;box-shadow:${this.currentTab === t.id ? '0 8px 20px rgba(117,153,84,0.3)' : 'var(--shadow)'};transition:.3s;">
              <span class="material-symbols-rounded" style="font-size:18px;">${t.icon}</span>
              ${t.label}
            </button>
          `).join('')}
        </div>
        <div class="card" id="learning-content">
          ${this.renderTab(this.currentTab, resources)}
        </div>
      `;

      document.getElementById('content').innerHTML = html;

      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.currentTab = btn.dataset.tab;
          this.render();
        });
      });
    } catch (e) {
      console.error('Learning render error:', e);
      document.getElementById('content').innerHTML = UI.emptyState('Could not load learning resources.', 'error', 'location.reload()', '⚠️');
    }
  },

  renderTab(tab, resources) {
    const content = resources[tab] || 'Content not yet available.';
    const titles = {
      constitution: '📜 Constitution',
      bylaws: '📋 By-Laws',
      news: '📰 Latest News',
      government: '🏛️ Government Updates',
      reviewer: '📖 Reviewer'
    };

    return `
      <h4>${titles[tab] || tab}</h4>
      <div style="margin-top:12px;line-height:1.8;color:var(--text-light);white-space:pre-wrap;max-height:400px;overflow-y:auto;padding-right:8px;">
        ${content}
      </div>
      ${tab === 'reviewer' ? `
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
          <p style="font-weight:600;color:var(--text);">📝 Download Reviewer</p>
          <button class="btn-primary" style="width:auto;padding:10px 20px;display:inline-flex;gap:8px;margin-top:8px;" onclick="window.__downloadReviewer()">
            <span class="material-symbols-rounded" style="font-size:20px;">download</span> Download PDF
          </button>
        </div>
      ` : ''}
    `;
  }
};

// ================================================================
// MODULE: Officer (with bulk actions, filters, edit, assign role)
// ================================================================
const Officer = {
  renderDashboard() {
    try {
      const data = Storage.getAppData();
      const totalMembers = data.members.length;
      const activeMembers = data.members.filter(m => m.membership === 'Active').length;
      const totalExp = data.members.reduce((sum, m) => sum + m.exp, 0);
      const avgExp = totalMembers > 0 ? Math.round(totalExp / totalMembers) : 0;
      const totalEvents = data.events.length;
      const pendingGrievance = data.grievances.filter(g => g.status === 'submitted' || g.status === 'in-progress').length;
      const totalBadges = data.members.reduce((sum, m) => sum + (m.badges?.length || 0), 0);

      let html = `
        <h3 style="margin-bottom:16px;">📊 Officer Dashboard</h3>
        <div class="analytics-grid">
          <div class="analytics-card">
            <span class="material-symbols-rounded">groups</span>
            <h2>${totalMembers}</h2>
            <p>Total Members</p>
            <small style="color:var(--text-light);">${activeMembers} active</small>
          </div>
          <div class="analytics-card">
            <span class="material-symbols-rounded">stars</span>
            <h2>${avgExp}</h2>
            <p>Avg EXP</p>
            <small style="color:var(--text-light);">${totalExp} total</small>
          </div>
          <div class="analytics-card">
            <span class="material-symbols-rounded">event</span>
            <h2>${totalEvents}</h2>
            <p>Total Events</p>
            <small style="color:var(--text-light);">${data.events.filter(e => new Date(e.date) >= new Date()).length} upcoming</small>
          </div>
          <div class="analytics-card">
            <span class="material-symbols-rounded">gavel</span>
            <h2>${pendingGrievance}</h2>
            <p>Pending Grievances</p>
            <small style="color:var(--text-light);">${data.grievances.length} total</small>
          </div>
          <div class="analytics-card">
            <span class="material-symbols-rounded">workspace_premium</span>
            <h2>${totalBadges}</h2>
            <p>Badges Awarded</p>
            <small style="color:var(--text-light);">${data.members.filter(m => m.badges?.length > 0).length} members with badges</small>
          </div>
          <div class="analytics-card">
            <span class="material-symbols-rounded">check_circle</span>
            <h2>${data.members.filter(m => m.gradeConvRequested).length}</h2>
            <p>Grade Requests</p>
            <small style="color:var(--text-light);">Pending approval</small>
          </div>
        </div>
        <div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap;">
          <button class="btn-primary" onclick="window.__nav('events')">📅 Manage Events</button>
          <button class="btn-primary" style="background:var(--primary-dark);" onclick="window.__showAnnouncementForm()">📢 Post Announcement</button>
          <button class="btn-primary" style="background:var(--text-light);" onclick="window.__awardBadge()">🏅 Award Badge</button>
          <button class="btn-primary" style="background:var(--success);" onclick="window.__viewGradeRequests()">📝 Grade Requests</button>
        </div>
      `;

      document.getElementById('content').innerHTML = html;
    } catch (e) {
      console.error('Officer dashboard error:', e);
      document.getElementById('content').innerHTML = UI.emptyState('Could not load officer dashboard.', 'error', 'location.reload()', '⚠️');
    }
  },

  renderMembers() {
    try {
      const data = Storage.getAppData();
      let html = `
        <h3 style="margin-bottom:16px;">👥 Members</h3>
        <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
          <input type="text" id="member-search" placeholder="Search members..." style="flex:1;padding:12px 18px;border:2px solid var(--border);border-radius:18px;font-size:0.9rem;outline:none;background:white;">
          <div style="display:flex;gap:8px;">
            <button class="filter-chip active" data-filter="all">All</button>
            <button class="filter-chip" data-filter="active">Active</button>
            <button class="filter-chip" data-filter="officer">Officers</button>
          </div>
        </div>
        <div id="member-list">
      `;

      if (data.members.length === 0) {
        html += UI.emptyState('No members registered.', 'groups', null, '👥');
      } else {
        const sorted = [...data.members].sort((a, b) => b.exp - a.exp);
        sorted.forEach(m => {
          html += `
            <div class="card member-item" data-name="${m.name.toLowerCase()}" data-status="${m.membership}" data-role="${m.role || 'member'}" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
              <div style="display:flex;align-items:center;gap:12px;">
                <input type="checkbox" class="bulk-select" value="${m.studentId}">
                <div>
                  <strong>${m.name}</strong>
                  <p style="font-size:0.8rem;color:var(--text-light);margin:0;">${m.studentId} • ${m.year} Year • ${m.position || 'Member'}</p>
                  <p style="font-size:0.8rem;color:var(--text-light);margin:0;">🏅 ${m.badges?.length || 0} badges • 📅 ${m.attendance?.length || 0} attendances</p>
                </div>
              </div>
              <div style="text-align:right;">
                <div style="font-weight:700;color:var(--primary);">${m.exp} EXP</div>
                <button class="btn-primary" style="padding:4px 14px;font-size:0.75rem;width:auto;margin-top:4px;" onclick="window.__viewMember('${m.studentId}')">View</button>
              </div>
            </div>
          `;
        });
      }

      html += `
        </div>
        <div style="margin-top:16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
          <button class="btn-primary" style="width:auto;padding:8px 16px;font-size:0.8rem;" onclick="window.__bulkAwardBadge()">🏅 Award Badge to Selected</button>
          <button class="btn-primary" style="width:auto;padding:8px 16px;font-size:0.8rem;background:var(--text-light);" onclick="window.__bulkExport()">📤 Export Selected</button>
          <span id="selected-count" style="color:var(--text-light);font-size:0.9rem;">0 selected</span>
        </div>
      `;

      document.getElementById('content').innerHTML = html;

      // Search
      document.getElementById('member-search')?.addEventListener('input', function() {
        const val = this.value.toLowerCase();
        document.querySelectorAll('.member-item').forEach(c => {
          const name = c.dataset.name || '';
          c.style.display = name.includes(val) ? '' : 'none';
        });
      });

      // Filters
      document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
          document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
          this.classList.add('active');
          const filter = this.dataset.filter;
          document.querySelectorAll('.member-item').forEach(item => {
            const status = item.dataset.status || 'Active';
            const role = item.dataset.role || 'member';
            let show = true;
            if (filter === 'active') show = status === 'Active';
            else if (filter === 'officer') show = role === 'officer' || role === 'adviser' || role === 'grievance';
            item.style.display = show ? '' : 'none';
          });
        });
      });

      // Bulk select count
      document.querySelectorAll('.bulk-select').forEach(cb => {
        cb.addEventListener('change', function() {
          const selected = document.querySelectorAll('.bulk-select:checked').length;
          document.getElementById('selected-count').textContent = `${selected} selected`;
        });
      });
    } catch (e) {
      console.error('Members render error:', e);
      document.getElementById('content').innerHTML = UI.emptyState('Could not load members.', 'error', 'location.reload()', '⚠️');
    }
  },

  // Bulk award badge
  bulkAwardBadge() {
    const selected = document.querySelectorAll('.bulk-select:checked');
    if (selected.length === 0) return UI.toast({ message: 'Select at least one member.', type: 'warning' });

    const definitions = Gamification.getBadgeDefinitions();
    let badgeOptions = definitions.map(b =>
      `<option value="${b.id}">${b.icon} ${b.name}</option>`
    ).join('');

    UI.modal(`
      <h3>🏅 Bulk Award Badge</h3>
      <p style="color:var(--text-light);">Award a badge to ${selected.length} selected members.</p>
      <div class="form-group">
        <label>Badge</label>
        <div class="input-box">
          <span class="material-symbols-rounded">workspace_premium</span>
          <select id="bulk-badge">${badgeOptions}</select>
        </div>
      </div>
      <button class="btn-primary" id="bulk-award-submit">Award to All</button>
      <button class="text-btn" data-close-modal>Cancel</button>
    `);

    document.getElementById('bulk-award-submit').addEventListener('click', function() {
      const badgeId = document.getElementById('bulk-badge').value;
      const memberIds = Array.from(selected).map(cb => cb.value);
      const data = Storage.getAppData();

      memberIds.forEach(id => {
        const member = data.members.find(m => m.studentId === id);
        if (member && !member.badges.includes(badgeId)) {
          member.badges.push(badgeId);
          // Give some EXP for badge
          Gamification.addExp(id, 25, `Awarded badge (bulk)`);
        }
      });

      Storage.saveAppData(data);
      UI.closeModal();
      UI.toast({ message: `🏅 Badge awarded to ${memberIds.length} members!`, type: 'success' });
      Officer.renderMembers();
    });
  },

  // Bulk export
  bulkExport() {
    const selected = document.querySelectorAll('.bulk-select:checked');
    if (selected.length === 0) return UI.toast({ message: 'Select at least one member.', type: 'warning' });

    const memberIds = Array.from(selected).map(cb => cb.value);
    const data = Storage.getAppData();
    const members = data.members.filter(m => memberIds.includes(m.studentId));
    const exportData = members.map(m => ({
      ...m,
      password: undefined // remove sensitive
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members_export.json';
    a.click();
    URL.revokeObjectURL(url);
    UI.toast({ message: `Exported ${exportData.length} members.`, type: 'success' });
  },

  renderManageEvents() {
    try {
      const data = Storage.getAppData();
      let html = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
          <h3>📅 Manage Events</h3>
          <button class="btn-primary" style="width:auto;padding:10px 20px;display:inline-flex;gap:8px;" onclick="window.__createEvent()">
            <span class="material-symbols-rounded" style="font-size:20px;">add</span> Create Event
          </button>
        </div>
      `;

      if (data.events.length === 0) {
        html += UI.emptyState('No events created yet.', 'event', '__createEvent()', '📅');
      } else {
        data.events.forEach(e => {
          html += `
            <div class="card">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;">
                <div>
                  <h4>${e.title}</h4>
                  <p style="font-size:0.85rem;color:var(--text-light);">📅 ${e.date} • 📍 ${e.location || 'TBA'} • 🏷️ ${e.type}</p>
                  <p style="font-size:0.85rem;color:var(--text-light);">⭐ +${e.exp} EXP</p>
                </div>
                <div style="display:flex;gap:8px;">
                  <button class="btn-primary" style="padding:4px 14px;font-size:0.75rem;width:auto;background:var(--warning);color:var(--text);" onclick="window.__editEvent(${e.id})">Edit</button>
                  <button class="btn-primary" style="padding:4px 14px;font-size:0.75rem;width:auto;background:var(--danger);" onclick="window.__deleteEvent(${e.id})">Delete</button>
                </div>
              </div>
            </div>
          `;
        });
      }

      document.getElementById('content').innerHTML = html;
    } catch (e) {
      console.error('Manage events error:', e);
      document.getElementById('content').innerHTML = UI.emptyState('Could not load events.', 'error', 'location.reload()', '⚠️');
    }
  },

  renderAnnouncements() {
    try {
      const data = Storage.getAppData();
      let html = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
          <h3>📢 Announcements</h3>
          <button class="btn-primary" style="width:auto;padding:10px 20px;display:inline-flex;gap:8px;" onclick="window.__showAnnouncementForm()">
            <span class="material-symbols-rounded" style="font-size:20px;">add</span> Post
          </button>
        </div>
      `;

      if (data.announcements.length === 0) {
        html += UI.emptyState('No announcements.', 'campaign', '__showAnnouncementForm()', '📢');
      } else {
        data.announcements.forEach((a, i) => {
          html += `
            <div class="announcement">
              <div class="announcement-icon">
                <span class="material-symbols-rounded">campaign</span>
              </div>
              <div style="flex:1;">
                <p>${a}</p>
                <small style="color:var(--text-light);">Posted recently</small>
              </div>
            </div>
          `;
        });
      }

      document.getElementById('content').innerHTML = html;
    } catch (e) {
      console.error('Announcements error:', e);
      document.getElementById('content').innerHTML = UI.emptyState('Could not load announcements.', 'error', 'location.reload()', '⚠️');
    }
  },

  renderBadges() {
    try {
      const data = Storage.getAppData();
      const definitions = Gamification.getBadgeDefinitions();
      const allMembers = data.members;

      let html = `
        <h3 style="margin-bottom:16px;">🏅 Badge Management</h3>
        <p style="color:var(--text-light);margin-bottom:16px;">Award badges to members for their achievements.</p>
        <button class="btn-primary" style="width:auto;padding:10px 20px;display:inline-flex;gap:8px;margin-bottom:20px;" onclick="window.__awardBadge()">
          <span class="material-symbols-rounded" style="font-size:20px;">workspace_premium</span> Award Badge
        </button>
        <div class="badge-grid">
          ${definitions.map(b => {
            const count = allMembers.filter(m => m.badges?.includes(b.id)).length;
            return `
              <div class="badge-card">
                <div class="badge-icon" style="background:linear-gradient(135deg,#FFD54F,#FFB300);">${b.icon}</div>
                <strong>${b.name}</strong>
                <p style="font-size:0.7rem;color:var(--text-light);">${count} members</p>
                <p style="font-size:0.65rem;color:var(--text-light);margin-top:4px;">${b.desc}</p>
              </div>
            `;
          }).join('')}
        </div>
      `;

      document.getElementById('content').innerHTML = html;
    } catch (e) {
      console.error('Badges error:', e);
      document.getElementById('content').innerHTML = UI.emptyState('Could not load badges.', 'error', 'location.reload()', '⚠️');
    }
  },

  renderGradeRequests() {
    try {
      const data = Storage.getAppData();
      const requests = data.members.filter(m => m.gradeConvRequested);

      let html = `
        <h3 style="margin-bottom:16px;">📝 Grade Conversion Requests</h3>
      `;

      if (requests.length === 0) {
        html += UI.emptyState('No grade conversion requests.', 'assignment', null, '📝');
      } else {
        requests.forEach(m => {
          html += `
            <div class="card">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                <div>
                  <strong>${m.name}</strong>
                  <p style="font-size:0.85rem;color:var(--text-light);">${m.studentId} • ${m.year} Year</p>
                  <p style="font-size:0.85rem;color:var(--text-light);">EXP: ${m.exp} • Badges: ${m.badges?.length || 0}</p>
                </div>
                <div style="display:flex;gap:8px;">
                  <button class="btn-primary" style="padding:6px 16px;font-size:0.8rem;width:auto;background:var(--success);" onclick="window.__approveGrade('${m.studentId}')">Approve</button>
                  <button class="btn-primary" style="padding:6px 16px;font-size:0.8rem;width:auto;background:var(--danger);" onclick="window.__rejectGrade('${m.studentId}')">Reject</button>
                </div>
              </div>
            </div>
          `;
        });
      }

      document.getElementById('content').innerHTML = html;
    } catch (e) {
      console.error('Grade requests error:', e);
      document.getElementById('content').innerHTML = UI.emptyState('Could not load grade requests.', 'error', 'location.reload()', '⚠️');
    }
  },

  renderGrievances() {
    Grievance.render();
  },

  renderLeaderboard() {
    Leaderboard.render();
  },

  renderAnalytics() {
    try {
      const data = Storage.getAppData();
      const totalMembers = data.members.length;
      const activeMembers = data.members.filter(m => m.membership === 'Active').length;
      const totalExp = data.members.reduce((sum, m) => sum + m.exp, 0);
      const avgExp = totalMembers > 0 ? Math.round(totalExp / totalMembers) : 0;
      const totalBadges = data.members.reduce((sum, m) => sum + (m.badges?.length || 0), 0);
      const totalAttendances = data.members.reduce((sum, m) => sum + (m.attendance?.length || 0), 0);

      const yearGroups = {};
      data.members.forEach(m => {
        const y = m.year || '1';
        yearGroups[y] = (yearGroups[y] || 0) + 1;
      });

      let html = `
        <h3 style="margin-bottom:16px;">📊 Analytics</h3>
        <div class="analytics-grid">
          <div class="analytics-card">
            <span class="material-symbols-rounded">groups</span>
            <h2>${totalMembers}</h2>
            <p>Total Members</p>
            <small style="color:var(--text-light);">${activeMembers} active</small>
          </div>
          <div class="analytics-card">
            <span class="material-symbols-rounded">stars</span>
            <h2>${avgExp}</h2>
            <p>Average EXP</p>
            <small style="color:var(--text-light);">${totalExp} total</small>
          </div>
          <div class="analytics-card">
            <span class="material-symbols-rounded">workspace_premium</span>
            <h2>${totalBadges}</h2>
            <p>Total Badges</p>
            <small style="color:var(--text-light);">${data.members.filter(m => m.badges?.length > 0).length} members</small>
          </div>
          <div class="analytics-card">
            <span class="material-symbols-rounded">check_circle</span>
            <h2>${totalAttendances}</h2>
            <p>Total Attendances</p>
            <small style="color:var(--text-light);">${data.members.filter(m => m.attendance?.length > 0).length} members</small>
          </div>
        </div>
        <div class="card">
          <h4>Members by Year</h4>
          <div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap;">
            ${Object.entries(yearGroups).sort((a,b) => a[0]-b[0]).map(([year,count]) => `
              <div style="background:var(--accent);border-radius:16px;padding:12px 20px;text-align:center;flex:1;min-width:80px;">
                <div style="font-size:1.8rem;font-weight:800;color:var(--primary);">${count}</div>
                <small style="color:var(--text-light);">Year ${year}</small>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card">
          <h4>Top Members</h4>
          ${[...data.members].sort((a,b) => b.exp - a.exp).slice(0,5).map((m,i) => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:${i<4?'1px solid var(--border)':'none'};">
              <span>${i+1}. ${m.name}</span>
              <span style="font-weight:700;color:var(--primary);">${m.exp} EXP</span>
            </div>
          `).join('')}
        </div>
      `;

      document.getElementById('content').innerHTML = html;
    } catch (e) {
      console.error('Analytics error:', e);
      document.getElementById('content').innerHTML = UI.emptyState('Could not load analytics.', 'error', 'location.reload()', '⚠️');
    }
  },

  showAwardBadge() {
    const data = Storage.getAppData();
    const definitions = Gamification.getBadgeDefinitions();

    let memberOptions = data.members.map(m =>
      `<option value="${m.studentId}">${m.name} (${m.exp} EXP)</option>`
    ).join('');

    let badgeOptions = definitions.map(b =>
      `<option value="${b.id}">${b.icon} ${b.name}</option>`
    ).join('');

    UI.modal(`
      <h3>🏅 Award Badge</h3>
      <form id="award-badge-form">
        <div class="form-group">
          <label>Member</label>
          <div class="input-box">
            <span class="material-symbols-rounded">person</span>
            <select id="award-member">${memberOptions}</select>
          </div>
        </div>
        <div class="form-group">
          <label>Badge</label>
          <div class="input-box">
            <span class="material-symbols-rounded">workspace_premium</span>
            <select id="award-badge">${badgeOptions}</select>
          </div>
        </div>
        <button type="submit" class="btn-primary">Award Badge</button>
        <button type="button" class="text-btn" data-close-modal>Cancel</button>
      </form>
    `);

    document.getElementById('award-badge-form')?.addEventListener('submit', function(e) {
      e.preventDefault();
      const memberId = document.getElementById('award-member').value;
      const badgeId = document.getElementById('award-badge').value;

      const member = data.members.find(m => m.studentId === memberId);
      if (!member) return UI.toast({ message: 'Member not found.', type: 'error' });

      if (member.badges.includes(badgeId)) {
        return UI.toast({ message: 'Member already has this badge.', type: 'warning' });
      }

      member.badges.push(badgeId);
      Storage.saveAppData(data);

      Gamification.addExp(memberId, 25, `Awarded badge`);

      UI.closeModal();
      UI.toast({ message: `🏅 Badge awarded to ${member.name}!`, type: 'success' });
      UI.confetti({ count: 50 });
      NotifCenter.add('Badge Awarded', `${member.name} received a new badge!`, 'success', 'workspace_premium');

      if (Auth.currentUser?.studentId === memberId) {
        Auth.currentUser.badges = member.badges;
        Storage.setCurrentUser(Auth.currentUser);
      }
    });
  },

  showAnnouncementForm() {
    UI.modal(`
      <h3>📢 Post Announcement</h3>
      <form id="announcement-form">
        <div class="form-group">
          <label>Announcement</label>
          <div class="input-box" style="align-items:flex-start;">
            <span class="material-symbols-rounded" style="margin-top:12px;">edit</span>
            <textarea id="announcement-text" style="flex:1;border:none;outline:none;background:transparent;resize:vertical;min-height:80px;font-family:inherit;font-size:14px;color:var(--text);" placeholder="Write your announcement..." required></textarea>
          </div>
        </div>
        <button type="submit" class="btn-primary">Post Announcement</button>
        <button type="button" class="text-btn" data-close-modal>Cancel</button>
      </form>
    `);

    document.getElementById('announcement-form')?.addEventListener('submit', function(e) {
      e.preventDefault();
      const text = document.getElementById('announcement-text').value.trim();
      if (!text) return UI.toast({ message: 'Please write an announcement.', type: 'error' });

      Storage.addAnnouncement(text);
      UI.closeModal();
      UI.toast({ message: '📢 Announcement posted!', type: 'success' });
      NotifCenter.add('New Announcement', text, 'info', 'campaign');
      const currentScreen = document.querySelector('.nav-item.active')?.dataset.screen || 'home';
      window.__nav(currentScreen);
    });
  },

  createEvent() {
    UI.modal(`
      <h3>📅 Create Event</h3>
      <form id="create-event-form">
        <div class="form-group">
          <label>Event Title</label>
          <div class="input-box">
            <span class="material-symbols-rounded">title</span>
            <input type="text" id="event-title" placeholder="Event title" required>
          </div>
        </div>
        <div class="form-group">
          <label>Date</label>
          <div class="input-box">
            <span class="material-symbols-rounded">calendar_today</span>
            <input type="date" id="event-date" required>
          </div>
        </div>
        <div class="form-group">
          <label>Type</label>
          <div class="input-box">
            <span class="material-symbols-rounded">category</span>
            <select id="event-type">
              ${C.EVENT_TYPES.map(t => `<option value="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Location</label>
          <div class="input-box">
            <span class="material-symbols-rounded">location_on</span>
            <input type="text" id="event-location" placeholder="Venue">
          </div>
        </div>
        <div class="form-group">
          <label>EXP Reward</label>
          <div class="input-box">
            <span class="material-symbols-rounded">stars</span>
            <input type="number" id="event-exp" value="50" min="10" max="200">
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <div class="input-box" style="align-items:flex-start;">
            <span class="material-symbols-rounded" style="margin-top:12px;">description</span>
            <textarea id="event-desc" style="flex:1;border:none;outline:none;background:transparent;resize:vertical;min-height:60px;font-family:inherit;font-size:14px;color:var(--text);" placeholder="Event description..."></textarea>
          </div>
        </div>
        <button type="submit" class="btn-primary">Create Event</button>
        <button type="button" class="text-btn" data-close-modal>Cancel</button>
      </form>
    `);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('event-date').value = tomorrow.toISOString().split('T')[0];

    document.getElementById('create-event-form')?.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('event-title').value.trim();
      const date = document.getElementById('event-date').value;
      const type = document.getElementById('event-type').value;
      const location = document.getElementById('event-location').value.trim();
      const exp = parseInt(document.getElementById('event-exp').value) || 50;
      const description = document.getElementById('event-desc').value.trim();

      if (!title || !date) return UI.toast({ message: 'Title and date are required.', type: 'error' });

      Storage.addEvent({ title, date, type, location, exp, description });
      UI.closeModal();
      UI.toast({ message: `✅ Event "${title}" created!`, type: 'success' });
      NotifCenter.add('New Event Created', `${title} on ${date}`, 'info', 'event');
      window.__nav('events');
    });
  },

  editEvent(eventId) {
    const data = Storage.getAppData();
    const event = data.events.find(e => e.id === eventId);
    if (!event) return UI.toast({ message: 'Event not found.', type: 'error' });

    UI.modal(`
      <h3>📝 Edit Event</h3>
      <form id="edit-event-form">
        <div class="form-group">
          <label>Event Title</label>
          <div class="input-box">
            <span class="material-symbols-rounded">title</span>
            <input type="text" id="edit-event-title" value="${event.title}" required>
          </div>
        </div>
        <div class="form-group">
          <label>Date</label>
          <div class="input-box">
            <span class="material-symbols-rounded">calendar_today</span>
            <input type="date" id="edit-event-date" value="${event.date}" required>
          </div>
        </div>
        <div class="form-group">
          <label>Type</label>
          <div class="input-box">
            <span class="material-symbols-rounded">category</span>
            <select id="edit-event-type">
              ${C.EVENT_TYPES.map(t => `<option value="${t}" ${event.type === t ? 'selected' : ''}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Location</label>
          <div class="input-box">
            <span class="material-symbols-rounded">location_on</span>
            <input type="text" id="edit-event-location" value="${event.location || ''}">
          </div>
        </div>
        <div class="form-group">
          <label>EXP Reward</label>
          <div class="input-box">
            <span class="material-symbols-rounded">stars</span>
            <input type="number" id="edit-event-exp" value="${event.exp}" min="10" max="200">
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <div class="input-box" style="align-items:flex-start;">
            <span class="material-symbols-rounded" style="margin-top:12px;">description</span>
            <textarea id="edit-event-desc" style="flex:1;border:none;outline:none;background:transparent;resize:vertical;min-height:60px;font-family:inherit;font-size:14px;color:var(--text);">${event.description || ''}</textarea>
          </div>
        </div>
        <button type="submit" class="btn-primary">Update Event</button>
        <button type="button" class="text-btn" data-close-modal>Cancel</button>
      </form>
    `);

    document.getElementById('edit-event-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const updates = {
        title: document.getElementById('edit-event-title').value.trim(),
        date: document.getElementById('edit-event-date').value,
        type: document.getElementById('edit-event-type').value,
        location: document.getElementById('edit-event-location').value.trim(),
        exp: parseInt(document.getElementById('edit-event-exp').value) || 50,
        description: document.getElementById('edit-event-desc').value.trim()
      };

      Storage.updateEvent(eventId, updates);
      UI.closeModal();
      UI.toast({ message: '✅ Event updated!', type: 'success' });
      Officer.renderManageEvents();
    });
  },

  viewMember(studentId) {
    const data = Storage.getAppData();
    const member = data.members.find(m => m.studentId === studentId);
    if (!member) return UI.toast({ message: 'Member not found.', type: 'error' });

    const level = Gamification.getLevel(member.exp);
    const badges = Gamification.getMemberBadges(member.studentId);
    const unlocked = badges.filter(b => b.unlocked);

    // Officer can assign role from here
    const roleOptions = Object.values(C.ROLES).map(r =>
      `<option value="${r}" ${member.role === r ? 'selected' : ''}>${r.charAt(0).toUpperCase() + r.slice(1)}</option>`
    ).join('');

    UI.modal(`
      <div style="text-align:center;">
        <div style="width:80px;height:80px;border-radius:50%;background:var(--accent);display:flex;justify-content:center;align-items:center;margin:auto;font-size:40px;color:var(--primary);">
          <span class="material-symbols-rounded">person</span>
        </div>
        <h3 style="margin-top:12px;">${member.name}</h3>
        <p style="color:var(--text-light);">${member.studentId} • ${member.year} Year</p>
        <p style="color:var(--text-light);">${member.position || 'Member'} • ${member.membership}</p>
        ${Auth.isOfficer() ? `
          <div style="margin:12px 0;">
            <label style="font-weight:600;margin-right:8px;">Role:</label>
            <select id="role-assign" style="padding:6px 12px;border-radius:12px;border:2px solid var(--border);">
              ${roleOptions}
            </select>
            <button class="btn-primary" style="padding:4px 12px;width:auto;font-size:0.8rem;margin-left:8px;" onclick="window.__assignRole('${member.studentId}')">Update</button>
          </div>
        ` : ''}
        <div style="display:flex;justify-content:center;gap:20px;margin:12px 0;">
          <span><strong>${member.exp}</strong> EXP</span>
          <span><strong>Level ${level.level}</strong></span>
          <span><strong>${member.attendance?.length || 0}</strong> Attendances</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px;">
          ${unlocked.map(b => `<span style="background:#EEF6E8;padding:4px 12px;border-radius:20px;font-size:0.8rem;">${b.icon} ${b.name}</span>`).join('')}
          ${unlocked.length === 0 ? '<span style="color:var(--text-light);font-size:0.9rem;">No badges yet</span>' : ''}
        </div>
        ${member.achievements?.length > 0 ? `
          <div style="margin-top:12px;text-align:left;">
            <strong>Achievements:</strong>
            <ul style="padding-left:20px;margin-top:4px;">
              ${member.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        <button class="btn-primary" style="margin-top:16px;width:auto;padding:10px 24px;display:inline-flex;" data-close-modal>Close</button>
      </div>
    `);
  },

  deleteEvent(id) {
    if (confirm('Delete this event?')) {
      Storage.deleteEvent(id);
      UI.toast({ message: 'Event deleted.', type: 'info' });
      this.renderManageEvents();
    }
  },

  // Role assignment (called from viewMember)
  assignRole(studentId) {
    const select = document.getElementById('role-assign');
    if (!select) return;
    const role = select.value;
    const result = Auth.assignRole(studentId, role);
    if (result) {
      UI.toast({ message: `Role updated to ${role}.`, type: 'success' });
      UI.closeModal();
      // Refresh member view
      this.viewMember(studentId);
    }
  }
};

// ================================================================
// MODULE: App - Main Controller
// ================================================================
const App = {
  init() {
    try {
      this.setupListeners();

      if (localStorage.getItem(C.STORAGE_KEYS.DARK_MODE) === 'true') {
        document.body.classList.add('dark');
      }

      this.setupPWA();
      this.setupSessionReset();
      this.setupPullToRefresh();

      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('service-worker.js')
            .catch(() => console.log('SW registration failed'));
        });
      }

      // Load initial screen
      this.navigate('home');
      NotifCenter.updateBadge();
      this.updateGreeting();

      // Event reminders check daily
      this.checkEventReminders();

      // Backup reminder
      this.checkBackupReminder();

      UI.hideLoading();

    } catch (err) {
      console.error('App init error:', err);
      UI.hideLoading();
      UI.toast({ message: 'Something went wrong. Please refresh.', type: 'error' });
    }
  },

  setupListeners() {
    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        Auth.logout();
        window.location.href = 'login.html';
      }
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const screen = btn.dataset.screen;
        this.navigate(screen);
      });
    });

    // Officer drawer
    document.getElementById('officer-menu-btn')?.addEventListener('click', () => {
      if (!Auth.isOfficer()) {
        return UI.toast({ message: 'Officer access only.', type: 'warning' });
      }
      document.getElementById('officer-drawer').classList.add('open');
      document.getElementById('overlay').classList.add('show');
    });

    document.getElementById('close-drawer')?.addEventListener('click', () => {
      document.getElementById('officer-drawer').classList.remove('open');
      document.getElementById('overlay').classList.remove('show');
    });

    document.getElementById('overlay')?.addEventListener('click', () => {
      document.getElementById('officer-drawer').classList.remove('open');
      document.getElementById('overlay').classList.remove('show');
    });

    document.querySelectorAll('.drawer-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.officer;
        document.getElementById('officer-drawer').classList.remove('open');
        document.getElementById('overlay').classList.remove('show');
        this.handleOfficerAction(action);
      });
    });

    // FAB
    document.getElementById('fab-checkin')?.addEventListener('click', () => {
      this.handleCheckin();
    });

    // Notifications
    document.getElementById('notif-btn')?.addEventListener('click', () => {
      NotifCenter.render();
    });

    // Install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      document.getElementById('install-banner')?.classList.remove('hidden');
      document.getElementById('install-btn')?.addEventListener('click', () => {
        if (window.deferredPrompt) {
          window.deferredPrompt.prompt();
          window.deferredPrompt.userChoice.then(() => {
            document.getElementById('install-banner').classList.add('hidden');
          });
        }
      });
    });

    window.addEventListener('appinstalled', () => {
      document.getElementById('install-banner').classList.add('hidden');
      UI.toast({ message: '🎉 App installed successfully!', type: 'success' });
    });

    // Global functions
    window.__nav = (screen) => this.navigate(screen);
    window.__checkin = () => this.handleCheckin();
    window.__showGrievance = () => Grievance.showForm();
    window.__viewGrievances = () => { this.navigate('events');
      setTimeout(() => Grievance.render(), 100); };
    window.__viewGradeRequests = () => { this.navigate('events');
      setTimeout(() => Officer.renderGradeRequests(), 100); };
    window.__awardBadge = () => Officer.showAwardBadge();
    window.__showAnnouncementForm = () => Officer.showAnnouncementForm();
    window.__createEvent = () => Officer.createEvent();
    window.__editEvent = (id) => Officer.editEvent(id);
    window.__checkinEvent = (id) => Events.checkin(id);
    window.__showLeaderboard = () => { this.navigate('events');
      setTimeout(() => Leaderboard.render(), 100); };
    window.__requestGrade = () => {
      const user = Auth.currentUser;
      Storage.updateMember(user.studentId, { gradeConvRequested: true });
      if (Auth.currentUser) Auth.currentUser.gradeConvRequested = true;
      Storage.setCurrentUser(Auth.currentUser);
      UI.toast({ message: 'Grade conversion request submitted!', type: 'success' });
      this.navigate('profile');
    };
    window.__resetApp = () => {
      if (confirm('Reset all app data? This cannot be undone.')) {
        localStorage.clear();
        location.reload();
      }
    };
    window.__exportData = () => {
      const data = Storage.getAppData();
      const cleanData = {
        ...data,
        members: data.members.map(m => ({ ...m, password: undefined }))
      };
      const blob = new Blob([JSON.stringify(cleanData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'polsci_data.json';
      a.click();
      URL.revokeObjectURL(url);
      UI.toast({ message: 'Data exported successfully!', type: 'success' });
    };
    window.__updateGrievance = (id, status) => Grievance.updateStatus(id, status);
    window.__resolveGrievance = (id) => Grievance.resolve(id);
    window.__deleteEvent = (id) => Officer.deleteEvent(id);
    window.__viewMember = (id) => Officer.viewMember(id);
    window.__assignRole = (id) => Officer.assignRole(id);
    window.__approveGrade = (id) => {
      Storage.updateMember(id, { gradeConvRequested: false });
      UI.toast({ message: 'Grade conversion approved!', type: 'success' });
      Officer.renderGradeRequests();
    };
    window.__rejectGrade = (id) => {
      Storage.updateMember(id, { gradeConvRequested: false });
      UI.toast({ message: 'Grade conversion rejected.', type: 'info' });
      Officer.renderGradeRequests();
    };
    window.__downloadReviewer = () => {
      UI.toast({ message: 'Reviewer PDF download started.', type: 'info' });
      const data = Storage.getAppData();
      const content = data.learningResources?.reviewer || 'Reviewer content not available.';
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'polsci_reviewer.txt';
      a.click();
      URL.revokeObjectURL(url);
    };
    window.__showGrievanceForm = () => Grievance.showForm();
    window.__editProfile = () => Profile.edit();
    window.__bulkAwardBadge = () => Officer.bulkAwardBadge();
    window.__bulkExport = () => Officer.bulkExport();
  },

  navigate(screen) {
    const titleMap = {
      'home': 'Dashboard',
      'events': 'Events',
      'learning': 'Learning Center',
      'profile': 'Profile'
    };
    document.getElementById('screen-title').textContent = titleMap[screen] || screen;

    document.querySelectorAll('.nav-item').forEach(b => {
      b.classList.toggle('active', b.dataset.screen === screen);
    });

    switch (screen) {
      case 'home':
        Dashboard.render();
        break;
      case 'events':
        Events.render();
        break;
      case 'learning':
        Learning.render();
        break;
      case 'profile':
        Profile.render();
        break;
      default:
        Dashboard.render();
    }

    this.updateGreeting();
  },

  updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good Evening';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 17) greeting = 'Good Afternoon';
    document.getElementById('greeting').textContent = greeting;
  },

  handleOfficerAction(action) {
    if (!Auth.isOfficer()) return UI.toast({ message: 'Officer access only.', type: 'warning' });

    this.navigate('events');

    setTimeout(() => {
      switch (action) {
        case 'dashboard':
          Officer.renderDashboard();
          break;
        case 'members':
          Officer.renderMembers();
          break;
        case 'manage-events':
          Officer.renderManageEvents();
          break;
        case 'announcements':
          Officer.renderAnnouncements();
          break;
        case 'badges':
          Officer.renderBadges();
          break;
        case 'grade-requests':
          Officer.renderGradeRequests();
          break;
        case 'grievances':
          Officer.renderGrievances();
          break;
        case 'leaderboard':
          Leaderboard.render();
          break;
        case 'analytics':
          Officer.renderAnalytics();
          break;
        default:
          Officer.renderDashboard();
      }
    }, 50);
  },

  handleCheckin() {
    const data = Storage.getAppData();
    const upcoming = data.events.filter(e => new Date(e.date) >= new Date());

    if (upcoming.length === 0) {
      return UI.toast({ message: 'No upcoming events to check in to.', type: 'warning' });
    }

    let options = upcoming.map(e =>
      `<option value="${e.id}">${e.title} (${e.date})</option>`
    ).join('');

    UI.modal(`
      <h3>✅ Check In</h3>
      <p style="color:var(--text-light);margin-bottom:12px;">Select an event to check in:</p>
      <div class="form-group">
        <div class="input-box">
          <span class="material-symbols-rounded">event</span>
          <select id="checkin-event">${options}</select>
        </div>
      </div>
      <button class="btn-primary" id="checkin-submit">Check In</button>
      <button class="text-btn" data-close-modal>Cancel</button>
    `);

    document.getElementById('checkin-submit')?.addEventListener('click', () => {
      const eventId = parseInt(document.getElementById('checkin-event').value);
      UI.closeModal();
      Events.checkin(eventId);
    });
  },

  setupPWA() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = '#759954';
  },

  setupSessionReset() {
    // Reset session timer on user activity
    ['click', 'mousemove', 'keydown', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => {
        if (Auth.currentUser) {
          Auth.resetSessionTimer();
        }
      });
    });
  },

  setupPullToRefresh() {
    let startY = 0;
    let isPulling = false;
    const indicator = document.getElementById('pull-indicator');
    if (!indicator) return;

    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    });

    document.addEventListener('touchmove', (e) => {
      if (isPulling && window.scrollY === 0) {
        const diff = e.touches[0].clientY - startY;
        if (diff > 40) {
          indicator.style.display = 'block';
        } else {
          indicator.style.display = 'none';
        }
      }
    });

    document.addEventListener('touchend', () => {
      if (indicator.style.display === 'block') {
        indicator.innerHTML = '🔄 Refreshing...';
        setTimeout(() => {
          location.reload();
        }, 300);
      }
      isPulling = false;
    });
  },

  checkEventReminders() {
    const data = Storage.getAppData();
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    data.events.forEach(event => {
      const eventDate = new Date(event.date);
      if (eventDate >= today && eventDate <= threeDaysLater) {
        // Check if already notified
        const notified = data.notifications?.some(
          n => n.eventId === event.id && n.type === 'reminder'
        );
        if (!notified) {
          NotifCenter.add(
            `📅 Reminder: ${event.title}`,
            `Happening on ${event.date} at ${event.location || 'TBA'}`,
            'info',
            'event_reminder'
          );
          // Mark as notified
          Storage.addNotification({
            eventId: event.id,
            type: 'reminder',
            title: `Reminder: ${event.title}`,
            message: `Happening on ${event.date}`,
            icon: 'event_reminder',
            read: false
          });
        }
      }
    });
  },

  checkBackupReminder() {
    const lastBackup = localStorage.getItem(C.STORAGE_KEYS.LAST_BACKUP);
    const now = Date.now();
    if (!lastBackup || now - parseInt(lastBackup) > 7 * 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        UI.toast({
          message: '💾 Reminder: Export your data to keep it safe!',
          type: 'info'
        });
        localStorage.setItem(C.STORAGE_KEYS.LAST_BACKUP, now.toString());
      }, 5000);
    }
  }
};

// ================================================================
// EXPORT all modules
// ================================================================
export {
  Storage,
  Auth,
  UI,
  NotifCenter,
  Gamification,
  Dashboard,
  Events,
  Profile,
  Leaderboard,
  Grievance,
  Learning,
  Officer,
  App
};