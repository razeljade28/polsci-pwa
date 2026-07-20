import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { Gamification } from '../gamification.js';
import { UI, sanitizeHTML } from '../utils.js';

export const Dashboard = {
  render() {
    const data = Storage.getAppData();
    const user = Auth.currentUser;
    const member = data.members.find(m => m.studentId === user?.studentId);
    if (!member) return;

    const totalExp = member.exp;
    const quests = Storage.getQuests();
    const completedQuests = quests.filter(q => q.completed).length;
    const nextEvent = data.events.filter(e => new Date(e.date) >= new Date()).sort((a,b) => new Date(a.date) - new Date(b.date))[0];
    const announcements = data.announcements.slice(0, 3);
    const topMembers = [...data.members].sort((a,b) => b.exp - a.exp).slice(0, 3);
    const hour = new Date().getHours();
    let greeting = 'Evening';
    if (hour < 12) greeting = 'Morning';
    else if (hour < 17) greeting = 'Afternoon';

    let html = `
      <section class="hero-dashboard">
        <div class="hero-top">
          <div>
            <p class="eyebrow">SMC ORGANIZATION PORTAL</p>
            <h2>Good ${greeting}, ${sanitizeHTML(member.name.split(' ')[0])}!</h2>
            <p>Welcome back to SEPOLSCIS. Track your academic standing below.</p>
          </div>
          <div class="hero-exp">
            <strong>${totalExp}</strong>
            <span>Total EXP</span>
          </div>
        </div>
      </section>

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

      <section class="quick-nav">
        <div class="section-header"><h3>QUICK NAVIGATION</h3></div>
        <div class="quick-grid">
          <button onclick="window.__nav('learning')"><span class="material-symbols-rounded">menu_book</span> Lessons</button>
          <button onclick="window.__nav('events')"><span class="material-symbols-rounded">event</span> Events</button>
          <button onclick="window.__nav('portfolio')"><span class="material-symbols-rounded">workspace_premium</span> Rewards</button>
          <button onclick="window.__showGrievance()"><span class="material-symbols-rounded">report</span> Reports</button>
        </div>
      </section>

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
              <p>${sanitizeHTML(nextEvent.location)} · ${Object.keys(nextEvent.rsvps || {}).filter(k => nextEvent.rsvps[k] === 'going').length}/${nextEvent.capacity || 50} Going</p>
            </div>
          </div>
        ` : `<p style="color:var(--text-muted);">No upcoming events.</p>`}
      </section>

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