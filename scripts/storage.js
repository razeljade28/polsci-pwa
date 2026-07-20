import { learningResources } from '../learning-content.js';

export const Storage = {
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
    }
    // migrations
    if (!data.learningProgress) data.learningProgress = {};
    if (!data.opportunities) data.opportunities = this.getDefaultData().opportunities;
    if (!data.eventFeedback) data.eventFeedback = [];
    if (!data.grievances) data.grievances = [];
    if (!data.notifications) data.notifications = [];
    if (!data.checkIns) data.checkIns = [];
    data.members.forEach(m => {
      if (!m.role) m.role = ['President','Secretary'].includes(m.position) ? 'officer' : 'member';
      if (!m.badges) m.badges = [];
      if (!m.achievements) m.achievements = [];
      if (!m.attendance) m.attendance = [];
    });
    data.events.forEach(e => { e.rsvps ||= {}; e.capacity ||= 50; });
    data.learningResources = { ...learningResources, ...data.learningResources };
    this.saveAppData(data);
    return data;
  },

  saveAppData(data) {
    this.set('appData', data);
  },

  getDefaultData() {
    return {
      events: [ /* ... same as before */ ],
      opportunities: [ /* ... */ ],
      members: [ /* ... */ ],
      learningProgress: {},
      grievances: [],
      announcements: ['Welcome to SEPOLSCIS Portal!', 'Midterm Reviewer is now available.'],
      notifications: [],
      checkIns: [],
      eventFeedback: [],
      learningResources: learningResources,
      quests: [
        { id: 'q1', title: 'RSVP to an upcoming event', requirement: 'rsvp', progress: 0, target: 1, expReward: 25, completed: false, date: new Date().toDateString() },
        { id: 'q2', title: 'Study a core constitution framework', requirement: 'read', progress: 0, target: 1, expReward: 15, completed: false, date: new Date().toDateString() },
        { id: 'q3', title: 'Submit an advisory grievance entry', requirement: 'grievance', progress: 0, target: 1, expReward: 25, completed: false, date: new Date().toDateString() }
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
    data.notifications.unshift(notif);
    this.saveAppData(data);
    return notif;
  },
  getUnreadCount() {
    const data = this.getAppData();
    return (data.notifications || []).filter(n => !n.read).length;
  },
  markAllRead() {
    const data = this.getAppData();
    data.notifications?.forEach(n => n.read = true);
    this.saveAppData(data);
  },

  getQuests() {
    const data = this.getAppData();
    const today = new Date().toDateString();
    if (data.quests[0]?.date !== today) {
      data.quests = data.quests.map(q => ({ ...q, progress: 0, completed: false, date: today }));
      this.saveAppData(data);
    }
    return data.quests;
  },
  updateQuestProgress(requirement, amount = 1) {
    const data = this.getAppData();
    const today = new Date().toDateString();
    let completed = false;
    data.quests = data.quests.map(q => {
      if (q.date !== today) return { ...q, progress: 0, completed: false, date: today };
      if (q.requirement === requirement && !q.completed) {
        const newProgress = q.progress + amount;
        if (newProgress >= q.target) {
          q.completed = true;
          q.progress = q.target;
          completed = true;
          const member = data.members.find(m => m.studentId === this.getCurrentUser()?.studentId);
          if (member) {
            member.exp += q.expReward;
            // Notif and confetti handled by caller
          }
        } else {
          q.progress = newProgress;
        }
      }
      return q;
    });
    this.saveAppData(data);
    return completed;
  }
};