// ================================================================
// IMPORTS
// ================================================================
import { learningResources } from './learning-content.js';

// ================================================================
// CRYPTO: Password Hashing
// ================================================================
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ================================================================
// SANITIZE: XSS prevention
// ================================================================
function sanitizeHTML(str) {
  if (!str) return '';
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// ================================================================
// MODULE: Storage
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
    let data = this.get('appData');
    if (!data) {
      data = this.getDefaultData();
      this.set('appData', data);
    } else {
      // Older saved data did not have roles. Everyone remains a student unless
      // an administrator explicitly assigns a staff role to their account.
      data.members.forEach(member => {
        if (!member.role) {
          member.role = ['President', 'Secretary'].includes(member.position) ? 'officer' : 'member';
        }
      });
      if (!data.learningProgress) data.learningProgress = {};
      if (!data.learningResources?.sepolscisConstitution) {
        data.learningResources = { ...data.learningResources, sepolscisConstitution: learningResources.sepolscisConstitution };
      }
      if (!data.opportunities) data.opportunities = this.getDefaultData().opportunities;
      if (!data.eventFeedback) data.eventFeedback = [];
      data.events.forEach(event => { event.rsvps ||= {}; event.capacity ||= 50; });
      this.saveAppData(data);
      // Migration: replace old learningResources with full content
      if (data.learningResources && data.learningResources.constitution === 'The Political Science Student Organization Constitution...') {
        data.learningResources = learningResources;
        this.saveAppData(data);
      }
    }
    return data;
  },
  saveAppData(data) {
    this.set('appData', data);
  },
  getDefaultData() {
    return {
      events: [
        { id: 1, title: '🗳️ General Assembly: Your Voice, Your Org', date: '2026-07-20', type: 'assembly', exp: 50, location: 'Room 101',
          description: 'Join us to shape the semester’s direction. Propose projects, vote on budget, and meet the new officers. Free snacks for the first 30 attendees!' },
        { id: 2, title: '🔥 Face-Off: Inter-School Debate on Federalism', date: '2026-07-25', type: 'competition', exp: 100,
          location: 'Auditorium', description: 'Represent SEPOLSCIS against three other universities. Win the golden gavel and 100 EXP. Teams of 3 – sign up now!' },
        { id: 3, title: '🏀 Court Wars: 3x3 Basketball Intrams', date: '2026-08-01', type: 'sports', exp: 75,
          location: 'Gymnasium', description: 'Bragging rights, plus EXP for every game played. Form your squad (max 5). Cheerleaders get +10 EXP too!' },
        { id: 4, title: '🧠 Quiz Bee: Constitution Edition', date: '2026-08-10', type: 'competition', exp: 80, location: 'Room 203',
          description: 'Test your knowledge of the 1987 Constitution. Top 3 finishers get a special badge and certificate.' },
        { id: 5, title: '🤝 Community Volunteer Drive', date: '2026-08-15', type: 'volunteer', exp: 50,
          location: 'Community Center', description: 'Give back to the community. Volunteer hours count toward service recognition and the "Community Champion" badge.' },
      ],
      opportunities: [
        { id: 'o1', type: 'Scholarship', title: '🎓 Future Public Leaders Scholarship', organization: 'Civic Futures Foundation', deadline: '2026-07-30', location: 'Online application', description: '₱50,000 tuition support for students with a record of community leadership. "We’re looking for the next barangay captain, the next congressperson."', savedBy: [] },
        { id: 'o2', type: 'Internship', title: '🏛️ City Hall Policy Internship', organization: 'City Legislative Office', deadline: '2026-08-05', location: 'City Hall', description: 'Work directly with the legislative office. Draft memos, attend council sessions, and see how laws are actually made. Perfect for 3rd-4th years.', savedBy: [] },
        { id: 'o3', type: 'Debate', title: '🎤 National Debate Invitational', organization: 'Philippine Debate Union', deadline: '2026-08-12', location: 'University Auditorium', description: 'Compete against the best debaters in the country. Cash prizes and trophies for winning teams. Open to all year levels.', savedBy: [] },
        { id: 'o4', type: 'Volunteer', title: '🗳️ Voter Education Weekend', organization: 'Youth Civic Network', deadline: '2026-08-18', location: 'Barangay Learning Hub', description: 'Help facilitate non-partisan voter education sessions. Gain valuable facilitation experience and community service hours.', savedBy: [] }
      ],
      members: [{
        studentId: '2024-0001',
        name: 'Juan dela Cruz',
        year: '2',
        course: 'B.A. Political Science',
        position: '', role: 'member',
        membership: 'Active',
        exp: 320,
        attendance: ['2026-07-01', '2026-07-08', '2026-07-15'],
        badges: ['b1'],
        achievements: ['Debate Winner Q1'],
        gradeConvRequested: false,
        email: 'juan@example.com',
      }, {
        studentId: 'officer1',
        name: 'Maria Santos',
        year: '3',
        course: 'B.A. Political Science',
        position: 'President', role: 'officer',
        membership: 'Active',
        exp: 560,
        attendance: ['2026-07-01', '2026-07-08', '2026-07-15', '2026-07-22'],
        badges: ['b5', 'b3'],
        achievements: ['Best Leader 2025'],
        gradeConvRequested: false,
        email: 'maria@example.com',
      }, {
        studentId: '2024-0002',
        name: 'Pedro Reyes',
        year: '1',
        course: 'B.A. Political Science',
        position: '', role: 'member',
        membership: 'Active',
        exp: 180,
        attendance: ['2026-07-01', '2026-07-15'],
        badges: [],
        achievements: [],
        gradeConvRequested: false,
        email: 'pedro@example.com',
      }, {
        studentId: '2024-0003',
        name: 'Ana Flores',
        year: '2',
        course: 'B.A. Political Science',
        position: 'Secretary', role: 'officer',
        membership: 'Active',
        exp: 420,
        attendance: ['2026-07-01', '2026-07-08', '2026-07-15', '2026-07-22'],
        badges: ['b2'],
        achievements: ['Top Performer Q2'],
        gradeConvRequested: false,
        email: 'ana@example.com',
      }, {
        studentId: '2024-0004',
        name: 'Carlos Mendoza',
        year: '3',
        course: 'B.A. Political Science',
        position: '', role: 'member',
        membership: 'Active',
        exp: 720,
        attendance: ['2026-07-01', '2026-07-08', '2026-07-15', '2026-07-22', '2026-07-29'],
        badges: ['b1', 'b4'],
        achievements: ['Quiz Bee Champion 2025', 'Debate Finalist'],
        gradeConvRequested: true,
        email: 'carlos@example.com',
      }],
      learningProgress: {},
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
        '📢 Welcome to SEPOLSCIS! Please complete your profile.',
        '🗳️ General Assembly on July 20 at Room 101. See you there!',
        '🔥 Debate Competition registration is now open until July 22.'
      ],
      notifications: [],
      checkIns: [],
      eventFeedback: [],
      learningResources: learningResources, // from imported file
      quests: [
        { id: 'q1', title: '🏁 Rookie of the Week', requirement: 'checkin', progress: 0, target: 1, expReward: 20, completed: false, date: new Date().toDateString() },
        { id: 'q2', title: '📖 Scholar\'s Path', requirement: 'read', progress: 0, target: 1, expReward: 15, completed: false, date: new Date().toDateString() },
        { id: 'q3', title: '🗣️ Speak Up', requirement: 'grievance', progress: 0, target: 1, expReward: 10, completed: false, date: new Date().toDateString() },
      ]
    };
  },
  getCurrentUser() {
    return this.get('currentUser');
  },
  setCurrentUser(user) {
    this.set('currentUser', user);
  },
  removeCurrentUser() {
    this.remove('currentUser');
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
  getQuests() {
    const data = this.getAppData();
    const today = new Date().toDateString();
    if (data.quests[0] && data.quests[0].date !== today) {
      data.quests = data.quests.map(q => ({
        ...q,
        progress: 0,
        completed: false,
        date: today
      }));
      this.saveAppData(data);
    }
    return data.quests;
  },
  updateQuestProgress(requirement, amount = 1) {
    const data = this.getAppData();
    const today = new Date().toDateString();
    data.quests = data.quests.map(q => {
      if (q.date !== today) {
        return { ...q, progress: 0, completed: false, date: today };
      }
      if (q.requirement === requirement && !q.completed) {
        const newProgress = q.progress + amount;
        if (newProgress >= q.target) {
          q.completed = true;
          q.progress = q.target;
          const member = data.members.find(m => m.studentId === this.getCurrentUser()?.studentId);
          if (member) {
            member.exp += q.expReward;
            NotifCenter.add('Quest Complete!', `You earned ${q.expReward} EXP for "${q.title}"`, 'success', 'check_circle');
            UI.confetti({ count: 40 });
          }
        } else {
          q.progress = newProgress;
        }
      }
      return q;
    });
    this.saveAppData(data);
  }
};

// ================================================================
// MODULE: Auth
// ================================================================
const Auth = {
  currentUser: null,

  init() {
    this.currentUser = Storage.getCurrentUser();
    if (this.currentUser) {
      const member = Storage.getMember(this.currentUser.studentId);
      if (member) {
        // Roles always come from the approved member record, never from the browser session.
        this.currentUser = { ...member, role: member.role || 'member' };
        Storage.setCurrentUser(this.currentUser);
        return true;
      } else {
        Storage.removeCurrentUser();
        this.currentUser = null;
        return false;
      }
    }
    return false;
  },

  async login(studentId, password) {
    if (!studentId) return { success: false, message: 'Student ID is required.' };
    if (!password) return { success: false, message: 'Password is required.' };

    let data = Storage.getAppData();
    let member = data.members.find(m => m.studentId === studentId);

    if (member) {
      if (member.password && !member.passwordHash) {
        member.passwordHash = await hashPassword(member.password);
        delete member.password;
        Storage.saveAppData(data);
      }
      const hashedInput = await hashPassword(password);
      if (member.passwordHash && member.passwordHash !== hashedInput) {
        return { success: false, message: 'Invalid password.' };
      }
    } else {
      return { success: false, message: 'Account not found. Please create a student account first.' };
    }

    this.currentUser = { ...member, role: member.role || 'member' };
    Storage.setCurrentUser(this.currentUser);

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

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

    const hashed = await hashPassword(password);
    const newMember = {
      studentId,
      name: name || studentId,
      year: year || '1',
      course: course || 'B.A. Political Science',
      position: '',
      role: 'member',
      membership: 'Active',
      exp: 0,
      attendance: [],
      badges: [],
      achievements: [],
      gradeConvRequested: false,
      email: '',
      passwordHash: hashed,
    };

    data.members.push(newMember);
    Storage.saveAppData(data);

    return { success: true, user: newMember };
  },

  logout() {
    Storage.removeCurrentUser();
    this.currentUser = null;
  },

  isOfficer() {
    return this.currentUser && ['officer', 'adviser', 'grievance'].includes(this.currentUser.role);
  },

  isAdviser() {
    return this.currentUser && this.currentUser.role === 'adviser';
  },

  isGrievance() {
    return this.currentUser && this.currentUser.role === 'grievance';
  },

  getRole() {
    return this.currentUser ? this.currentUser.role : 'member';
  }
};

