import { Storage } from '../storage.js';
import { Auth } from '../auth.js';
import { Gamification } from '../gamification.js';
import { UI, sanitizeHTML } from '../utils.js';

export const Events = {
  render() {
    const data = Storage.getAppData();
    const userId = Auth.currentUser?.studentId;
    const events = [...data.events].sort((a,b) => new Date(a.date) - new Date(b.date));

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

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterList();
      });
    });
    document.getElementById('event-search')?.addEventListener('input', () => this.filterList());
    document.getElementById('event-type-filter')?.addEventListener('change', () => this.filterList());

    document.querySelectorAll('[data-rsvp]').forEach(btn => {
      btn.addEventListener('click', () => this.rsvp(Number(btn.dataset.event), btn.dataset.rsvp));
    });
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
          <p>${sanitizeHTML(event.location)} · ${going}/${capacity} going</p>
          <p class="event-desc">${sanitizeHTML(event.description)}</p>
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
  }
};