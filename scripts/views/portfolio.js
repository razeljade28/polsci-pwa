import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { Gamification } from '../gamification.js';
import { UI, sanitizeHTML } from '../utils.js';

export const Portfolio = {
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