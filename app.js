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
        exp: 770,
        attendance: ['2026-07-01', '2026-07-08', '2026-07-15', '2026-07-22'],
        badges: ['b5', 'b3', 'b2', 'b1', 'b9'],
        achievements: ['Best Leader 2025'],
        gradeConvRequested: false,
        email: 'maria@example.com',
      }, {
        studentId: '2024-0002',
        name: 'Carlos Mendoza',
        year: '3',
        course: 'B.A. Political Science',
        position: '', role: 'member',
        membership: 'Active',
        exp: 180,
        attendance: ['2026-07-01', '2026-07-08'],
        badges: [],
        achievements: [],
        gradeConvRequested: false,
        email: 'carlos@example.com',
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
      }],
      announcements: [
        'Welcome to the all-new SEPOLSCIS Portal! Configure your student details in Profile.',
        'Midterm Reviewer is now unlocked and available in the Learning Center reviewer tab.'
      ],
      notifications: [],
      checkIns: [],
      eventFeedback: [],
      learningResources: learningResources,
      quests: [
        { id: 'q1', title: 'RSVP to an upcoming event', requirement: 'rsvp', progress: 0, target: 1, expReward: 25, completed: false, date: new Date().toDateString() },
        { id: 'q2', title: 'Study a core constitution framework', requirement: 'read', progress: 0, target: 1, expReward: 15, completed: false, date: new Date().toDateString() },
        { id: 'q3', title: 'Submit an advisory grievance entry', requirement: 'grievance', progress: 0, target: 1, expReward: 25, completed: false, date: new Date().toDateString() },
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
  init() {
    const container = document.getElementById('modal-container');
    if (container) {
      container.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('[data-close-modal]');
        if (closeBtn) {
          this.closeModal();
        }
      });
    }
  },

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
      this.closeModal();
    };

    overlay.onclick = close;
    return { close, element: div };
  },

  closeModal() {
    const container = document.getElementById('modal-container');
    const overlay = document.getElementById('overlay');
    if (container) {
      const modal = container.querySelector('.modal');
      if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
          container.innerHTML = '';
        }, 300);
      } else {
        container.innerHTML = '';
      }
    }
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
      { id: 'b1', name: 'New Member', icon: '🌟', condition: 'exp >= 0', desc: 'Successfully joined the SEPOLSCIS organization' },
      { id: 'b2', name: 'Active Member', icon: '🔥', condition: 'exp >= 100', desc: 'Reached 100 EXP through consistent study' },
      { id: 'b3', name: 'Perfect Attendance', icon: '✅', condition: 'attendance >= 5', desc: 'Attended 5 organization events or forums' },
      { id: 'b4', name: 'Best Debater', icon: '🎤', condition: 'achievements.includes("Debate Winner")',
        desc: 'Awarded title of Top Debate Invitational Winner' },
      { id: 'b5', name: 'MVP', icon: '🏀', condition: 'achievements.includes("Sports MVP")', desc: 'Proclaimed MVP during Southern Mindanao Intramurals' },
      { id: 'b6', name: 'Quiz Bee Champ', icon: '🏆', condition: 'achievements.includes("Quiz Bee Champion")',
        desc: 'First Place award in annual Political Science Quiz Bee' },
      { id: 'b7', name: 'Good Samaritan', icon: '🤝', condition: 'exp >= 200', desc: 'Accumulated over 200 EXP in civic activities' },
      { id: 'b8', name: 'Executive Leader', icon: '👑', condition: 'position === "President"', desc: 'Served as President of the SMC Student Board' },
      { id: 'b9', name: 'Dean\'s Award', icon: '🎓', condition: 'exp >= 500', desc: 'Maintained outstanding marks and 500+ EXP' },
      { id: 'b10', name: 'Senior Counselor', icon: '⭐', condition: 'exp >= 300', desc: 'Senior ranking student with 300+ EXP' },
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
// VIEW: Dashboard (Home) – Orange Design
// ================================================================
const DashboardV2 = {
  render() {
    const data = Storage.getAppData();
    const user = Auth.currentUser;
    const member = data.members.find(m => m.studentId === user?.studentId);
    if (!member) return;

    const totalExp = member.exp;
    const quests = Storage.getQuests();
    const completedQuests = quests.filter(q => q.completed).length;
    const nextEvent = data.events
      .filter(e => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    const announcements = data.announcements.slice(0, 3);
    const topMembers = [...data.members].sort((a, b) => b.exp - a.exp).slice(0, 3);
    const hour = new Date().getHours();
    let greeting = 'Evening';
    if (hour < 12) greeting = 'Morning';
    else if (hour < 17) greeting = 'Afternoon';

    let html = `
      <!-- Hero -->
      <section class="hero-dashboard">
        <div class="hero-top">
          <div>
            <p class="eyebrow">SMC ORGANIZATION PORTAL</p>
            <h2>Good ${greeting}, ${sanitizeHTML(member.name.split(' ')[0])}!</h2>
            <p>Welcome back to SEPOLSCIS. Small daily milestones compose an elite participation record. Track your academic standing below.</p>
          </div>
          <div class="hero-exp">
            <strong>${totalExp}</strong>
            <span>Total EXP Gained</span>
          </div>
        </div>
      </section>

      <!-- Daily Study Check-in -->
      <section class="daily-missions">
        <div class="section-header">
          <h3>📋 DAILY STUDY CHECK-IN</h3>
          <span>Mission: ${completedQuests}/${quests.length} Completed</span>
        </div>
        ${quests.map(q => `
          <div class="mission-item ${q.completed ? 'done' : ''}">
            <span class="mission-icon">${q.completed ? '✅' : '⬜'}</span>
            <div>
              <strong>${sanitizeHTML(q.title)}</strong>
              <small>${q.completed ? 'Mission Complete!' : `${q.progress}/${q.target} Progress · +${q.expReward} EXP`}</small>
            </div>
          </div>
        `).join('')}
      </section>

      <!-- Quick Navigation -->
      <section class="quick-nav">
        <div class="section-header"><h3>QUICK NAVIGATION</h3></div>
        <div class="quick-grid">
          <button onclick="window.__nav('learning')"><span class="material-symbols-rounded">menu_book</span> Lessons</button>
          <button onclick="window.__nav('events')"><span class="material-symbols-rounded">event</span> Events</button>
          <button onclick="window.__nav('portfolio')"><span class="material-symbols-rounded">workspace_premium</span> Rewards</button>
          <button onclick="window.__showGrievance()"><span class="material-symbols-rounded">report</span> Reports</button>
        </div>
      </section>

      <!-- Featured Event -->
      <section class="featured-event">
        <div class="section-header"><h3>FEATURED EVENT</h3></div>
        ${nextEvent ? `
          <div class="event-card-featured" onclick="window.__nav('events')">
            <div class="event-date-box">
              <strong>${new Date(nextEvent.date).getDate()}</strong>
              <small>${new Date(nextEvent.date).toLocaleString('en', { month: 'short' })}</small>
            </div>
            <div class="event-info">
              <h4>${sanitizeHTML(nextEvent.title)}</h4>
              <p>${sanitizeHTML(nextEvent.location || 'TBA')} · ${Object.keys(nextEvent.rsvps || {}).filter(k => nextEvent.rsvps[k] === 'going').length}/${nextEvent.capacity || 50} Going</p>
            </div>
          </div>
        ` : `<p style="color:var(--text-muted);">No upcoming events.</p>`}
      </section>

      <!-- Official Broadcasts -->
      <section class="broadcasts">
        <div class="section-header"><h3>OFFICIAL BROADCASTS</h3></div>
        ${announcements.length ? announcements.map(a => `
          <div class="broadcast-item">
            <span class="material-symbols-rounded">campaign</span>
            <p>${sanitizeHTML(a)}</p>
            <small>${new Date().toLocaleDateString()}</small>
          </div>
        `).join('') : '<p style="color:var(--text-muted);">No announcements.</p>'}
      </section>

      <!-- Top Standings -->
      <section class="top-standings">
        <div class="section-header"><h3>TOP STANDINGS</h3></div>
        ${topMembers.map((m, i) => `
          <div class="standings-item ${m.studentId === member.studentId ? 'highlight' : ''}">
            <span class="rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
            <div>
              <strong>${sanitizeHTML(m.name)}</strong>
              <small>Level ${Gamification.getLevel(m.exp).level} · ${sanitizeHTML(m.position || 'Member')}</small>
            </div>
            <span class="exp">${m.exp} EXP</span>
          </div>
        `).join('')}
      </section>
    `;

    document.getElementById('content').innerHTML = html;
  }
};

// ================================================================
// VIEW: Learning Center – Orange Design
// ================================================================
const Learning = {
  currentCategory: 'all',
  currentTopic: 'constitution',
  searchTerm: '',
  topics: [
    { id: 'constitution', title: '1987 Present Constitution', category: 'constitutions', icon: 'gavel', takeaway: 'The Constitution is the country’s highest law and protects fundamental rights.' },
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
    const filtered = this.topics.filter(t => 
      (this.currentCategory === 'all' || t.category === this.currentCategory) &&
      t.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    const active = this.topics.find(t => t.id === this.currentTopic) || filtered[0] || this.topics[0];

    let html = `
      <section class="learning-header">
        <p class="eyebrow">POLSCI STUDY SPACE</p>
        <h2>Academic Learning Center</h2>
        <p>Explore Philippine constitutions, test your knowledge, and ask the AI Constitutional Advisor for support.</p>
      </section>

      <div class="learning-tabs">
        ${['all','constitutions','government','current','organization','review'].map(cat => `
          <button class="tab-btn ${this.currentCategory === cat ? 'active' : ''}" data-category="${cat}">
            ${cat === 'all' ? 'All Topics' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        `).join('')}
      </div>

      <label class="search-box">
        <span class="material-symbols-rounded">search</span>
        <input id="learning-search" placeholder="Search study topic..." value="${sanitizeHTML(this.searchTerm)}">
      </label>

      <div class="learning-layout">
        <div class="topic-sidebar">
          ${filtered.map(t => `
            <button class="topic-item ${active.id === t.id ? 'selected' : ''}" data-topic="${t.id}">
              <span class="material-symbols-rounded">${t.icon}</span>
              <span>
                <strong>${sanitizeHTML(t.title)}</strong>
                <small>${t.category.toUpperCase()}</small>
              </span>
              ${progress.quizPassed.includes(t.id) ? '<span class="badge-complete">PASSED</span>' : ''}
            </button>
          `).join('')}
        </div>

        <div class="topic-content">
          ${this.renderTopic(active, progress)}
        </div>
      </div>
    `;

    document.getElementById('content').innerHTML = html;

    // Attach event listeners
    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCategory = btn.dataset.category;
        this.render();
      });
    });
    document.querySelectorAll('[data-topic]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTopic = btn.dataset.topic;
        this.markViewed(this.currentTopic);
        this.render();
      });
    });
    document.getElementById('learning-search')?.addEventListener('input', e => {
      this.searchTerm = e.target.value;
      this.render();
    });
  },
  renderTopic(topic, progress) {
    const resources = Storage.getAppData().learningResources || {};
    const quiz = this.quizzes[topic.id];
    // Grab some content for the principles section
    const content = resources[topic.id] || 'Content not available.';
    // For state policies, use a default or extract from constitution
    const statePolicies = resources['state_policies'] || 'The State shall promote a just and dynamic social order that will ensure the prosperity and independence of the nation and free the people from poverty through policies that provide adequate social services, promote full employment, a rising standard of living, and an improved quality of life.';

    return `
      <div class="topic-heading">
        <h3>${sanitizeHTML(topic.title)}</h3>
        <span class="topic-category">${topic.category}</span>
      </div>
      <div class="principles">
        <h4>PRINCIPLES</h4>
        <div>${sanitizeHTML(content).replace(/\n/g, '<br>')}</div>
      </div>
      <div class="constitutional-advisor">
        <div class="advisor-header">
          <span class="material-symbols-rounded">smart_toy</span>
          <div>
            <strong>CONSTITUTIONAL ADVISOR</strong>
            <small>GEMINI 2.5 · Philippine Law & History Tutor</small>
          </div>
        </div>
        <div class="advisor-state-policies">
          <h5>STATE POLICIES</h5>
          <p>${sanitizeHTML(statePolicies)}</p>
        </div>
        ${quiz ? `
          <div class="advisor-quiz">
            <p><strong>${sanitizeHTML(quiz.question)}</strong></p>
            <div class="quiz-options">
              ${quiz.options.map((opt, idx) => `
                <button onclick="window.__answerLearningQuiz('${topic.id}', ${idx})">${sanitizeHTML(opt)}</button>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },
  answerQuiz(topicId, answer) {
    const quiz = this.quizzes[topicId];
    if (!quiz) return;
    if (answer !== quiz.answer) return UI.toast({ message: 'Not quite—try again and reread the key takeaway.', type: 'warning' });
    const progress = this.getProgress();
    if (!progress.quizPassed.includes(topicId)) {
      progress.quizPassed.push(topicId);
      this.saveProgress(progress);
      Gamification.addExp(Auth.currentUser.studentId, 20, `Completed ${this.topics.find(t => t.id === topicId)?.title} quiz`);
      UI.confetti({ count: 25 });
    }
    UI.toast({ message: `Correct! ${quiz.explanation} +20 EXP`, type: 'success' });
    this.render();
  }
};

// ================================================================
// VIEW: Events – Orange Design
// ================================================================
const Events = {
  render() {
    const data = Storage.getAppData();
    const userId = Auth.currentUser?.studentId;
    const events = [...data.events].sort((a, b) => new Date(a.date) - new Date(b.date));

    let html = `
      <section class="events-header">
        <p class="eyebrow">SMC POLSCI CALENDAR</p>
        <h2>Organization Events & Seminars</h2>
        <p>Verify attendance to earn EXP and build your professional organization portfolio.</p>
      </section>

      <div class="events-toolbar">
        <div class="filter-buttons">
          <button class="filter-btn active" data-filter="all">All Events</button>
          <button class="filter-btn" data-filter="schedule">My Personal Schedule</button>
        </div>
        <div class="search-filter">
          <span class="material-symbols-rounded">search</span>
          <input id="event-search" placeholder="Search events, venues...">
          <select id="event-type-filter">
            <option value="all">All Types</option>
            <option value="assembly">Assembly</option>
            <option value="competition">Competition</option>
            <option value="sports">Sports</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>
      </div>

      <div id="event-list">
        ${events.map(e => this.renderCard(e, userId)).join('')}
      </div>
    `;

    document.getElementById('content').innerHTML = html;

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterList();
      });
    });
    document.getElementById('event-search')?.addEventListener('input', () => this.filterList());
    document.getElementById('event-type-filter')?.addEventListener('change', () => this.filterList());

    // RSVP buttons
    document.querySelectorAll('[data-rsvp]').forEach(btn => {
      btn.addEventListener('click', () => this.rsvp(Number(btn.dataset.event), btn.dataset.rsvp));
    });
    // Check-in buttons
    document.querySelectorAll('[data-checkin]').forEach(btn => {
      btn.addEventListener('click', () => this.checkin(Number(btn.dataset.checkin)));
    });
  },
  renderCard(event, userId) {
    const past = new Date(event.date) < new Date();
    const going = Object.keys(event.rsvps || {}).filter(k => event.rsvps[k] === 'going').length;
    const capacity = event.capacity || 50;
    const userRsvp = event.rsvps?.[userId] || '';

    return `
      <article class="event-card">
        <div class="event-date-block">
          <strong>${new Date(event.date).getDate()}</strong>
          <small>${new Date(event.date).toLocaleString('en', { month: 'short' })}</small>
        </div>
        <div class="event-details">
          <span class="event-type">${event.type.toUpperCase()}</span>
          <h4>${sanitizeHTML(event.title)}</h4>
          <p>${sanitizeHTML(event.location || 'TBA')} · ${going}/${capacity} going</p>
          <p class="event-desc">${sanitizeHTML(event.description || '')}</p>
          ${!past ? `
            <div class="rsvp-buttons">
              <button class="rsvp-btn ${userRsvp === 'going' ? 'selected' : ''}" data-rsvp="going" data-event="${event.id}">Going</button>
              <button class="rsvp-btn ${userRsvp === 'maybe' ? 'selected' : ''}" data-rsvp="maybe" data-event="${event.id}">Maybe</button>
              <button class="rsvp-btn ${userRsvp === 'no' ? 'selected' : ''}" data-rsvp="no" data-event="${event.id}">Can't Go</button>
            </div>
          ` : ''}
        </div>
        <div class="event-exp">+${event.exp} EXP</div>
      </article>
    `;
  },
  filterList() {
    const query = document.getElementById('event-search')?.value.toLowerCase() || '';
    const type = document.getElementById('event-type-filter')?.value || 'all';
    const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    document.querySelectorAll('#event-list .event-card').forEach(card => {
      const title = card.querySelector('h4')?.textContent?.toLowerCase() || '';
      const cardType = card.querySelector('.event-type')?.textContent?.toLowerCase() || '';
      const match = title.includes(query) && (type === 'all' || cardType === type);
      card.style.display = match ? '' : 'none';
    });
  },
  rsvp(eventId, status) {
    const data = Storage.getAppData();
    const event = data.events.find(e => e.id === eventId);
    const userId = Auth.currentUser?.studentId;
    if (!event || !userId) return;
    event.rsvps ||= {};
    const going = Object.values(event.rsvps).filter(v => v === 'going').length;
    if (status === 'going' && event.rsvps[userId] !== 'going' && going >= (event.capacity || 50)) {
      return UI.toast({ message: 'This event is full. You can still select Maybe.', type: 'warning' });
    }
    event.rsvps[userId] = status;
    Storage.saveAppData(data);
    UI.toast({ message: status === 'going' ? 'You\'re going!' : 'RSVP updated.', type: 'success' });
    // Update quest progress for RSVP
    if (status === 'going') Storage.updateQuestProgress('rsvp');
    this.render();
  },
  checkin(eventId) {
    const user = Auth.currentUser;
    if (!user) return;
    const data = Storage.getAppData();
    const event = data.events.find(e => e.id === eventId);
    const member = data.members.find(m => m.studentId === user.studentId);
    if (!event || !member) return UI.toast({ message: 'Event not found.', type: 'error' });
    const today = new Date().toISOString().split('T')[0];
    if (member.attendance?.includes(today)) return UI.toast({ message: 'You already checked in today!', type: 'warning' });
    member.attendance ||= [];
    member.attendance.push(today);
    data.checkIns ||= [];
    data.checkIns.push({ memberId: user.studentId, eventId, date: today, exp: event.exp });
    Storage.saveAppData(data);
    Gamification.addExp(user.studentId, event.exp, `Attended ${event.title}`);
    Auth.currentUser = { ...user, ...member };
    Storage.setCurrentUser(Auth.currentUser);
    Storage.updateQuestProgress('checkin');
    UI.toast({ message: `Attendance confirmed. +${event.exp} EXP`, type: 'success' });
    this.render();
  },
  downloadCalendar(eventId) {
    const event = Storage.getAppData().events.find(e => e.id === eventId);
    if (!event) return;
    const date = event.date.replaceAll('-', '');
    const esc = v => String(v || '').replace(/[\\,;]/g, '\\$&').replace(/\n/g, '\\n');
    const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:sepolscis-${event.id}@sepolscis\r\nDTSTART:${date}T090000\r\nDTEND:${date}T110000\r\nSUMMARY:${esc(event.title)}\r\nLOCATION:${esc(event.location)}\r\nDESCRIPTION:${esc(event.description)}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

// ================================================================
// VIEW: Opportunities – Orange Design
// ================================================================
const Opportunities = {
  render() {
    const data = Storage.getAppData();
    const userId = Auth.currentUser?.studentId;
    const items = [...data.opportunities].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    let html = `
      <section class="opps-header">
        <p class="eyebrow">SMC CAREERS BOARD</p>
        <h2>Opportunities & Internships</h2>
        <p>Curated public leadership fellowships, civic volunteer networks, and internships exclusive to Political Science students.</p>
      </section>

      <div class="opps-filters">
        ${['All Board','Scholarships','Internships','Debates','Volunteer Work'].map(label => `
          <button class="filter-btn ${label === 'All Board' ? 'active' : ''}" data-filter="${label.replace(' ', '').toLowerCase()}">${label}</button>
        `).join('')}
      </div>

      <div id="opps-list">
        ${items.map(item => `
          <article class="opps-card" data-type="${item.type.toLowerCase()}">
            <div class="opps-type">${item.type.toUpperCase()}</div>
            <h4>${sanitizeHTML(item.title)}</h4>
            <p class="opps-org">${sanitizeHTML(item.organization)}</p>
            <p class="opps-desc">${sanitizeHTML(item.description)}</p>
            <div class="opps-footer">
              <span>📅 Due: ${item.deadline}</span>
              <button class="track-btn ${item.savedBy?.includes(userId) ? 'saved' : ''}" onclick="window.__saveOpportunity('${item.id}')">
                ${item.savedBy?.includes(userId) ? '★ Tracked' : '☆ Track Deadline'}
              </button>
            </div>
          </article>
        `).join('')}
      </div>
    `;

    document.getElementById('content').innerHTML = html;

    // Filter buttons
    document.querySelectorAll('.opps-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.opps-filters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('#opps-list .opps-card').forEach(card => {
          const type = card.dataset.type || '';
          card.style.display = filter === 'allboard' || type === filter ? '' : 'none';
        });
      });
    });
  },
  save(id) {
    const data = Storage.getAppData();
    const item = data.opportunities.find(x => x.id === id);
    const userId = Auth.currentUser?.studentId;
    if (!item || !userId) return;
    item.savedBy ||= [];
    if (item.savedBy.includes(userId)) {
      item.savedBy = item.savedBy.filter(x => x !== userId);
    } else {
      item.savedBy.push(userId);
    }
    Storage.saveAppData(data);
    UI.toast({ message: item.savedBy.includes(userId) ? 'Opportunity saved.' : 'Removed from saved.', type: 'success' });
    this.render();
  }
};

// ================================================================
// VIEW: Portfolio (Rewards) – Orange Design
// ================================================================
const Portfolio = {
  render() {
    const data = Storage.getAppData();
    const member = data.members.find(m => m.studentId === Auth.currentUser?.studentId);
    if (!member) return;

    const checkIns = data.checkIns?.filter(c => c.memberId === member.studentId) || [];
    const badges = Gamification.getMemberBadges(member.studentId);
    const volunteerHours = checkIns.reduce((sum, c) => {
      const ev = data.events.find(e => e.id === c.eventId);
      return sum + (ev?.type === 'volunteer' ? 4 : 0);
    }, 0);
    const unlocked = badges.filter(b => b.unlocked);

    let html = `
      <section class="portfolio-header">
        <p class="eyebrow">SMC POLSCI VERIFIED RECORD</p>
        <h2>${sanitizeHTML(member.name)}</h2>
        <p>Course: ${sanitizeHTML(member.course)} · Academic Year: ${member.year}</p>
      </section>

      <div class="portfolio-stats">
        <div><strong>${checkIns.length}</strong> Attended Events</div>
        <div><strong>${unlocked.length}</strong> Earned Badges</div>
        <div><strong>${volunteerHours}h</strong> Volunteer Hours</div>
      </div>

      <section class="badge-grid">
        <h3>HONOR SOCIETY</h3>
        <p>Unlocked Badges & Achievements</p>
        <div class="badge-list">
          ${badges.map(b => `
            <div class="badge-item ${b.unlocked ? 'unlocked' : 'locked'}">
              <span class="badge-icon">${b.icon}</span>
              <div>
                <strong>${sanitizeHTML(b.name)}</strong>
                <small>${b.unlocked ? 'ACTIVE' : 'LOCKED'}</small>
                <p>${sanitizeHTML(b.desc)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;

    document.getElementById('content').innerHTML = html;
  }
};

// ================================================================
// VIEW: Profile (ID & Profile) – Orange Design
// ================================================================
const Profile = {
  render() {
    const data = Storage.getAppData();
    const member = data.members.find(m => m.studentId === Auth.currentUser?.studentId);
    if (!member) return;

    let html = `
      <section class="digital-id">
        <div class="id-header">
          <img src="logo.png" alt="SEPOLSCIS">
          <div>
            <strong>SEPOLSCIS</strong>
            <small>DIGITAL MEMBER ID</small>
          </div>
          <span class="verified-badge">VERIFIED</span>
        </div>
        <div class="id-body">
          <div class="id-avatar">${sanitizeHTML(member.name.charAt(0))}</div>
          <div>
            <h3>${sanitizeHTML(member.name)}</h3>
            <p>${sanitizeHTML(member.course)}</p>
            <p>ID NUMBER: ${sanitizeHTML(member.studentId)}</p>
            <p>EST. 2026 · ${member.membership.toUpperCase()} MEMBER</p>
          </div>
          <div class="id-qr"></div>
        </div>
      </section>

      <section class="profile-config">
        <h3>Profile Configurations</h3>
        <div class="config-item"><span>Student ID</span><span>${sanitizeHTML(member.studentId)}</span></div>
        <div class="config-item"><span>Major Department</span><span>${sanitizeHTML(member.course)}</span></div>
        <div class="config-item"><span>Registered Email</span><span>${sanitizeHTML(member.email || 'Not set')}</span></div>
        <div class="config-item"><span>Enrollment Year</span><span>${member.year} Year</span></div>
      </section>

      <section class="grade-request">
        <p>You can request to convert your checked-in activity points and volunteer service hours into direct college grade credits. Subject to Dean of Students approval.</p>
        ${member.gradeConvRequested ? 
          `<button class="btn-secondary" disabled>Request Submitted</button>` :
          `<button class="btn-primary" onclick="window.__requestGrade()">Request Grade Conversion Approval</button>`
        }
      </section>

      <section class="database-actions">
        <h3>DATABASE ACTIONS & EXPORT</h3>
        <button class="btn-outline" onclick="window.__exportData()">Export Database (JSON)</button>
        <button class="btn-outline danger" onclick="window.__resetApp()">Reset All App Data</button>
      </section>
    `;

    document.getElementById('content').innerHTML = html;
  }
};

// ================================================================
// VIEW: Officer (Admin) – Orange Design
// ================================================================
const Officer = {
  renderDashboard() {
    if (!Auth.isOfficer()) return;
    const data = Storage.getAppData();
    const total = data.members.length;
    const avgExp = Math.round(data.members.reduce((s, m) => s + m.exp, 0) / total) || 0;
    const pendingGrievances = data.grievances.filter(g => g.status !== 'resolved').length;
    const gradeRequests = data.members.filter(m => m.gradeConvRequested).length;
    const topMembers = [...data.members].sort((a, b) => b.exp - a.exp).slice(0, 5);

    let html = `
      <section class="admin-header">
        <p class="eyebrow">ADMINISTRATIVE AUTHORIZATION ACCESS</p>
        <h2>Officer Operations Desk</h2>
        <p>Active Officer: ${sanitizeHTML(Auth.currentUser.name)} (${sanitizeHTML(Auth.currentUser.position || 'Officer')})</p>
      </section>

      <div class="admin-actions">
        <button onclick="window.__showAnnouncementForm()">📢 Broadcast Announcement</button>
        <button onclick="window.__createEvent()">📅 Create Board Event</button>
        <button onclick="window.__awardBadge()">🏅 Award Honors Badge</button>
        <button onclick="window.__viewGrievances()">📋 Grievances & Grade Requests</button>
      </div>

      <div class="analytics-grid">
        <div class="analytics-card">
          <span class="material-symbols-rounded">groups</span>
          <strong>${total}</strong>
          <span>Total Students</span>
          <small>SMIC PolSci Enrollees</small>
        </div>
        <div class="analytics-card">
          <span class="material-symbols-rounded">trending_up</span>
          <strong>${avgExp}</strong>
          <span>Average Standing</span>
          <small>App‑wide member average</small>
        </div>
        <div class="analytics-card">
          <span class="material-symbols-rounded">gavel</span>
          <strong>${pendingGrievances}</strong>
          <span>Pending Grievances</span>
          <small>${data.grievances.length} submitted overall</small>
        </div>
        <div class="analytics-card">
          <span class="material-symbols-rounded">assignment</span>
          <strong>${gradeRequests}</strong>
          <span>Grade Requests</span>
          <small>Pending officer review</small>
        </div>
      </div>

      <section class="active-enrollment">
        <h3>Active Enrollment Standings</h3>
        ${topMembers.map((m, i) => `
          <div class="enrollment-item">
            <span class="rank">#${i+1}</span>
            <div>
              <strong>${sanitizeHTML(m.name)}</strong>
              <small>${sanitizeHTML(m.course)} · ID: ${sanitizeHTML(m.studentId)}</small>
            </div>
            <span class="exp">${m.exp} EXP</span>
          </div>
        `).join('')}
      </section>
    `;

    document.getElementById('content').innerHTML = html;
  },

  // Keep existing officer methods: showAwardBadge, showAnnouncementForm, createEvent, viewMember, deleteEvent, etc.
  // These are called via global functions; they can remain as they were.
};

// ================================================================
// APP – Main Controller
// ================================================================
const App = {
  init() {
    UI.init();

    setTimeout(() => {
      UI.hideLoading();
    }, 3000);

    this.setupListeners();

    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark');
    }

    this.setupPWA();

    // Show admin nav only for officers
    const adminBtn = document.getElementById('admin-nav-btn');
    if (adminBtn) {
      adminBtn.classList.toggle('hidden', !Auth.isOfficer());
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
          .catch(() => console.log('SW registration failed'));
      });
    }

    // Event delegation for check-in buttons (if any)
    document.getElementById('content')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-checkin]');
      if (btn) {
        const eventId = parseInt(btn.dataset.checkin);
        Events.checkin(eventId);
      }
    });

    this.navigate('home');
    NotifCenter.updateBadge();
    this.updateGreeting();
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
    window.__viewGrievances = () => { this.navigate('events'); setTimeout(() => Grievance.render(), 100); };
    window.__viewGradeRequests = () => { this.navigate('events'); setTimeout(() => Officer.renderGradeRequests(), 100); };
    window.__awardBadge = () => Officer.showAwardBadge();
    window.__showAnnouncementForm = () => Officer.showAnnouncementForm();
    window.__createEvent = () => Officer.createEvent();
    window.__checkinEvent = (id) => Events.checkin(id);
    window.__downloadEventCalendar = (id) => Events.downloadCalendar(id);
    window.__saveOpportunity = (id) => Opportunities.save(id);
    window.__downloadCertificate = () => Portfolio.certificate();
    window.__showLeaderboard = () => { this.navigate('events'); setTimeout(() => Leaderboard.render(), 100); };
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
  },

  navigate(screen) {
    const titleMap = {
      'home': 'Dashboard',
      'learning': 'Academic Learning Center',
      'events': 'PolSci Calendar',
      'opportunities': 'Careers Board',
      'portfolio': 'Verified Record',
      'profile': 'Digital Identity',
      'officer': 'Admin Operations'
    };
    document.getElementById('screen-title').textContent = titleMap[screen] || screen;

    document.querySelectorAll('.nav-item').forEach(b => {
      b.classList.toggle('active', b.dataset.screen === screen);
    });

    switch (screen) {
      case 'home': DashboardV2.render(); break;
      case 'learning': Learning.render(); break;
      case 'events': Events.render(); break;
      case 'opportunities': Opportunities.render(); break;
      case 'portfolio': Portfolio.render(); break;
      case 'profile': Profile.render(); break;
      case 'officer': Officer.renderDashboard(); break;
      default: DashboardV2.render();
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
    if (meta) meta.content = '#2C5E3A';
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
  DashboardV2,
  Events,
  Opportunities,
  Portfolio,
  Profile,
  Learning,
  Officer,
  App
};