// ================================================================
// MODULE: UI Helpers
// ================================================================
const UI = {
  toast(opt) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    const msg = typeof opt === 'string' ? opt : opt.message;
    const type = typeof opt === 'string' ? 'info' : opt.type || 'info';
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    
    // Add progress bar
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

  showLoading(show = true) {
    const screen = document.getElementById('loading-screen');
    if (screen) {
      screen.style.display = show ? 'flex' : 'none';
    }
  },

  hideLoading() {
    const screen = document.getElementById('loading-screen');
    if (screen) {
      screen.style.display = 'none';
    }
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

  emptyState(message, icon = 'inbox', action = null) {
    let html = `
            <div class="card text-center" style="padding:40px 20px;">
                <span class="material-symbols-rounded" style="font-size:64px;color:#c5d0b8;display:block;margin-bottom:16px;">${icon}</span>
                <p style="color:var(--text-light);font-size:1rem;">${sanitizeHTML(message)}</p>
        `;
    if (action) {
      html += `<button class="btn-primary" style="margin-top:16px;width:auto;padding:12px 28px;display:inline-flex;" onclick="${action}">Take Action</button>`;
    }
    html += `</div>`;
    return html;
  }
};

// ================================================================
// MODULE: Notifications Center
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
                        <strong>${sanitizeHTML(n.title || 'Update')}</strong>
                        <p style="color:var(--text-light);font-size:0.9rem;margin-top:2px;">${sanitizeHTML(n.message || '')}</p>
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
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: '/icons/icon-192.png' });
    }
  }
};

// ================================================================
// MODULE: Gamification
// ================================================================
const Gamification = {
  LEVELS: [
    { level: 1, exp: 0, title: 'New Member' },
    { level: 2, exp: 100, title: 'Active Member' },
    { level: 3, exp: 300, title: 'Dedicated Member' },
    { level: 4, exp: 600, title: 'Senior Member' },
    { level: 5, exp: 1000, title: 'Elite Member' },
    { level: 6, exp: 1500, title: 'Master Member' },
    { level: 7, exp: 2100, title: 'Legend' },
  ],

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
      { id: 'b3', name: 'Perfect Attendance', icon: '✅', condition: 'attendance >= 5', desc: '5 events attended' },
      { id: 'b4', name: 'Best Debater', icon: '🎤', condition: 'achievements.includes("Debate Winner")',
        desc: 'Won a debate competition' },
      { id: 'b5', name: 'MVP', icon: '🏀', condition: 'achievements.includes("Sports MVP")', desc: 'MVP in sports' },
      { id: 'b6', name: 'Quiz Bee Champ', icon: '🏆', condition: 'achievements.includes("Quiz Bee Champion")',
        desc: 'Won the Quiz Bee' },
      { id: 'b7', name: 'Volunteer', icon: '🤝', condition: 'exp >= 200', desc: 'Reached 200 EXP' },
      { id: 'b8', name: 'President', icon: '👑', condition: 'position === "President"', desc: 'Served as President' },
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
// VIEW: Dashboard
// ================================================================
const Dashboard = {
  render() {
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
    const upcoming = data.events.filter(e => new Date(e.date) >= new Date()).slice(0, 3);
    const quests = Storage.getQuests();
    const nextEvent = upcoming[0];
    const learning = data.learningProgress?.[member.studentId] || { viewed: [], quizPassed: [] };
    const savedOpportunities = data.opportunities?.filter(item => item.savedBy?.includes(member.studentId)) || [];
    const nearestOpportunity = [...savedOpportunities].sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
    const attendance = data.checkIns?.filter(item => item.memberId === member.studentId).length || member.attendance?.length || 0;
    const daysUntil = date => Math.max(0, Math.ceil((new Date(date) - new Date()) / 86400000));

    let html = `
            <section class="today-hero">
                <div class="today-hero-copy"><p class="eyebrow">YOUR STUDENT HUB</p><h2>Good to see you, ${sanitizeHTML(member.name.split(' ')[0])}.</h2><p>Keep learning, show up, and build a record you can be proud of.</p></div>
                <div class="today-level"><span>Level</span><strong>${level.level}</strong><small>${level.title}</small></div>
                <div class="today-progress"><div><span>Progress to next level</span><strong>${member.exp} EXP</strong></div><div class="today-progress-bar"><span style="width:${progress}%;"></span></div>${nextLevel ? `<small>${nextLevel.exp - member.exp} EXP to ${nextLevel.title}</small>` : '<small>Maximum level reached</small>'}</div>
            </section>

            <section class="today-section-heading"><div><p class="eyebrow">AT A GLANCE</p><h3>Your next steps</h3></div><button class="text-action" onclick="window.__nav('portfolio')">View portfolio</button></section>
            <section class="today-grid">
                <article class="today-card event-today" onclick="window.__nav('events')"><span class="material-symbols-rounded">event_upcoming</span><p>Next event</p><h4>${nextEvent ? sanitizeHTML(nextEvent.title) : 'No event scheduled'}</h4><small>${nextEvent ? `${nextEvent.date} · ${daysUntil(nextEvent.date)} day${daysUntil(nextEvent.date) === 1 ? '' : 's'} away` : 'Explore upcoming activities'}</small><b>${nextEvent ? 'View event →' : 'Browse events →'}</b></article>
                <article class="today-card opportunity-today" onclick="window.__nav('opportunities')"><span class="material-symbols-rounded">rocket_launch</span><p>Deadline watch</p><h4>${nearestOpportunity ? sanitizeHTML(nearestOpportunity.title) : 'Find an opportunity'}</h4><small>${nearestOpportunity ? `Due ${nearestOpportunity.deadline}` : 'Scholarships, internships and more'}</small><b>${savedOpportunities.length} saved ${savedOpportunities.length === 1 ? 'opportunity' : 'opportunities'} →</b></article>
                <article class="today-card learning-today" onclick="window.__nav('learning')"><span class="material-symbols-rounded">auto_stories</span><p>Learning</p><h4>${learning.quizPassed?.length || 0} topics completed</h4><small>${learning.viewed?.length || 0} lessons explored</small><b>Continue learning →</b></article>
                <article class="today-card portfolio-today" onclick="window.__nav('portfolio')"><span class="material-symbols-rounded">workspace_premium</span><p>Portfolio</p><h4>${attendance} event attendance${attendance === 1 ? '' : 's'}</h4><small>${unlocked.length} badges earned</small><b>See your record →</b></article>
            </section>

            <!-- EXP Card -->
            <div class="card exp-card">
                <div style="position:relative;z-index:1;">
                    <p style="opacity:0.8;">${user.role === 'officer' ? '👋 Officer' : '👋 Member'}</p>
                    <h2>Hello, ${sanitizeHTML(member.name)}</h2>
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

            <!-- Daily Quests -->
            <div class="card">
                <div class="card-title">
                    <h3>📋 Daily Quests</h3>
                </div>
                ${quests.map(q => `
                    <div class="quest-card ${q.completed ? 'completed' : ''}">
                        <div>
                            <strong>${sanitizeHTML(q.title)}</strong>
                            <div class="quest-progress">
                                <span style="width:${(q.progress/q.target)*100}%;"></span>
                            </div>
                            <small>${q.progress}/${q.target} • +${q.expReward} EXP</small>
                        </div>
                        ${q.completed ? '<span style="color:var(--success);font-weight:700;">✅ Done</span>' : ''}
                    </div>
                `).join('')}
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
                                <small style="font-size:0.65rem;color:var(--text-light);display:block;margin-top:4px;">${sanitizeHTML(b.name)}</small>
                            </div>
                        `).join('')}
                        ${unlocked.length > 6 ? `<div style="text-align:center;width:60px;display:flex;flex-direction:column;justify-content:center;align-items:center;"><span style="font-size:1.2rem;font-weight:700;color:var(--primary);">+${unlocked.length-6}</span><small style="font-size:0.65rem;color:var(--text-light);">more</small></div>` : ''}
                    </div>
                </div>
            `;
    }

    if (Auth.isOfficer()) {
      const pendingGrievance = data.grievances.filter(g => g.status === 'submitted' || g.status === 'in-progress')
        .length;
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

    html += `
            <div class="card">
                <div class="card-title">
                    <h3>📢 Announcements</h3>
                </div>
                ${data.announcements.length === 0 ? '<p style="color:var(--text-light);">No announcements yet.</p>' :
                data.announcements.slice(0,3).map(a => `
                    <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:flex-start;">
                        <span class="material-symbols-rounded" style="color:var(--primary);font-size:20px;">campaign</span>
                        <p style="margin:0;flex:1;">${sanitizeHTML(a)}</p>
                    </div>
                `).join('')}
                ${data.announcements.length > 3 ? `<p style="margin-top:8px;color:var(--text-light);font-size:0.85rem;">+${data.announcements.length-3} more</p>` : ''}
            </div>
        `;

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
                            <strong>${sanitizeHTML(e.title)}</strong>
                            <p style="font-size:0.8rem;color:var(--text-light);margin:0;">${e.date} • ${e.type}</p>
                        </div>
                        <span style="background:#EEF6E8;padding:4px 12px;border-radius:20px;font-weight:700;font-size:0.8rem;color:var(--primary-dark);">+${e.exp} EXP</span>
                    </div>
                `).join('')}
            </div>
        `;

    const sorted = [...data.members].sort((a, b) => b.exp - a.exp).slice(0, 5);
    html += `
            <div class="card">
                <div class="card-title">
                    <h3>🏆 Leaderboard</h3>
                    <a href="#" onclick="window.__showLeaderboard();return false;" style="color:var(--primary);font-weight:600;font-size:0.85rem;">View all</a>
                </div>
                ${sorted.map((m, i) => `
                    <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:${i < sorted.length-1 ? '1px solid var(--border)' : 'none'};">
                        <span style="font-weight:700;width:24px;color:${i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--text-light)'};">#${i+1}</span>
                        <span style="flex:1;font-weight:${i < 3 ? '600' : '400'};">${sanitizeHTML(m.name)}</span>
                        <span style="font-weight:700;color:var(--primary);">${m.exp} EXP</span>
                    </div>
                `).join('')}
            </div>
        `;

    document.getElementById('content').innerHTML = html;
  }
};

// ================================================================
// VIEW: Events
// ================================================================
const DashboardV2 = {
  render() {
    const data = Storage.getAppData();
    const member = data.members.find(m => m.studentId === Auth.currentUser?.studentId);
    if (!member) return;
    const level = Gamification.getLevel(member.exp);
    const progress = Gamification.getProgress(member.exp);
    const nextLevel = Gamification.getNextLevel(member.exp);
    const quests = Storage.getQuests();
    const upcoming = data.events.filter(e => new Date(`${e.date}T23:59:59`) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
    const event = upcoming[0];
    const ranked = [...data.members].sort((a, b) => b.exp - a.exp);
    const firstName = sanitizeHTML(member.name.split(' ')[0]);
    const completion = quests.filter(q => q.completed).length;
    const dateLabel = event ? new Date(`${event.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Coming soon';
    const used = event ? Object.keys(event.rsvps || {}).length : 0;
    const capacity = event?.capacity || 50;

    // --- STREAK CALCULATION ---
    const checkIns = data.checkIns?.filter(c => c.memberId === member.studentId) || [];
    let streak = 0;
    if (checkIns.length > 0) {
      const sortedDates = checkIns.map(c => new Date(c.date)).sort((a, b) => b - a);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let currentDate = new Date(today);
      
      // Check if checked in today or yesterday to start streak
      const latest = new Date(sortedDates[0]);
      latest.setHours(0, 0, 0, 0);
      const diffDays = (today - latest) / (1000 * 60 * 60 * 24);
      if (diffDays <= 1) {
        streak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const prevDate = new Date(sortedDates[i]);
          prevDate.setHours(0, 0, 0, 0);
          const expectedDate = new Date(currentDate);
          expectedDate.setDate(expectedDate.getDate() - 1);
          if (prevDate.getTime() === expectedDate.getTime()) {
            streak++;
            currentDate = prevDate;
          } else {
            break;
          }
        }
      }
    }

    // --- TIME-BASED GREETING ---
    const hour = new Date().getHours();
    let timeEmoji = '🌙';
    let greeting = 'Good Evening';
    if (hour < 12) { timeEmoji = '🌅'; greeting = 'Good Morning'; }
    else if (hour < 17) { timeEmoji = '☀️'; greeting = 'Good Afternoon'; }

    // --- CIRCULAR PROGRESS ---
    const circleProgress = Gamification.getProgress(member.exp);

    document.getElementById('content').innerHTML = `
      <section class="student-hero">
        <div class="hero-brand"><img src="logo.png" alt="SEPOLSCIS"><span>SEPOLSCIS</span></div>
        <p class="eyebrow">${greeting}, ${firstName}</p>
        <div class="hero-heading">
          <div>
            <h1>${timeEmoji} ${greeting}, ${firstName}</h1>
            <p>Small steps make a meaningful record.</p>
            ${streak > 0 ? `<div class="streak-indicator"><span class="material-symbols-rounded">local_fire_department</span> ${streak} day${streak > 1 ? 's' : ''} streak!</div>` : ''}
          </div>
          <div class="level-orb"><small>LEVEL</small><strong>${level.level}</strong></div>
        </div>
        <div class="hero-exp">
          <div>
            <span>${member.exp} EXP</span>
            <small>${nextLevel ? `${nextLevel.exp - member.exp} EXP to ${nextLevel.title}` : 'Maximum level reached'}</small>
          </div>
          <div class="exp-ring-container">
            <svg viewBox="0 0 36 36" class="exp-ring">
              <path class="exp-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="exp-ring-progress" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style="stroke-dasharray: ${circleProgress} 100;" />
            </svg>
            <div class="exp-ring-label">
              <strong>${Math.round(circleProgress)}%</strong>
              <small>to next level</small>
            </div>
          </div>
        </div>
      </section>

      <section class="dashboard-section"><div class="section-title"><div><p class="eyebrow">TODAY'S MISSION</p><h3>${completion}/${quests.length} completed</h3></div><span class="mission-reward">+${quests.filter(q => !q.completed).reduce((sum, q) => sum + q.expReward, 0)} EXP left</span></div>
        <div class="mission-list">${quests.map((q, index) => `<button class="mission-item ${q.completed ? 'done' : ''}" onclick="${index === 0 ? "window.__nav('events')" : index === 1 ? "window.__nav('learning')" : "window.__showGrievance()"}"><span class="mission-check material-symbols-rounded">${q.completed ? 'check' : 'radio_button_unchecked'}</span><span><strong>${sanitizeHTML(q.title)}</strong><small>${q.completed ? 'Mission complete' : `${q.progress}/${q.target} · +${q.expReward} EXP`}</small></span><span class="material-symbols-rounded mission-arrow">chevron_right</span></button>`).join('')}</div>
      </section>

      <section class="event-feature" onclick="window.__nav('events')"><div class="event-date"><strong>${event ? dateLabel.split(' ')[1] : '—'}</strong><small>${event ? dateLabel.split(' ')[0] : ''}</small></div><div class="event-copy"><p>UPCOMING EVENT</p><h3>${event ? sanitizeHTML(event.title) : 'No event scheduled'}</h3><small>${event ? `${sanitizeHTML(event.location)} · ${used}/${capacity} seats reserved` : 'Browse the calendar for activities'}</small><div class="seat-meter"><i style="width:${event ? Math.min(100, used / capacity * 100) : 0}%"></i></div></div><span class="material-symbols-rounded">arrow_forward</span></section>

      <section class="dashboard-section"><div class="section-title"><div><p class="eyebrow">SHORTCUTS</p><h3>Quick actions</h3></div></div><div class="action-grid">
        <button onclick="window.__nav('learning')"><span class="material-symbols-rounded">menu_book</span><small>Learn</small></button>
        <button onclick="window.__nav('events')"><span class="material-symbols-rounded">event</span><small>Events</small></button>
        <button onclick="window.__checkin()"><span class="material-symbols-rounded">qr_code_scanner</span><small>Check in</small></button>
        <button onclick="window.__showGrievance()"><span class="material-symbols-rounded">gavel</span><small>Grievance</small></button>
      </div></section>

      <section class="dashboard-section leaderboard-preview"><div class="section-title"><div><p class="eyebrow">COMMUNITY</p><h3>Leaderboard</h3></div><button class="text-action" onclick="window.__showLeaderboard()">See all</button></div>
        ${ranked.slice(0, 3).map((m, index) => `<div class="leader-row ${m.studentId === member.studentId ? 'is-you' : ''}"><span class="leader-medal">${['🥇','🥈','🥉'][index]}</span><span class="leader-avatar">${sanitizeHTML(m.name.charAt(0))}</span><span><strong>${sanitizeHTML(m.name)}${m.studentId === member.studentId ? ' <small>(You)</small>' : ''}</strong><small>Level ${Gamification.getLevel(m.exp).level}</small></span><b>${m.exp} EXP</b></div>`).join('')}
      </section>
      <section class="announcement-strip"><span class="material-symbols-rounded">campaign</span><p>${sanitizeHTML(data.announcements[0] || 'No announcements yet.')}</p></section>`;
  }
};

