import { Storage } from './storage.js';
import { NotifCenter } from './notifications.js';
import { UI } from './utils.js';
import { Auth } from './auth.js';

export const Gamification = {
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
      NotifCenter.add(`Level Up! ${newLevel.title}`, `You reached Level ${newLevel.level} with ${member.exp} EXP!`, 'success', 'rocket_launch');
      UI.confetti({ count: 100 });
      this.checkBadges(studentId);
    }
    if (Auth.currentUser?.studentId === studentId) {
      Auth.currentUser.exp = member.exp;
      Storage.setCurrentUser(Auth.currentUser);
    }
    return { oldExp, newExp: member.exp, gained: amount, level: newLevel };
  },

  getBadgeDefinitions() {
    return [
      { id: 'b1', name: 'New Member', icon: '🌟', condition: 'exp >= 0', desc: 'Successfully joined SEPOLSCIS' },
      { id: 'b2', name: 'Active Member', icon: '🔥', condition: 'exp >= 100', desc: 'Reached 100 EXP' },
      { id: 'b3', name: 'Perfect Attendance', icon: '✅', condition: 'attendance >= 5', desc: 'Attended 5 events' },
      { id: 'b4', name: 'Best Debater', icon: '🎤', condition: 'achievements.includes("Debate Winner")', desc: 'Won a debate' },
      { id: 'b5', name: 'MVP', icon: '🏀', condition: 'achievements.includes("Sports MVP")', desc: 'Sports MVP' },
      { id: 'b6', name: 'Quiz Bee Champ', icon: '🏆', condition: 'achievements.includes("Quiz Bee Champion")', desc: 'Quiz Bee winner' },
      { id: 'b7', name: 'Good Samaritan', icon: '🤝', condition: 'exp >= 200', desc: '200+ EXP' },
      { id: 'b8', name: 'Executive Leader', icon: '👑', condition: 'position === "President"', desc: 'Served as President' },
      { id: 'b9', name: 'Dean\'s Award', icon: '🎓', condition: 'exp >= 500', desc: '500+ EXP' },
      { id: 'b10', name: 'Senior Counselor', icon: '⭐', condition: 'exp >= 300', desc: '300+ EXP' },
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
        const attendance = member.attendance?.length || 0;
        const achievements = member.achievements || [];
        const position = member.position || '';
        conditionMet = new Function('exp', 'attendance', 'achievements', 'position',
          `return ${def.condition};`)(exp, attendance, achievements, position);
      } catch { conditionMet = false; }
      if (conditionMet) {
        member.badges.push(def.id);
        unlocked++;
        NotifCenter.add(`Badge Unlocked: ${def.name}`, `You earned the "${def.name}" badge! ${def.desc}`, 'success', 'workspace_premium');
        UI.confetti({ count: 60 });
      }
    });
    if (unlocked > 0) {
      Storage.saveAppData(data);
      if (Auth.currentUser?.studentId === studentId) {
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
    return definitions.map(def => ({ ...def, unlocked: member.badges.includes(def.id) }));
  }
};