const EventsLegacy = {
  render() {
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
      html += UI.emptyState('No events scheduled yet.', 'event', '__createEvent()');
    } else {
      events.forEach(e => {
        const isPast = new Date(e.date) < new Date();
        html += `
                    <div class="event-card" data-title="${sanitizeHTML(e.title).toLowerCase()}" data-type="${e.type}">
                        <div class="event-banner" style="background:${isPast ? 'var(--border)' : 'linear-gradient(135deg,var(--primary),var(--primary-light))'};">
                            <span class="material-symbols-rounded" style="font-size:60px;">${isPast ? 'event_busy' : 'event'}</span>
                        </div>
                        <div class="event-content">
                            <div class="event-title">
                                <h3>${sanitizeHTML(e.title)}</h3>
                                <span style="font-size:0.8rem;color:${isPast ? 'var(--text-light)' : 'var(--primary)'};font-weight:600;">${isPast ? 'Past' : 'Upcoming'}</span>
                            </div>
                            <div class="event-meta">
                                <span>📅 ${e.date}</span>
                                <span>📍 ${sanitizeHTML(e.location || 'TBA')}</span>
                                <span>🏷️ ${e.type}</span>
                            </div>
                            <p style="color:var(--text-light);font-size:0.9rem;margin:8px 0;">${sanitizeHTML(e.description || 'No description.')}</p>
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;flex-wrap:wrap;gap:10px;">
                                <span class="event-reward">⭐ +${e.exp} EXP</span>
                                ${!isPast ? `<button class="btn-primary" style="padding:8px 20px;width:auto;font-size:0.85rem;" data-checkin="${e.id}">Check In</button>` : ''}
                            </div>
                        </div>
                    </div>
                `;
      });
    }

    html += `</div>`;
    document.getElementById('content').innerHTML = html;
  },

  checkin(eventId) {
    const user = Auth.currentUser;
    if (!user) return;
    const data = Storage.getAppData();
    const event = data.events.find(e => e.id === eventId);
    if (!event) return UI.toast({ message: 'Event not found.', type: 'error' });

    const member = data.members.find(m => m.studentId === user.studentId);
    if (!member) return;

    const today = new Date().toISOString().split('T')[0];
    if (member.attendance && member.attendance.includes(today)) {
      return UI.toast({ message: 'You already checked in today!', type: 'warning' });
    }

    if (!member.attendance) member.attendance = [];
    member.attendance.push(today);

    const result = Gamification.addExp(user.studentId, event.exp, `Attended ${event.title}`);

    if (!data.checkIns) data.checkIns = [];
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

    Storage.updateQuestProgress('checkin');

    this.render();
    Dashboard.render();
  }
};

// ================================================================
// VIEW: Events — RSVP, calendar, and personal schedule
// ================================================================
const EventsLegacyRsvp = {
  render() {
    const data = Storage.getAppData();
    const userId = Auth.currentUser?.studentId;
    const events = [...data.events].sort((a, b) => new Date(a.date) - new Date(b.date));
    const upcoming = events.filter(event => new Date(event.date) >= new Date());
    const scheduled = upcoming.filter(event => event.rsvps?.[userId] === 'going');
    document.getElementById('content').innerHTML = `
      <section class="my-schedule-card"><div><p class="eyebrow">MY SCHEDULE</p><h3>${scheduled.length ? `You’re going to ${scheduled.length} upcoming event${scheduled.length === 1 ? '' : 's'}.` : 'Build your event schedule.'}</h3><p>${scheduled.length ? scheduled.slice(0, 2).map(event => `${sanitizeHTML(event.title)} · ${event.date}`).join('<br>') : 'RSVP “Going” to see confirmed events here.'}</p></div><span class="material-symbols-rounded">calendar_month</span></section>
      <div class="event-tools"><label class="learning-search"><span class="material-symbols-rounded">search</span><input id="event-search" placeholder="Search events..."></label><select id="event-filter"><option value="all">All types</option><option value="assembly">Assembly</option><option value="competition">Competition</option><option value="sports">Sports</option><option value="volunteer">Volunteer</option></select></div>
      <div id="event-list">${events.length ? events.map(event => this.renderCard(event, userId)).join('') : UI.emptyState('No events scheduled yet.', 'event', '__createEvent()')}</div>`;
    document.querySelectorAll('[data-rsvp]').forEach(button => button.addEventListener('click', () => this.rsvp(Number(button.dataset.eventId), button.dataset.rsvp)));
    document.getElementById('event-search')?.addEventListener('input', this.filterList);
    document.getElementById('event-filter')?.addEventListener('change', this.filterList);
  },
  renderCard(event, userId) {
    const past = new Date(event.date) < new Date();
    const status = event.rsvps?.[userId] || '';
    const going = Object.values(event.rsvps || {}).filter(value => value === 'going').length;
    const capacity = event.capacity || 50;
    const full = going >= capacity && status !== 'going';
    return `<article class="event-card" data-title="${sanitizeHTML(event.title).toLowerCase()}" data-type="${event.type}"><div class="event-banner ${past ? 'past' : ''}"><span class="material-symbols-rounded">${past ? 'event_busy' : 'event'}</span></div><div class="event-content"><div class="event-title"><h3>${sanitizeHTML(event.title)}</h3><span class="status ${past ? 'past' : ''}">${past ? 'Past' : 'Upcoming'}</span></div><div class="event-meta"><span>📅 ${event.date}</span><span>📍 ${sanitizeHTML(event.location || 'TBA')}</span><span>🏷️ ${event.type}</span></div><p class="event-description">${sanitizeHTML(event.description || 'No description.')}</p>${past ? '' : `<div class="event-attendance"><span class="material-symbols-rounded">groups</span>${going}/${capacity} going${full ? ' · Full' : ''}</div><div class="event-rsvp"><button class="${status === 'going' ? 'selected' : ''}" data-rsvp="going" data-event-id="${event.id}" ${full ? 'disabled' : ''}>Going</button><button class="${status === 'maybe' ? 'selected' : ''}" data-rsvp="maybe" data-event-id="${event.id}">Maybe</button><button class="${status === 'no' ? 'selected' : ''}" data-rsvp="no" data-event-id="${event.id}">Can’t go</button></div>`}<div class="event-footer"><span class="event-reward">⭐ +${event.exp} EXP</span>${past ? '' : `<div><button class="calendar-btn" onclick="window.__downloadEventCalendar(${event.id})"><span class="material-symbols-rounded">event_available</span> Calendar</button><button class="btn-primary event-checkin" data-checkin="${event.id}">Check In</button></div>`}</div></div></article>`;
  },
  filterList() {
    const query = document.getElementById('event-search')?.value.toLowerCase() || '';
    const type = document.getElementById('event-filter')?.value || 'all';
    document.querySelectorAll('#event-list .event-card').forEach(card => { card.style.display = card.dataset.title.includes(query) && (type === 'all' || card.dataset.type === type) ? '' : 'none'; });
  },
  rsvp(eventId, status) {
    const data = Storage.getAppData(); const event = data.events.find(item => item.id === eventId); const userId = Auth.currentUser?.studentId;
    if (!event || !userId) return;
    event.rsvps ||= {};
    const going = Object.values(event.rsvps).filter(value => value === 'going').length;
    if (status === 'going' && event.rsvps[userId] !== 'going' && going >= (event.capacity || 50)) return UI.toast({ message: 'This event is full. You can still choose Maybe.', type: 'warning' });
    event.rsvps[userId] = status; Storage.saveAppData(data);
    UI.toast({ message: status === 'going' ? 'You’re going!' : status === 'maybe' ? 'Marked as maybe.' : 'You’re marked as unable to attend.', type: status === 'going' ? 'success' : 'info' }); this.render();
  },
  downloadCalendar(eventId) {
    const event = Storage.getAppData().events.find(item => item.id === eventId); if (!event) return;
    const date = event.date.replaceAll('-', ''); const escape = value => String(value || '').replace(/[\\,;]/g, '\\$&').replace(/\n/g, '\\n');
    const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:sepolscis-${event.id}@sepolscis\r\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}\r\nDTSTART:${date}T090000\r\nDTEND:${date}T110000\r\nSUMMARY:${escape(event.title)}\r\nLOCATION:${escape(event.location || 'TBA')}\r\nDESCRIPTION:${escape(event.description || '')}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`; link.click(); URL.revokeObjectURL(url); UI.toast({ message: 'Calendar file downloaded.', type: 'success' });
  },
  checkin(eventId) {
    const user = Auth.currentUser; if (!user) return; const data = Storage.getAppData(); const event = data.events.find(item => item.id === eventId); const member = data.members.find(item => item.studentId === user.studentId);
    if (!event || !member) return UI.toast({ message: 'Event not found.', type: 'error' }); const today = new Date().toISOString().split('T')[0];
    if (member.attendance?.includes(today)) return UI.toast({ message: 'You already checked in today!', type: 'warning' });
    member.attendance ||= []; member.attendance.push(today); Gamification.addExp(user.studentId, event.exp, `Attended ${event.title}`); data.checkIns ||= []; data.checkIns.push({ memberId: user.studentId, eventId: event.id, date: today, exp: event.exp }); Storage.saveAppData(data); Auth.currentUser = { ...Auth.currentUser, ...member }; Storage.setCurrentUser(Auth.currentUser); UI.toast({ message: `Checked in to ${event.title}! +${event.exp} EXP`, type: 'success' }); UI.confetti({ count: 40 }); Storage.updateQuestProgress('checkin'); this.render();
  }
};

// ================================================================
// VIEW: Events — RSVP, calendar, and personal schedule
// ================================================================
const Events = {
  get data() { return Storage.getAppData(); },
  render() {
    const data = this.data, userId = Auth.currentUser?.studentId;
    const events = [...data.events].sort((a, b) => new Date(a.date) - new Date(b.date));
    const going = events.filter(e => new Date(e.date) >= new Date() && e.rsvps?.[userId] === 'going');
    document.getElementById('content').innerHTML = `<section class="my-schedule-card"><div><p class="eyebrow">MY SCHEDULE</p><h3>${going.length ? `You are going to ${going.length} upcoming event${going.length === 1 ? '' : 's'}.` : 'Build your event schedule.'}</h3><p>${going.length ? going.slice(0, 2).map(e => `${sanitizeHTML(e.title)} · ${e.date}`).join('<br>') : 'RSVP Going to place an event on your schedule.'}</p><button class="text-action" onclick="window.__nav('schedule')">Open My Schedule</button></div><span class="material-symbols-rounded">calendar_month</span></section><div class="event-tools"><label class="learning-search"><span class="material-symbols-rounded">search</span><input id="event-search" placeholder="Search events..."></label><select id="event-filter"><option value="all">All types</option><option value="assembly">Assembly</option><option value="competition">Competition</option><option value="sports">Sports</option><option value="volunteer">Volunteer</option></select></div><div id="event-list">${events.length ? events.map(e => this.card(e, userId)).join('') : UI.emptyState('No events scheduled yet.', 'event', '__createEvent()')}</div>`;
    document.querySelectorAll('[data-rsvp]').forEach(b => b.addEventListener('click', () => this.rsvp(Number(b.dataset.eventId), b.dataset.rsvp)));
    document.getElementById('event-search')?.addEventListener('input', () => this.filter());
    document.getElementById('event-filter')?.addEventListener('change', () => this.filter());
  },
  card(event, userId) {
    const past = new Date(event.date) < new Date(), status = event.rsvps?.[userId] || '';
    const attendees = Object.entries(event.rsvps || {}).filter(([, value]) => value === 'going').map(([id]) => this.data.members.find(m => m.studentId === id)?.name).filter(Boolean);
    const capacity = event.capacity || 50, full = attendees.length >= capacity && status !== 'going';
    const confirmed = this.data.checkIns?.some(i => i.memberId === userId && i.eventId === event.id);
    return `<article class="event-card" data-title="${sanitizeHTML(event.title).toLowerCase()}" data-type="${event.type}"><div class="event-banner ${past ? 'past' : ''}"><span class="material-symbols-rounded">${past ? 'event_busy' : 'event'}</span></div><div class="event-content"><div class="event-title"><h3>${sanitizeHTML(event.title)}</h3><span class="status ${past ? 'past' : ''}">${past ? 'Past' : 'Upcoming'}</span></div><div class="event-meta"><span>📅 ${event.date}</span><span>📍 ${sanitizeHTML(event.location || 'TBA')}</span><span>🏷️ ${event.type}</span></div><p class="event-description">${sanitizeHTML(event.description || 'No description.')}</p><div class="event-attendance"><span class="material-symbols-rounded">groups</span>${attendees.length}/${capacity} going · ${Math.max(capacity - attendees.length, 0)} slots available</div><p class="attendee-list">${attendees.length ? `<strong>Attending:</strong> ${attendees.map(sanitizeHTML).join(', ')}` : 'Be the first to RSVP.'}</p>${past ? '' : `<div class="event-rsvp"><button class="${status === 'going' ? 'selected' : ''}" data-rsvp="going" data-event-id="${event.id}" ${full ? 'disabled' : ''}>Going</button><button class="${status === 'maybe' ? 'selected' : ''}" data-rsvp="maybe" data-event-id="${event.id}">Maybe</button><button class="${status === 'no' ? 'selected' : ''}" data-rsvp="no" data-event-id="${event.id}">Can't attend</button></div>`}<div class="event-footer"><span class="event-reward">⭐ +${event.exp} EXP</span><div>${!past ? `<button class="calendar-btn" onclick="window.__downloadEventCalendar(${event.id})">Calendar</button><button class="btn-primary event-checkin" data-checkin="${event.id}">${confirmed ? 'Attendance confirmed' : 'Confirm attendance'}</button>` : ''}${confirmed ? `<button class="calendar-btn" onclick="window.__eventFeedback(${event.id})">Feedback</button>` : ''}</div></div></div></article>`;
  },
  filter() { const q = document.getElementById('event-search')?.value.toLowerCase() || '', type = document.getElementById('event-filter')?.value || 'all'; document.querySelectorAll('#event-list .event-card').forEach(c => c.style.display = c.dataset.title.includes(q) && (type === 'all' || c.dataset.type === type) ? '' : 'none'); },
  rsvp(eventId, status) { const data = this.data, event = data.events.find(e => e.id === eventId), userId = Auth.currentUser?.studentId; if (!event || !userId) return; event.rsvps ||= {}; const count = Object.values(event.rsvps).filter(x => x === 'going').length; if (status === 'going' && event.rsvps[userId] !== 'going' && count >= (event.capacity || 50)) return UI.toast({ message: 'This event is full. You can still select Maybe.', type: 'warning' }); event.rsvps[userId] = status; Storage.saveAppData(data); UI.toast({ message: status === 'going' ? 'Added to My Schedule.' : 'RSVP updated.', type: 'success' }); this.render(); },
  downloadCalendar(eventId) { const event = this.data.events.find(e => e.id === eventId); if (!event) return; const date = event.date.replaceAll('-', ''); const esc = v => String(v || '').replace(/[\\,;]/g, '\\$&').replace(/\n/g, '\\n'); const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:sepolscis-${event.id}@sepolscis\r\nDTSTART:${date}T090000\r\nDTEND:${date}T110000\r\nSUMMARY:${esc(event.title)}\r\nLOCATION:${esc(event.location)}\r\nDESCRIPTION:${esc(event.description)}\r\nEND:VEVENT\r\nEND:VCALENDAR`; const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = `${event.title}.ics`; a.click(); URL.revokeObjectURL(url); },
  checkin(eventId) { const user = Auth.currentUser, data = this.data, event = data.events.find(e => e.id === eventId), member = data.members.find(m => m.studentId === user?.studentId); if (!event || !member) return UI.toast({ message: 'Event not found.', type: 'error' }); if (data.checkIns?.some(i => i.memberId === user.studentId && i.eventId === eventId)) return UI.toast({ message: 'Attendance is already confirmed for this event.', type: 'warning' }); const today = new Date().toISOString().split('T')[0]; member.attendance ||= []; member.attendance.push(today); data.checkIns ||= []; data.checkIns.push({ memberId: user.studentId, eventId, date: today, exp: event.exp }); Storage.saveAppData(data); Gamification.addExp(user.studentId, event.exp, `Attended ${event.title}`); Auth.currentUser = { ...user, ...member }; Storage.setCurrentUser(Auth.currentUser); Storage.updateQuestProgress('checkin'); UI.toast({ message: `Attendance confirmed. +${event.exp} EXP`, type: 'success' }); this.render(); },
  schedule() { const data = this.data, userId = Auth.currentUser?.studentId, entries = data.events.filter(e => ['going', 'maybe'].includes(e.rsvps?.[userId]) && new Date(e.date) >= new Date()).sort((a,b) => new Date(a.date)-new Date(b.date)); document.getElementById('content').innerHTML = `<section class="page-intro"><p class="eyebrow">MY SCHEDULE</p><h2>Your registered events</h2><p>Set a reminder and add any event to your phone calendar.</p></section>${entries.length ? entries.map(e => `<article class="schedule-item"><div><strong>${sanitizeHTML(e.title)}</strong><p>📅 ${e.date} · ${sanitizeHTML(e.location || 'TBA')}</p><span class="status">${e.rsvps[userId] === 'going' ? 'Going' : 'Maybe'}</span></div><div><label class="reminder-label">Reminder <select data-reminder="${e.id}"><option value="none">None</option><option value="1 day">1 day before</option><option value="1 hour">1 hour before</option></select></label><button class="calendar-btn" onclick="window.__downloadEventCalendar(${e.id})">Add to calendar</button></div></article>`).join('') : UI.emptyState('Your schedule is empty. RSVP to an event to get started.', 'event', '__nav(\'events\')')}`; document.querySelectorAll('[data-reminder]').forEach(s => { const e = data.events.find(x => x.id === Number(s.dataset.reminder)); s.value = e.reminders?.[userId] || 'none'; s.addEventListener('change', () => { e.reminders ||= {}; e.reminders[userId] = s.value; Storage.saveAppData(data); UI.toast({ message: s.value === 'none' ? 'Reminder removed.' : `Reminder set for ${s.value}.`, type: 'success' }); }); }); },
  feedback(eventId) { const event = this.data.events.find(e => e.id === eventId); UI.modal(`<h3>Event feedback</h3><p>How was ${sanitizeHTML(event?.title || 'the event')}?</p><form id="event-feedback-form"><label>Rating <select id="feedback-rating"><option value="5">5 — Excellent</option><option value="4">4 — Good</option><option value="3">3 — Okay</option><option value="2">2 — Needs work</option><option value="1">1 — Poor</option></select></label><label>Comments<textarea id="feedback-comment" placeholder="What should we keep or improve?"></textarea></label><button class="btn-primary" type="submit">Submit feedback</button></form>`); document.getElementById('event-feedback-form')?.addEventListener('submit', e => { e.preventDefault(); const data = this.data; data.eventFeedback.push({ id: Date.now(), eventId, memberId: Auth.currentUser.studentId, rating: Number(document.getElementById('feedback-rating').value), comment: document.getElementById('feedback-comment').value.trim(), createdAt: new Date().toISOString() }); Storage.saveAppData(data); UI.closeModal(); UI.toast({ message: 'Thanks for your feedback!', type: 'success' }); }); }
};

// ================================================================
// VIEW: Profile
// ================================================================
const Opportunities = {
  render() {
    const data = Storage.getAppData(), userId = Auth.currentUser?.studentId;
    const items = [...data.opportunities].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    document.getElementById('content').innerHTML = `<section class="page-intro"><p class="eyebrow">OPPORTUNITIES HUB</p><h2>Open doors for your next chapter</h2><p>Scholarships, internships, debate invitations, volunteer work, and deadlines in one place.</p></section><div class="opportunity-filters">${['All', 'Scholarship', 'Internship', 'Debate', 'Volunteer'].map(type => `<button data-opportunity-filter="${type}" class="${type === 'All' ? 'selected' : ''}">${type}</button>`).join('')}</div><div id="opportunity-list">${items.map(item => this.card(item, userId)).join('')}</div>`;
    document.querySelectorAll('[data-opportunity-filter]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-opportunity-filter]').forEach(x => x.classList.toggle('selected', x === button)); document.querySelectorAll('.opportunity-card').forEach(card => card.style.display = button.dataset.opportunityFilter === 'All' || card.dataset.type === button.dataset.opportunityFilter ? '' : 'none'); }));
  },
  card(item, userId) { const saved = item.savedBy?.includes(userId); return `<article class="opportunity-card" data-type="${item.type}"><div><span class="opportunity-type">${item.type}</span><h3>${sanitizeHTML(item.title)}</h3><p class="muted">${sanitizeHTML(item.organization)} · Deadline: <strong>${item.deadline}</strong></p><p>${sanitizeHTML(item.description)}</p><p class="muted">📍 ${sanitizeHTML(item.location)}</p></div><button class="save-opportunity ${saved ? 'selected' : ''}" onclick="window.__saveOpportunity('${item.id}')"><span class="material-symbols-rounded">${saved ? 'bookmark' : 'bookmark_add'}</span>${saved ? 'Saved' : 'Save deadline'}</button></article>`; },
  save(id) { const data = Storage.getAppData(), item = data.opportunities.find(x => x.id === id), userId = Auth.currentUser?.studentId; if (!item || !userId) return; item.savedBy ||= []; item.savedBy.includes(userId) ? item.savedBy = item.savedBy.filter(x => x !== userId) : item.savedBy.push(userId); Storage.saveAppData(data); UI.toast({ message: item.savedBy.includes(userId) ? 'Opportunity saved to your portfolio.' : 'Opportunity removed from saved items.', type: 'success' }); this.render(); }
};

const Portfolio = {
  render() {
    const data = Storage.getAppData(), member = data.members.find(m => m.studentId === Auth.currentUser?.studentId); if (!member) return;
    const checkIns = data.checkIns?.filter(x => x.memberId === member.studentId) || [], badges = Gamification.getMemberBadges(member.studentId).filter(x => x.unlocked), saved = data.opportunities.filter(x => x.savedBy?.includes(member.studentId));
    const roles = member.position ? [member.position] : [], hours = checkIns.reduce((total, checkIn) => total + (data.events.find(e => e.id === checkIn.eventId)?.type === 'volunteer' ? 4 : 0), 0);
    document.getElementById('content').innerHTML = `<section class="portfolio-hero"><p class="eyebrow">STUDENT PORTFOLIO</p><h2>${sanitizeHTML(member.name)}</h2><p>A growing record of participation, leadership, and achievement.</p><button class="btn-primary" onclick="window.__downloadCertificate()"><span class="material-symbols-rounded">download</span> Download participation certificate</button></section><div class="portfolio-stats"><div><strong>${checkIns.length}</strong><span>Events attended</span></div><div><strong>${badges.length}</strong><span>Badges earned</span></div><div><strong>${hours}</strong><span>Service hours</span></div></div><section class="portfolio-section"><h3>Attendance</h3>${checkIns.length ? `<ul>${checkIns.map(x => `<li>${sanitizeHTML(data.events.find(e => e.id === x.eventId)?.title || 'Organization event')} <span>${x.date}</span></li>`).join('')}</ul>` : '<p class="muted">Confirm attendance at events to grow this record.</p>'}</section><section class="portfolio-section"><h3>Badges & achievements</h3><div class="badge-grid">${badges.length ? badges.map(b => `<div> ${b.icon} <strong>${sanitizeHTML(b.name)}</strong><small>${sanitizeHTML(b.desc)}</small></div>`).join('') : '<p class="muted">Complete activities to earn badges.</p>'}</div>${member.achievements?.length ? `<p><strong>Highlights:</strong> ${member.achievements.map(sanitizeHTML).join(' · ')}</p>` : ''}</section><section class="portfolio-section"><h3>Leadership & service</h3><p>${roles.length ? `Leadership role: <strong>${sanitizeHTML(roles.join(', '))}</strong>` : 'No leadership role recorded yet.'}</p><p>${hours} verified volunteer service hours from confirmed volunteer events.</p></section><section class="portfolio-section"><h3>Saved opportunities</h3>${saved.length ? `<ul>${saved.map(x => `<li>${sanitizeHTML(x.title)} <span>Due ${x.deadline}</span></li>`).join('')}</ul>` : '<p class="muted">Save an opportunity to keep it in your portfolio.</p>'}</section>`;
  },
  certificate() { const data = Storage.getAppData(), member = data.members.find(m => m.studentId === Auth.currentUser?.studentId), count = data.checkIns?.filter(x => x.memberId === member?.studentId).length || 0; const page = window.open('', '_blank'); if (!page) return UI.toast({ message: 'Please allow pop-ups to download your certificate.', type: 'warning' }); page.document.write(`<title>Participation Certificate</title><style>body{font-family:Georgia;text-align:center;padding:80px;color:#29431d}h1{font-size:42px}main{border:8px solid #759954;padding:65px;max-width:700px;margin:auto}small{color:#555}</style><main><h1>Certificate of Participation</h1><p>This certifies that</p><h2>${sanitizeHTML(member.name)}</h2><p>has actively participated in SEPOLSCIS activities, with <strong>${count}</strong> confirmed event attendance record${count === 1 ? '' : 's'}.</p><p>Issued ${new Date().toLocaleDateString()}</p><br><small>SEPOLSCIS · Student Excellence in Political Science</small></main>`); page.document.close(); page.focus(); setTimeout(() => page.print(), 250); }
};

const Profile = {
  render() {
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
                <h2>${sanitizeHTML(member.name)}</h2>
                <p>${sanitizeHTML(member.position || 'Member')} • ${member.year} Year</p>
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

            <section class="digital-id-card">
                <div class="id-topline"><img src="logo.png" alt="SEPOLSCIS logo"><div><strong>SEPOLSCIS</strong><small>Digital Member ID</small></div><span class="material-symbols-rounded">verified</span></div>
                <div class="id-body"><div class="id-avatar">${sanitizeHTML(member.name.charAt(0))}</div><div><h3>${sanitizeHTML(member.name)}</h3><p>${sanitizeHTML(member.course || 'B.A. Political Science')}</p><span>${sanitizeHTML(member.studentId)} · ${member.year} Year</span></div><div class="id-qr" aria-label="Member QR identity code"><i></i><i></i><i></i></div></div>
                <div class="id-footer"><span>MEMBER SINCE 2026</span><span>${sanitizeHTML(member.membership || 'Active')} MEMBER</span></div>
            </section>

            <div class="card">
                <h4>📋 Member Details</h4>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
                    <div><strong>Student ID</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${sanitizeHTML(member.studentId)}</span></div>
                    <div><strong>Course</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${sanitizeHTML(member.course || 'B.A. Political Science')}</span></div>
                    <div><strong>Year</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.year}</span></div>
                    <div><strong>Membership</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${member.membership}</span></div>
                    <div><strong>Position</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${sanitizeHTML(member.position || 'N/A')}</span></div>
                    <div><strong>Email</strong><br><span style="color:var(--text-light);font-size:0.9rem;">${sanitizeHTML(member.email || 'N/A')}</span></div>
                </div>
            </div>
        `;

    html += `
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
                            <strong style="font-size:0.8rem;">${sanitizeHTML(b.name)}</strong>
                            <p style="font-size:0.65rem;color:var(--text-light);margin-top:4px;">${b.unlocked ? '✅ Unlocked' : '🔒 Locked'}</p>
                        </div>
                    `).join('')}
                </div>
                ${unlocked.length < badges.length ? `<p style="margin-top:12px;color:var(--text-muted);font-size:0.85rem;">🎯 Next badge: ${badges.find(b => !b.unlocked)?.name} - ${badges.find(b => !b.unlocked)?.desc}</p>` : `<p style="margin-top:12px;color:var(--success);font-size:0.85rem;">🏆 You've unlocked all badges! Amazing work!</p>`}
            </div>
        `;

    if (member.achievements && member.achievements.length > 0) {
      html += `
                <div class="card">
                    <h4>🏆 Achievements</h4>
                    <ul style="list-style:none;padding:0;margin-top:8px;">
                        ${member.achievements.map(a => `<li style="padding:6px 0;border-bottom:1px solid var(--border);display:flex;gap:10px;"><span class="material-symbols-rounded" style="color:var(--primary);font-size:20px;">emoji_events</span>${sanitizeHTML(a)}</li>`).join('')}
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
        `;

    html += `
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
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <button class="text-btn" style="text-align:left;color:var(--danger);padding:8px 0;" onclick="window.__resetApp()">🗑️ Reset App Data</button>
                        <button class="text-btn" style="text-align:left;color:var(--primary);padding:8px 0;" onclick="window.__exportData()">📤 Export Data</button>
                        <button class="text-btn" style="text-align:left;color:var(--primary);padding:8px 0;" onclick="document.getElementById('import-input').click()">📥 Import Data</button>
                        <input type="file" id="import-input" accept=".json" style="display:none;">
                    </div>
                </div>
            </div>
        `;

    document.getElementById('content').innerHTML = html;

    document.getElementById('dark-mode-toggle')?.addEventListener('change', function() {
      document.body.classList.toggle('dark', this.checked);
      localStorage.setItem('darkMode', this.checked);
    });

    document.getElementById('import-input')?.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          Storage.saveAppData(data);
          UI.toast({ message: 'Data imported successfully!', type: 'success' });
          location.reload();
        } catch {
          UI.toast({ message: 'Invalid file.', type: 'error' });
        }
      };
      reader.readAsText(file);
    });
  }
};

// ================================================================
// VIEW: Leaderboard
// ================================================================
const Leaderboard = {
  render() {
    const data = Storage.getAppData();
    const sorted = [...data.members].sort((a, b) => b.exp - a.exp);

    let html = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h3>🏆 Leaderboard</h3>
                <span style="color:var(--text-light);font-size:0.9rem;">${sorted.length} members</span>
            </div>
        `;

    if (sorted.length === 0) {
      html += UI.emptyState('No members yet.', 'groups');
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
                            <strong>${sanitizeHTML(m.name)}</strong>
                            <div style="font-size:0.8rem;color:var(--text-light);">${sanitizeHTML(m.position || 'Member')} • ${m.year} Year</div>
                        </div>
                        <div class="rank-exp">${m.exp} EXP</div>
                    </div>
                `;
      });
      html += `</div>`;
    }

    document.getElementById('content').innerHTML = html;
  }
};

// ================================================================
// VIEW: Grievance
// ================================================================
const Grievance = {
  render() {
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
      html += UI.emptyState('No grievances found.', 'gavel', '__showGrievanceForm()');
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
                                <h4>${sanitizeHTML(g.title)}</h4>
                                <p style="color:var(--text-light);font-size:0.9rem;margin-top:4px;">${sanitizeHTML(g.description)}</p>
                                ${g.anonymous ? '<p style="font-size:0.8rem;color:var(--text-light);">🔒 Anonymous</p>' : ''}
                            </div>
                            <span style="padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;background:${status.color}20;color:${status.color};">${status.label}</span>
                        </div>
                        <div style="margin-top:10px;font-size:0.8rem;color:var(--text-light);">
                            <span>📅 ${new Date(g.createdAt).toLocaleDateString()}</span>
                            ${g.notes ? `<p style="margin-top:4px;">📝 ${sanitizeHTML(g.notes)}</p>` : ''}
                            ${g.resolution ? `<p style="margin-top:4px;color:var(--success);">✅ Resolution: ${sanitizeHTML(g.resolution)}</p>` : ''}
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
                        <textarea id="grievance-desc" style="flex:1;border:none;outline:none;background:transparent;resize:vertical;min-height:80px;font-family:inherit;font-size:14px;color:var(--text);" placeholder="We take every concern seriously. Whether it’s about an event, a policy, or just something that doesn’t feel right – we’re here to listen. You can submit anonymously." required></textarea>
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
      Storage.updateQuestProgress('grievance');
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
// VIEW: Learning (with all 6 constitutions)
// ================================================================
const LearningLegacy = {
  currentTab: 'constitution',

  render() {
    const data = Storage.getAppData();
    const resources = data.learningResources || {};

    const tabs = [
      { id: 'constitution', label: '1987 Constitution', icon: 'gavel' },
      { id: 'constitution1899', label: '1899 Malolos', icon: 'history' },
      { id: 'constitution1935', label: '1935 Commonwealth', icon: 'history' },
      { id: 'constitution1943', label: '1943 Occupation', icon: 'history' },
      { id: 'constitution1973', label: '1973 Marcos', icon: 'history' },
      { id: 'constitution1986', label: '1986 Freedom', icon: 'history' },
      { id: 'bylaws', label: 'By-Laws', icon: 'menu_book' },
      { id: 'news', label: 'News', icon: 'newspaper' },
      { id: 'government', label: 'Government', icon: 'account_balance' },
      { id: 'reviewer', label: 'Reviewer', icon: 'school' },
    ];

    let html = `
      <h3 style="margin-bottom:16px;">📚 Learning Center</h3>
      <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;overflow-x:auto;padding-bottom:4px;max-height:180px;overflow-y:auto;">
        ${tabs.map(t => `
          <button class="tab-btn ${this.currentTab === t.id ? 'active' : ''}" data-tab="${t.id}" style="padding:10px 18px;border-radius:16px;border:none;background:${this.currentTab === t.id ? 'var(--primary)' : 'white'};color:${this.currentTab === t.id ? 'white' : 'var(--text)'};font-weight:600;font-size:0.85rem;display:flex;align-items:center;gap:6px;box-shadow:${this.currentTab === t.id ? '0 8px 20px rgba(117,153,84,0.3)' : 'var(--shadow)'};transition:.3s;cursor:pointer;">
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
        Storage.updateQuestProgress('read');
      });
    });
  },

  renderTab(tab, resources) {
    const content = resources[tab] || 'Content not yet available.';
    const titles = {
      'constitution': '📜 1987 Constitution (Present)',
      'constitution1899': '📜 1899 Malolos Constitution',
      'constitution1935': '📜 1935 Commonwealth Constitution',
      'constitution1943': '📜 1943 Japanese Occupation Constitution',
      'constitution1973': '📜 1973 Marcos Constitution',
      'constitution1986': '📜 1986 Freedom Constitution (Provisional)',
      'bylaws': '📋 By-Laws',
      'news': '📰 Latest News',
      'government': '🏛️ Government Updates',
      'reviewer': '📖 Reviewer'
    };

    return `
      <h4>${titles[tab] || tab}</h4>
      <div style="margin-top:12px;line-height:1.8;color:var(--text-light);white-space:pre-wrap;max-height:400px;overflow-y:auto;padding-right:8px;">
        ${sanitizeHTML(content)}
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
// VIEW: Learning — organized, interactive study hub
// ================================================================
const Learning = {
  currentCategory: 'all',
  currentTopic: 'constitution',
  searchTerm: '',
  topics: [
    { id: 'constitution', title: '1987 Constitution', category: 'constitutions', icon: 'gavel', takeaway: 'The Constitution is the country’s highest law and protects fundamental rights.' },
    { id: 'constitution1899', title: '1899 Malolos Constitution', category: 'constitutions', icon: 'history', takeaway: 'It established the First Philippine Republic and placed sovereignty in the people.' },
    { id: 'constitution1935', title: '1935 Commonwealth', category: 'constitutions', icon: 'history', takeaway: 'It created the Commonwealth government that prepared the country for independence.' },
    { id: 'constitution1943', title: '1943 Occupation', category: 'constitutions', icon: 'history', takeaway: 'It was adopted during the Japanese occupation of the Philippines.' },
    { id: 'constitution1973', title: '1973 Constitution', category: 'constitutions', icon: 'history', takeaway: 'It changed the structure of government during the Marcos era.' },
    { id: 'constitution1986', title: '1986 Freedom Constitution', category: 'constitutions', icon: 'history', takeaway: 'It was a provisional constitution after the People Power Revolution.' },
    { id: 'government', title: 'Government at a Glance', category: 'government', icon: 'account_balance', takeaway: 'The legislative, executive, and judicial branches have distinct responsibilities.' },
    { id: 'news', title: 'Current Affairs', category: 'current', icon: 'newspaper', takeaway: 'Connect reliable reporting to political-science concepts and evidence.' },
    { id: 'bylaws', title: 'SEPOLSCIS By-Laws', category: 'organization', icon: 'groups', takeaway: 'Know the organization’s rules, rights, responsibilities, and opportunities.' },
    { id: 'sepolscisConstitution', title: 'SEPOLSCIS Constitution', category: 'organization', icon: 'description', takeaway: 'Read the complete constitution and bylaws, including membership, officers, elections, and finances.' },
    { id: 'reviewer', title: 'Exam Reviewer', category: 'review', icon: 'school', takeaway: 'Use the reviewer to refresh core political-science concepts before assessments.' }
  ],
  quizzes: {
    constitution: { question: 'Where does sovereignty reside under the 1987 Constitution?', options: ['In Congress', 'In the people', 'In the President', 'In the Supreme Court'], answer: 1, explanation: 'Article II states that sovereignty resides in the people.' },
    constitution1899: { question: 'What did the Malolos Constitution establish?', options: ['A colonial government', 'The First Philippine Republic', 'A federal state', 'The Commonwealth'], answer: 1, explanation: 'It established the First Philippine Republic in 1899.' },
    government: { question: 'Which branch interprets laws?', options: ['Legislative', 'Executive', 'Judicial', 'Local government'], answer: 2, explanation: 'The judicial branch interprets laws and resolves cases.' },
    news: { question: 'Which source is best for checking a public policy claim?', options: ['An anonymous post', 'An official government source', 'A viral comment', 'An unverified screenshot'], answer: 1, explanation: 'Start with primary and official sources, then compare credible reporting.' }
  },
  getProgress() {
    const data = Storage.getAppData();
    const userId = Auth.currentUser?.studentId;
    if (!userId) return { viewed: [], saved: [], quizPassed: [] };
    data.learningProgress ||= {};
    if (!data.learningProgress[userId]) {
      data.learningProgress[userId] = { viewed: [], saved: [], quizPassed: [] };
      Storage.saveAppData(data);
    }
    return data.learningProgress[userId];
  },
  saveProgress(progress) {
    const data = Storage.getAppData();
    data.learningProgress ||= {};
    data.learningProgress[Auth.currentUser.studentId] = progress;
    Storage.saveAppData(data);
  },
  markViewed(id) {
    const progress = this.getProgress();
    if (!progress.viewed.includes(id)) {
      progress.viewed.push(id);
      this.saveProgress(progress);
      Storage.updateQuestProgress('read');
    }
  },
  toggleSaved(id) {
    const progress = this.getProgress();
    progress.saved = progress.saved.includes(id) ? progress.saved.filter(topic => topic !== id) : [...progress.saved, id];
    this.saveProgress(progress);
    this.render();
  },
  render() {
    const progress = this.getProgress();
    const categories = [['all', 'All topics'], ['constitutions', 'Constitutions'], ['government', 'Government'], ['current', 'Current affairs'], ['organization', 'SEPOLSCIS'], ['review', 'Reviewer']];
    const filtered = this.topics.filter(topic => (this.currentCategory === 'all' || topic.category === this.currentCategory) && topic.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
    const active = this.topics.find(topic => topic.id === this.currentTopic) || filtered[0] || this.topics[0];
    document.getElementById('content').innerHTML = `
      <section class="learning-hero"><p class="eyebrow">YOUR STUDY SPACE</p><h3>Learn in small, useful steps.</h3><p>${progress.quizPassed.length} quizzes completed · ${progress.saved.length} saved topics</p></section>
      <label class="learning-search"><span class="material-symbols-rounded">search</span><input id="learning-search-input" placeholder="Search a topic" value="${sanitizeHTML(this.searchTerm)}"></label>
      <div class="learning-categories">${categories.map(([id, label]) => `<button class="learning-category ${this.currentCategory === id ? 'active' : ''}" data-learning-category="${id}">${label}</button>`).join('')}</div>
      <section class="learning-layout"><div class="topic-list">${filtered.length ? filtered.map(topic => `<button class="topic-card ${active.id === topic.id ? 'selected' : ''}" data-topic="${topic.id}"><span class="material-symbols-rounded">${topic.icon}</span><span><strong>${topic.title}</strong><small>${progress.quizPassed.includes(topic.id) ? 'Quiz complete' : progress.viewed.includes(topic.id) ? 'In progress' : 'Start lesson'}</small></span><span class="material-symbols-rounded">chevron_right</span></button>`).join('') : '<p class="empty-copy">No topic matches that search.</p>'}</div><article class="card lesson-card">${this.renderTopic(active, progress)}</article></section>`;
    document.querySelectorAll('[data-learning-category]').forEach(button => button.addEventListener('click', () => { this.currentCategory = button.dataset.learningCategory; this.render(); }));
    document.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => { this.currentTopic = button.dataset.topic; this.markViewed(this.currentTopic); this.render(); }));
    document.getElementById('learning-search-input')?.addEventListener('input', event => { this.searchTerm = event.target.value; this.render(); });
  },
  renderTopic(topic, progress) {
    const resources = Storage.getAppData().learningResources || {};
    const quiz = this.quizzes[topic.id];
    return `<div class="lesson-heading"><div><span class="lesson-icon material-symbols-rounded">${topic.icon}</span><p class="eyebrow">${topic.category}</p><h3>${topic.title}</h3></div><button class="icon-text-btn" onclick="window.__toggleLearningSave('${topic.id}')"><span class="material-symbols-rounded">${progress.saved.includes(topic.id) ? 'bookmark' : 'bookmark_add'}</span>${progress.saved.includes(topic.id) ? 'Saved' : 'Save'}</button></div><div class="takeaway"><span class="material-symbols-rounded">lightbulb</span><div><strong>Key takeaway</strong><p>${topic.takeaway}</p></div></div><details class="lesson-reader"><summary>Read the lesson <span class="material-symbols-rounded">expand_more</span></summary><div>${sanitizeHTML(resources[topic.id] || 'This lesson is being prepared.').replace(/\n/g, '<br>')}</div></details>${quiz ? this.renderQuiz(topic, quiz, progress) : '<div class="practice-card"><span class="material-symbols-rounded">auto_stories</span><div><strong>Study tip</strong><p>Read the key takeaway, then make a note in your own words before moving on.</p></div></div>'}${topic.id === 'reviewer' ? '<button class="btn-primary lesson-download" onclick="window.__downloadReviewer()"><span class="material-symbols-rounded">download</span> Download reviewer</button>' : ''}`;
  },
  renderQuiz(topic, quiz, progress) {
    if (progress.quizPassed.includes(topic.id)) return '<div class="quiz-complete"><span class="material-symbols-rounded">workspace_premium</span><div><strong>Quiz complete</strong><p>Nice work—this topic is now marked complete.</p></div></div>';
    return `<section class="quiz-card"><p class="eyebrow">QUICK CHECK · +20 EXP</p><h4>${quiz.question}</h4><div class="quiz-options">${quiz.options.map((option, index) => `<button onclick="window.__answerLearningQuiz('${topic.id}', ${index})">${option}</button>`).join('')}</div></section>`;
  },
  answerQuiz(topicId, answer) {
    const quiz = this.quizzes[topicId];
    if (!quiz) return;
    if (answer !== quiz.answer) return UI.toast({ message: 'Not quite—try again and reread the key takeaway.', type: 'warning' });
    const progress = this.getProgress();
    if (!progress.quizPassed.includes(topicId)) {
      progress.quizPassed.push(topicId);
      this.saveProgress(progress);
      Gamification.addExp(Auth.currentUser.studentId, 20, `Completed ${this.topics.find(topic => topic.id === topicId)?.title} quiz`);
      UI.confetti({ count: 25 });
    }
    UI.toast({ message: `Correct! ${quiz.explanation} +20 EXP`, type: 'success' });
    this.render();
  }
};

// ================================================================
// VIEW: Officer (all methods)
// ================================================================
const Officer = {
  renderDashboard() {
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
  },

  renderMembers() {
    const data = Storage.getAppData();
    let html = `
      <h3 style="margin-bottom:16px;">👥 Members</h3>
      <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
        <input type="text" id="member-search" placeholder="Search members..." style="flex:1;padding:12px 18px;border:2px solid var(--border);border-radius:18px;font-size:0.9rem;outline:none;background:white;">
      </div>
      <div id="member-list">
    `;

    if (data.members.length === 0) {
      html += UI.emptyState('No members registered.', 'groups');
    } else {
      const sorted = [...data.members].sort((a, b) => b.exp - a.exp);
      sorted.forEach(m => {
        html += `
          <div class="card" data-name="${m.name.toLowerCase()}" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div>
              <strong>${sanitizeHTML(m.name)}</strong>
              <p style="font-size:0.8rem;color:var(--text-light);margin:0;">${sanitizeHTML(m.studentId)} • ${m.year} Year • ${sanitizeHTML(m.position || 'Member')}</p>
              <p style="font-size:0.8rem;color:var(--text-light);margin:0;">🏅 ${m.badges?.length || 0} badges • 📅 ${m.attendance?.length || 0} attendances</p>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:700;color:var(--primary);">${m.exp} EXP</div>
              <button class="btn-primary" style="padding:4px 14px;font-size:0.75rem;width:auto;margin-top:4px;" onclick="window.__viewMember('${m.studentId}')">View</button>
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    document.getElementById('content').innerHTML = html;

    document.getElementById('member-search')?.addEventListener('input', function() {
      const val = this.value.toLowerCase();
      document.querySelectorAll('#member-list .card').forEach(c => {
        const name = c.dataset.name || '';
        c.style.display = name.includes(val) ? '' : 'none';
      });
    });
  },

  renderManageEvents() {
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
      html += UI.emptyState('No events created yet.', 'event', '__createEvent()');
    } else {
      data.events.forEach(e => {
        html += `
          <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;">
              <div>
                <h4>${sanitizeHTML(e.title)}</h4>
                <p style="font-size:0.85rem;color:var(--text-light);">📅 ${e.date} • 📍 ${sanitizeHTML(e.location || 'TBA')} • 🏷️ ${e.type}</p>
                <p style="font-size:0.85rem;color:var(--text-light);">⭐ +${e.exp} EXP</p>
              </div>
              <div style="display:flex;gap:8px;">
                <button class="btn-primary" style="padding:4px 14px;font-size:0.75rem;width:auto;background:var(--danger);" onclick="window.__deleteEvent(${e.id})">Delete</button>
              </div>
            </div>
          </div>
        `;
      });
    }

    document.getElementById('content').innerHTML = html;
  },

  renderAnnouncements() {
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
      html += UI.emptyState('No announcements.', 'campaign', '__showAnnouncementForm()');
    } else {
      data.announcements.forEach((a, i) => {
        html += `
          <div class="announcement">
            <div class="announcement-icon">
              <span class="material-symbols-rounded">campaign</span>
            </div>
            <div style="flex:1;">
              <p>${sanitizeHTML(a)}</p>
              <small style="color:var(--text-light);">Posted recently</small>
            </div>
          </div>
        `;
      });
    }

    document.getElementById('content').innerHTML = html;
  },

  renderBadges() {
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
              <strong>${sanitizeHTML(b.name)}</strong>
              <p style="font-size:0.7rem;color:var(--text-light);">${count} members</p>
              <p style="font-size:0.65rem;color:var(--text-light);margin-top:4px;">${sanitizeHTML(b.desc)}</p>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('content').innerHTML = html;
  },

  renderGradeRequests() {
    const data = Storage.getAppData();
    const requests = data.members.filter(m => m.gradeConvRequested);

    let html = `
      <h3 style="margin-bottom:16px;">📝 Grade Conversion Requests</h3>
    `;

    if (requests.length === 0) {
      html += UI.emptyState('No grade conversion requests.', 'assignment');
    } else {
      requests.forEach(m => {
        html += `
          <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
              <div>
                <strong>${sanitizeHTML(m.name)}</strong>
                <p style="font-size:0.85rem;color:var(--text-light);">${sanitizeHTML(m.studentId)} • ${m.year} Year</p>
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
  },

  renderGrievances() {
    Grievance.render();
  },

  renderLeaderboard() {
    Leaderboard.render();
  },

  renderAnalytics() {
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
            <span>${i+1}. ${sanitizeHTML(m.name)}</span>
            <span style="font-weight:700;color:var(--primary);">${m.exp} EXP</span>
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('content').innerHTML = html;
  },

  showAwardBadge() {
    const data = Storage.getAppData();
    const definitions = Gamification.getBadgeDefinitions();
    let memberOptions = data.members.map(m =>
      `<option value="${m.studentId}">${sanitizeHTML(m.name)} (${m.exp} EXP)</option>`
    ).join('');
    let badgeOptions = definitions.map(b =>
      `<option value="${b.id}">${b.icon} ${sanitizeHTML(b.name)}</option>`
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
              <option value="assembly">Assembly</option>
              <option value="competition">Competition</option>
              <option value="sports">Sports</option>
              <option value="volunteer">Volunteer</option>
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

  viewMember(studentId) {
    const data = Storage.getAppData();
    const member = data.members.find(m => m.studentId === studentId);
    if (!member) return UI.toast({ message: 'Member not found.', type: 'error' });

    const level = Gamification.getLevel(member.exp);
    const badges = Gamification.getMemberBadges(member.studentId);
    const unlocked = badges.filter(b => b.unlocked);

    UI.modal(`
      <div style="text-align:center;">
        <div style="width:80px;height:80px;border-radius:50%;background:var(--accent);display:flex;justify-content:center;align-items:center;margin:auto;font-size:40px;color:var(--primary);">
          <span class="material-symbols-rounded">person</span>
        </div>
        <h3 style="margin-top:12px;">${sanitizeHTML(member.name)}</h3>
        <p style="color:var(--text-light);">${sanitizeHTML(member.studentId)} • ${member.year} Year</p>
        <p style="color:var(--text-light);">${sanitizeHTML(member.position || 'Member')} • ${member.membership}</p>
        <div style="display:flex;justify-content:center;gap:20px;margin:12px 0;">
          <span><strong>${member.exp}</strong> EXP</span>
          <span><strong>Level ${level.level}</strong></span>
          <span><strong>${member.attendance?.length || 0}</strong> Attendances</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px;">
          ${unlocked.map(b => `<span style="background:#EEF6E8;padding:4px 12px;border-radius:20px;font-size:0.8rem;">${b.icon} ${sanitizeHTML(b.name)}</span>`).join('')}
          ${unlocked.length === 0 ? '<span style="color:var(--text-light);font-size:0.9rem;">No badges yet</span>' : ''}
        </div>
        ${member.achievements?.length > 0 ? `
          <div style="margin-top:12px;text-align:left;">
            <strong>Achievements:</strong>
            <ul style="padding-left:20px;margin-top:4px;">
              ${member.achievements.map(a => `<li>${sanitizeHTML(a)}</li>`).join('')}
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
  }
};

// ================================================================
// APP – Main Controller
// ================================================================
const App = {
  init() {
    // Safety timer: force hide loading after 3 seconds
    setTimeout(() => {
      UI.hideLoading();
    }, 3000);

    this.setupListeners();

    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark');
    }

    this.setupPWA();
    document.getElementById('officer-menu-btn')?.classList.toggle('hidden', !Auth.isOfficer());

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
          .catch(() => console.log('SW registration failed'));
      });
    }

    // Event delegation for check-in buttons
    document.getElementById('content')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-checkin]');
      if (btn) {
        const eventId = parseInt(btn.dataset.checkin);
        Events.checkin(eventId);
      }
    });

    // Event delegation for search and filter
    document.getElementById('event-search')?.addEventListener('input', function() {
      const val = this.value.toLowerCase();
      document.querySelectorAll('#event-list .event-card').forEach(c => {
        const title = c.dataset.title || '';
        c.style.display = title.includes(val) ? '' : 'none';
      });
    });
    document.getElementById('event-filter')?.addEventListener('change', function() {
      const val = this.value;
      document.querySelectorAll('#event-list .event-card').forEach(c => {
        const type = c.dataset.type || '';
        c.style.display = val === 'all' || type === val ? '' : 'none';
      });
    });

    this.navigate('home');
    NotifCenter.updateBadge();
    this.updateGreeting();

    // Hide loading (in case safety timer didn't fire)
    UI.hideLoading();
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

    // Officer dashboard
    document.getElementById('officer-menu-btn')?.addEventListener('click', () => {
      if (!Auth.isOfficer()) {
        return UI.toast({ message: 'Officer access only.', type: 'warning' });
      }
      this.navigate('officer');
    });

    // FAB – QR Check-in
    document.getElementById('fab-checkin')?.addEventListener('click', () => {
      this.handleQRCheckin();
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
      document.getElementById('install-banner')?.classList.add('hidden');
      UI.toast({ message: '🎉 App installed successfully!', type: 'success' });
    });

    // Global functions
    window.__nav = (screen) => this.navigate(screen);
    window.__checkin = () => this.handleQRCheckin();
    window.__showGrievance = () => Grievance.showForm();
    window.__viewGrievances = () => { this.navigate('events');
      setTimeout(() => Grievance.render(), 100); };
    window.__viewGradeRequests = () => { this.navigate('events');
      setTimeout(() => Officer.renderGradeRequests(), 100); };
    window.__awardBadge = () => Officer.showAwardBadge();
    window.__showAnnouncementForm = () => Officer.showAnnouncementForm();
    window.__createEvent = () => Officer.createEvent();
    window.__checkinEvent = (id) => Events.checkin(id);
    window.__downloadEventCalendar = (id) => Events.downloadCalendar(id);
    window.__eventFeedback = (id) => Events.feedback(id);
    window.__saveOpportunity = (id) => Opportunities.save(id);
    window.__downloadCertificate = () => Portfolio.certificate();
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
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
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
    window.__toggleLearningSave = (id) => Learning.toggleSaved(id);
    window.__answerLearningQuiz = (id, answer) => Learning.answerQuiz(id, answer);
    window.__showGrievanceForm = () => Grievance.showForm();
    window.__handleOfficer = (action) => this.handleOfficerAction(action);
  },

  navigate(screen) {
    const titleMap = {
      'home': 'Dashboard',
      'events': 'Events',
      'schedule': 'My Schedule',
      'opportunities': 'Opportunities Hub',
      'learning': 'Learning Center',
      'profile': 'Profile',
      'portfolio': 'Rewards & Portfolio',
      'officer': 'Officer Dashboard'
    };
    document.getElementById('screen-title').textContent = titleMap[screen] || screen;

    document.querySelectorAll('.nav-item').forEach(b => {
      b.classList.toggle('active', b.dataset.screen === screen);
    });

    switch (screen) {
      case 'home':
        DashboardV2.render();
        break;
      case 'events':
        Events.render();
        break;
      case 'schedule':
        Events.schedule();
        break;
      case 'opportunities':
        Opportunities.render();
        break;
      case 'learning':
        Learning.render();
        break;
      case 'profile':
        Profile.render();
        break;
      case 'portfolio':
        Portfolio.render();
        break;
      case 'officer':
        if (Auth.isOfficer()) Officer.renderDashboard();
        else DashboardV2.render();
        break;
      default:
        DashboardV2.render();
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

  handleQRCheckin() {
    const data = Storage.getAppData();
    const upcoming = data.events.filter(e => new Date(e.date) >= new Date());

    if (upcoming.length === 0) {
      return UI.toast({ message: 'No upcoming events to check in to.', type: 'warning' });
    }

    UI.modal(`
      <h3>📷 Scan QR Code</h3>
      <div id="qr-reader" style="width:100%;max-width:400px;margin:auto;"></div>
      <button class="text-btn" data-close-modal style="margin-top:12px;">Cancel</button>
    `);

    const reader = new Html5Qrcode("qr-reader");
    reader.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        reader.stop();
        UI.closeModal();
        const eventId = parseInt(decodedText);
        if (data.events.find(e => e.id === eventId)) {
          Events.checkin(eventId);
        } else {
          UI.toast({ message: 'Invalid event QR code.', type: 'error' });
        }
      },
      (error) => { /* ignore */ }
    );

    const closeModal = document.querySelector('[data-close-modal]');
    closeModal?.addEventListener('click', () => {
      reader.stop().catch(() => {});
    });
  },

  setupPWA() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = '#759954';
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